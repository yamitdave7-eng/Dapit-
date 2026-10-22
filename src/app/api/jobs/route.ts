import { NextRequest, NextResponse } from 'next/server';
import { createJob, databaseError, getJobs } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const jobType = searchParams.get('jobType') || undefined;
    const workplaceType = searchParams.get('workplaceType') || undefined;

    const jobs = await getJobs(search, jobType, workplaceType);
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount(['business_owner', 'admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (!body.title || !body.businessName || !body.businessId || !body.jobType) {
      return NextResponse.json({ success: false, error: 'Title, business name, and job type are required' }, { status: 400 });
    }

    if (auth.context.profile.role !== 'admin') {
      const { data: business, error } = await auth.context.supabase.from('marketplace_records').select('owner_id,data').eq('id', body.businessId).eq('kind', 'business').maybeSingle();
      if (error) throw error;
      if (!business || business.owner_id !== auth.context.user.id) return NextResponse.json({ success: false, error: 'Create a place or service listing first, then post a job under that listing.' }, { status: 403 });
      body.businessName = (business.data as { name?: string }).name || body.businessName;
    }
    const job = await createJob({
      title: body.title,
      businessId: body.businessId || 'biz-custom',
      businessName: body.businessName,
      businessLogo: body.businessLogo || undefined,
      location: body.location || 'Local Community',
      neighborhood: body.neighborhood || 'Central',
      workplaceType: body.workplaceType || 'On-site',
      jobType: body.jobType || 'Part-time',
      salaryRange: body.salaryRange || 'Competitive Hourly Pay',
      description: body.description || '',
      requirements: Array.isArray(body.requirements) ? body.requirements : (body.requirements ? body.requirements.split('\n').filter(Boolean) : ['Willingness to learn and contribute']),
      benefits: Array.isArray(body.benefits) ? body.benefits : (body.benefits ? body.benefits.split('\n').filter(Boolean) : ['Supportive team culture']),
      deadline: body.deadline || 'Open until filled',
    }, auth.context.user.id);

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}


