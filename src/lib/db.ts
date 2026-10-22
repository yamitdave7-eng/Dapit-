import fs from 'fs';
import path from 'path';
import {
  Business,
  Event,
  Job,
  Application,
  CommunityPost,
  TalentProfile,
} from '@/types';
import {
  initialBusinesses,
  initialEvents,
  initialJobs,
  initialApplications,
  initialCommunityPosts,
  initialTalent,
} from './initialData';

interface DatabaseSchema {
  businesses: Business[];
  events: Event[];
  jobs: Job[];
  applications: Application[];
  communityPosts: CommunityPost[];
  talent: TalentProfile[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'dapit_db.json');

// Global memory cache to prevent re-reading on every request in dev
let memoryDb: DatabaseSchema | null = null;

function loadDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      memoryDb = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read persistent DB file, using initial data:', err);
  }

  // Initialize fresh
  const freshDb: DatabaseSchema = {
    businesses: [...initialBusinesses],
    events: [...initialEvents],
    jobs: [...initialJobs],
    applications: [...initialApplications],
    communityPosts: [...initialCommunityPosts],
    talent: [...initialTalent],
  };

  saveDatabase(freshDb);
  memoryDb = freshDb;
  return freshDb;
}

function saveDatabase(db: DatabaseSchema) {
  memoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write persistent DB file, running in-memory:', err);
  }
}

// Business operations
export async function getBusinesses(search?: string, category?: string) {
  const db = loadDatabase();
  let list = db.businesses;

  if (category && category !== 'All') {
    list = list.filter((b) => b.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.neighborhood.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function getBusinessById(id: string) {
  const db = loadDatabase();
  return db.businesses.find((b) => b.id === id) || null;
}

export async function createBusiness(data: Omit<Business, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'activeJobsCount' | 'activeEventsCount'>) {
  const db = loadDatabase();
  const newBusiness: Business = {
    ...data,
    id: `biz-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 1,
    isVerified: true,
    activeJobsCount: 0,
    activeEventsCount: 0,
  };
  db.businesses.unshift(newBusiness);
  saveDatabase(db);
  return newBusiness;
}

// Event operations
export async function getEvents(search?: string, category?: string) {
  const db = loadDatabase();
  let list = db.events;

  if (category && category !== 'All') {
    list = list.filter((e) => e.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.businessName.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.neighborhood.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function createEvent(data: Omit<Event, 'id' | 'rsvpCount' | 'attendees'>) {
  const db = loadDatabase();
  const newEvent: Event = {
    ...data,
    id: `evt-${Date.now()}`,
    rsvpCount: 1,
    attendees: ['you@dapit.community'],
  };
  db.events.unshift(newEvent);

  // Update business event count
  const biz = db.businesses.find((b) => b.id === newEvent.businessId);
  if (biz) {
    biz.activeEventsCount += 1;
  }

  saveDatabase(db);
  return newEvent;
}

export async function rsvpEvent(eventId: string, userEmail: string = 'user@dapit.community') {
  const db = loadDatabase();
  const event = db.events.find((e) => e.id === eventId);
  if (!event) return null;

  const hasRsvp = event.attendees.includes(userEmail);
  if (hasRsvp) {
    event.attendees = event.attendees.filter((a) => a !== userEmail);
    event.rsvpCount = Math.max(0, event.rsvpCount - 1);
  } else {
    event.attendees.push(userEmail);
    event.rsvpCount += 1;
  }

  saveDatabase(db);
  return { event, isAttending: !hasRsvp };
}

// Job operations
export async function getJobs(search?: string, jobType?: string, workplaceType?: string) {
  const db = loadDatabase();
  let list = db.jobs;

  if (jobType && jobType !== 'All') {
    list = list.filter((j) => j.jobType === jobType);
  }

  if (workplaceType && workplaceType !== 'All') {
    list = list.filter((j) => j.workplaceType === workplaceType);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.businessName.toLowerCase().includes(q) ||
        j.neighborhood.toLowerCase().includes(q) ||
        j.requirements.some((r) => r.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function createJob(data: Omit<Job, 'id' | 'postedAt' | 'applicantsCount'>) {
  const db = loadDatabase();
  const newJob: Job = {
    ...data,
    id: `job-${Date.now()}`,
    postedAt: 'Just now',
    applicantsCount: 0,
  };
  db.jobs.unshift(newJob);

  // Update business hiring status
  const biz = db.businesses.find((b) => b.id === newJob.businessId);
  if (biz) {
    biz.hiringActive = true;
    biz.activeJobsCount += 1;
  }

  saveDatabase(db);
  return newJob;
}

// Application operations
export async function getApplications(businessId?: string, applicantEmail?: string) {
  const db = loadDatabase();
  let list = db.applications;

  if (businessId) {
    list = list.filter((a) => a.businessId === businessId);
  }

  if (applicantEmail) {
    list = list.filter((a) => a.applicantEmail.toLowerCase() === applicantEmail.toLowerCase());
  }

  return list;
}

export async function createApplication(data: Omit<Application, 'id' | 'appliedAt' | 'status'>) {
  const db = loadDatabase();
  const newApp: Application = {
    ...data,
    id: `app-${Date.now()}`,
    appliedAt: 'Just now',
    status: 'Pending',
  };
  db.applications.unshift(newApp);

  // Increment job applicant count
  const job = db.jobs.find((j) => j.id === newApp.jobId);
  if (job) {
    job.applicantsCount += 1;
  }

  saveDatabase(db);
  return newApp;
}

export async function updateApplicationStatus(id: string, status: Application['status']) {
  const db = loadDatabase();
  const app = db.applications.find((a) => a.id === id);
  if (!app) return null;

  app.status = status;
  saveDatabase(db);
  return app;
}

// Community posts operations
export async function getCommunityPosts(category?: string) {
  const db = loadDatabase();
  let list = db.communityPosts;

  if (category && category !== 'All') {
    list = list.filter((p) => p.category === category);
  }

  return list;
}

export async function createCommunityPost(data: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'createdAt'>) {
  const db = loadDatabase();
  const newPost: CommunityPost = {
    ...data,
    id: `post-${Date.now()}`,
    likes: 1,
    commentsCount: 0,
    createdAt: 'Just now',
  };
  db.communityPosts.unshift(newPost);
  saveDatabase(db);
  return newPost;
}

export async function likeCommunityPost(postId: string) {
  const db = loadDatabase();
  const post = db.communityPosts.find((p) => p.id === postId);
  if (!post) return null;

  post.likes += 1;
  saveDatabase(db);
  return post;
}

// Talent operations
export async function getTalentProfiles(search?: string, role?: string) {
  const db = loadDatabase();
  let list = db.talent;

  if (role && role !== 'All') {
    list = list.filter((t) => t.role === role);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q)) ||
        t.lookingFor.some((l) => l.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function createTalentProfile(data: Omit<TalentProfile, 'id'>) {
  const db = loadDatabase();
  const newProfile: TalentProfile = {
    ...data,
    id: `talent-${Date.now()}`,
  };
  db.talent.unshift(newProfile);
  saveDatabase(db);
  return newProfile;
}

// Reset data helper
export async function resetDatabase() {
  const freshDb: DatabaseSchema = {
    businesses: [...initialBusinesses],
    events: [...initialEvents],
    jobs: [...initialJobs],
    applications: [...initialApplications],
    communityPosts: [...initialCommunityPosts],
    talent: [...initialTalent],
  };
  saveDatabase(freshDb);
  return freshDb;
}
