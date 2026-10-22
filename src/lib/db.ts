import 'server-only';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import type { Application, Business, CommunityPost, Event, Job, TalentProfile } from '@/types';
import {
  initialApplications,
  initialBusinesses,
  initialCommunityPosts,
  initialEvents,
  initialJobs,
  initialTalent,
} from '@/lib/initialData';

type RecordKind = 'business' | 'event' | 'job' | 'community' | 'talent';
type MarketplaceRow = { id: string; kind: RecordKind; owner_id: string | null; data: Record<string, unknown> };
type ApplicationRow = { id: string; job_id: string; applicant_id: string; data: Record<string, unknown>; status: Application['status']; created_at: string };

const isConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const makeId = (prefix: string) => `${prefix}-${randomUUID()}`;
const messageOf = (error: unknown) => error instanceof Error ? error.message : 'Database request failed';

async function listRecords<T>(kind: RecordKind): Promise<T[]> {
  if (!isConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('marketplace_records').select('id,kind,owner_id,data').eq('kind', kind).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MarketplaceRow[]).map((row) => row.data as T);
}

async function insertRecord<T extends { id: string }>(kind: RecordKind, data: Omit<T, 'id'>, ownerId: string): Promise<T> {
  if (!isConfigured()) throw new Error('Connect Supabase to save marketplace content. See the deployment setup in README.md.');
  const id = makeId(kind);
  const record = { ...data, id } as T;
  const supabase = await createClient();
  const { error } = await supabase.from('marketplace_records').insert({ id, kind, owner_id: ownerId, data: record });
  if (error) throw error;
  return record;
}

function matchesSearch(value: unknown, search?: string) {
  if (!search) return true;
  return JSON.stringify(value).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
}

export async function getBusinesses(search?: string, category?: string) {
  const businesses = isConfigured() ? await listRecords<Business>('business') : [...initialBusinesses];
  const events = isConfigured() ? await listRecords<Event>('event') : [...initialEvents];
  const jobs = isConfigured() ? await listRecords<Job>('job') : [...initialJobs];
  return businesses
    .filter((business) => !category || category === 'All' || business.category === category)
    .filter((business) => matchesSearch(business, search))
    .map((business) => {
      const activeJobsCount = jobs.filter((job) => job.businessId === business.id).length;
      const activeEventsCount = events.filter((event) => event.businessId === business.id).length;
      return { ...business, activeJobsCount, activeEventsCount, hiringActive: activeJobsCount > 0 };
    });
}

export async function getBusinessById(id: string) {
  return (await getBusinesses()).find((business) => business.id === id) || null;
}

export async function createBusiness(data: Omit<Business, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'activeJobsCount' | 'activeEventsCount'>, ownerId: string) {
  return insertRecord<Business>('business', {
    ...data,
    rating: 0,
    reviewsCount: 0,
    isVerified: false,
    activeJobsCount: 0,
    activeEventsCount: 0,
  }, ownerId);
}

export async function getEvents(search?: string, category?: string, userId?: string) {
  const events = isConfigured() ? await listRecords<Event>('event') : [...initialEvents];
  if (!isConfigured() || !userId) {
    return events.filter((event) => (!category || category === 'All' || event.category === category) && matchesSearch(event, search));
  }
  const supabase = await createClient();
  const { data: rsvps, error } = await supabase.from('record_interactions').select('record_id').eq('interaction_type', 'rsvp').eq('user_id', userId);
  if (error) throw error;
  const attending = new Set((rsvps || []).map((item) => item.record_id));
  return events
    .filter((event) => (!category || category === 'All' || event.category === category) && matchesSearch(event, search))
    .map((event) => ({ ...event, attendees: attending.has(event.id) ? [userId] : [] }));
}

export async function createEvent(data: Omit<Event, 'id' | 'rsvpCount' | 'attendees'>, ownerId: string) {
  return insertRecord<Event>('event', { ...data, rsvpCount: 0, attendees: [] }, ownerId);
}

export async function rsvpEvent(eventId: string, userId: string) {
  if (!isConfigured()) throw new Error('Connect Supabase to RSVP to events.');
  const event = (await listRecords<Event>('event')).find((item) => item.id === eventId);
  if (!event) return null;
  const supabase = await createClient();
  const { data: existing, error: findError } = await supabase.from('record_interactions').select('record_id').eq('record_id', eventId).eq('interaction_type', 'rsvp').eq('user_id', userId).maybeSingle();
  if (findError) throw findError;
  if (existing) {
    const { error } = await supabase.from('record_interactions').delete().eq('record_id', eventId).eq('interaction_type', 'rsvp').eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('record_interactions').insert({ record_id: eventId, interaction_type: 'rsvp', user_id: userId });
    if (error) throw error;
  }
  return (await getEvents(undefined, undefined, userId)).find((item) => item.id === eventId) || null;
}

export async function getJobs(search?: string, jobType?: string, workplaceType?: string) {
  const jobs = isConfigured() ? await listRecords<Job>('job') : [...initialJobs];
  return jobs.filter((job) => (!jobType || jobType === 'All' || job.jobType === jobType)
    && (!workplaceType || workplaceType === 'All' || job.workplaceType === workplaceType)
    && matchesSearch(job, search));
}

export async function createJob(data: Omit<Job, 'id' | 'postedAt' | 'applicantsCount'>, ownerId: string) {
  return insertRecord<Job>('job', { ...data, postedAt: new Date().toISOString(), applicantsCount: 0 }, ownerId);
}

