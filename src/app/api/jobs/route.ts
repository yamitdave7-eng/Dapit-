import { NextRequest, NextResponse } from 'next/server';
import { getJobs, createJob } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const jobType = searchParams.get('jobType') || undefined;
    const workplaceType = searchParams.get('workplaceType') || undefined;

    const jobs = await getJobs(search, jobType, workplaceType);
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.businessName || !body.jobType) {
      return NextResponse.json({ success: false, error: 'Title, business name, and job type are required' }, { status: 400 });
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
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 });
  }
}