function mapApplication(row: ApplicationRow): Application {
  return { ...(row.data as Omit<Application, 'id' | 'status' | 'appliedAt'>), id: row.id, status: row.status, appliedAt: row.created_at } as Application;
}

export async function getApplications() {
  if (!isConfigured()) return [...initialApplications];
  const supabase = await createClient();
  const { data, error } = await supabase.from('applications').select('id,job_id,applicant_id,data,status,created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return ((data || []) as ApplicationRow[]).map(mapApplication);
}

export async function createApplication(data: Omit<Application, 'id' | 'appliedAt' | 'status'>, applicantId: string) {
  if (!isConfigured()) throw new Error('Connect Supabase to submit applications.');
  const id = makeId('app');
  const supabase = await createClient();
  const { data: jobRow, error: jobError } = await supabase.from('marketplace_records').select('id,kind,data').eq('id', data.jobId).eq('kind', 'job').single();
  if (jobError || !jobRow) throw new Error('This job is no longer available.');
  const { error } = await supabase.from('applications').insert({ id, job_id: data.jobId, applicant_id: applicantId, data, status: 'Pending' });
  if (error) throw error;
  return { ...data, id, status: 'Pending', appliedAt: new Date().toISOString() } as Application;
}

export async function updateApplicationStatus(id: string, status: Application['status']) {
  if (!isConfigured()) throw new Error('Connect Supabase to manage applications.');
  const supabase = await createClient();
  const { data, error } = await supabase.from('applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('id,job_id,applicant_id,data,status,created_at').maybeSingle();
  if (error) throw error;
  return data ? mapApplication(data as ApplicationRow) : null;
}

export async function getCommunityPosts(category?: string) {
  const posts = isConfigured() ? await listRecords<CommunityPost>('community') : [...initialCommunityPosts];
  return posts.filter((post) => (!category || category === 'All' || post.category === category) && matchesSearch(post, category === 'All' ? undefined : undefined));
}

export async function createCommunityPost(data: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'createdAt'>, ownerId: string) {
  return insertRecord<CommunityPost>('community', { ...data, likes: 0, commentsCount: 0, createdAt: new Date().toISOString() }, ownerId);
}

export async function likeCommunityPost(postId: string, userId: string) {
  if (!isConfigured()) throw new Error('Connect Supabase to like community posts.');
  const supabase = await createClient();
  const { error } = await supabase.from('record_interactions').upsert({ record_id: postId, interaction_type: 'like', user_id: userId }, { onConflict: 'record_id,interaction_type,user_id', ignoreDuplicates: true });
  if (error) throw error;
  return (await getCommunityPosts()).find((post) => post.id === postId) || null;
}

export async function getTalentProfiles(search?: string, role?: string) {
  const profiles = isConfigured() ? await listRecords<TalentProfile>('talent') : [...initialTalent];
  return profiles.filter((profile) => (!role || role === 'All' || profile.role === role) && matchesSearch(profile, search));
}

export async function createTalentProfile(data: Omit<TalentProfile, 'id'>, ownerId: string) {
  return insertRecord<TalentProfile>('talent', data, ownerId);
}

export async function getAdminUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('id,display_name,role,location,created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateUserRole(id: string, role: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select('id,display_name,role,location,created_at').single();
  if (error) throw error;
  return data;
}

export async function getAdminSummary() {
  const supabase = await createClient();
  const kinds: RecordKind[] = ['business', 'event', 'job', 'community', 'talent'];
  const counts = await Promise.all(kinds.map(async (kind) => {
    const { count, error } = await supabase.from('marketplace_records').select('id', { count: 'exact', head: true }).eq('kind', kind);
    if (error) throw error;
    return [kind, count || 0] as const;
  }));
  const [{ count: users, error: usersError }, { count: applications, error: appsError }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }),
  ]);
  if (usersError) throw usersError;
  if (appsError) throw appsError;
  return { users: users || 0, applications: applications || 0, records: Object.fromEntries(counts) };
}

export async function getAdminRecords() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('marketplace_records').select('id,kind,owner_id,data,created_at').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data || [];
}

export async function removeMarketplaceRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('marketplace_records').delete().eq('id', id);
  if (error) throw error;
}

export async function seedDemoRecords() {
  const supabase = await createClient();
  const records = [
    ...initialBusinesses.map((data) => ({ id: data.id, kind: 'business', owner_id: null, data })),
    ...initialEvents.map((data) => ({ id: data.id, kind: 'event', owner_id: null, data: { ...data, attendees: [], rsvpCount: 0 } })),
    ...initialJobs.map((data) => ({ id: data.id, kind: 'job', owner_id: null, data: { ...data, applicantsCount: 0 } })),
    ...initialCommunityPosts.map((data) => ({ id: data.id, kind: 'community', owner_id: null, data })),
    ...initialTalent.map((data) => ({ id: data.id, kind: 'talent', owner_id: null, data })),
  ];
  const { error } = await supabase.from('marketplace_records').upsert(records, { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw error;
  return { count: records.length };
}

export function databaseError(error: unknown) {
  return messageOf(error);
}

export async function getOwnedBusinesses(ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('marketplace_records').select('data').eq('kind', 'business').eq('owner_id', ownerId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => row.data as Business);
}
