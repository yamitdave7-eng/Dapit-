import { NextRequest, NextResponse } from 'next/server';
import { Application } from '@/types';
import { createApplication, databaseError, getApplications, getJobs, updateApplicationStatus } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

const validStatuses: Application['status'][] = ['Pending', 'Reviewing', 'Interviewing', 'Accepted', 'Rejected'];

export async function GET() {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const applications = await getApplications();
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount(['student', 'resident']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (typeof body.jobId !== 'string') return NextResponse.json({ success: false, error: 'Choose a job before applying.' }, { status: 400 });
    const job = (await getJobs()).find((item) => item.id === body.jobId);
    if (!job) return NextResponse.json({ success: false, error: 'This job is no longer available.' }, { status: 404 });
    const application = await createApplication({
      jobId: job.id,
      jobTitle: job.title,
      businessId: job.businessId,
      businessName: job.businessName,
      applicantName: auth.context.profile.display_name,
      applicantEmail: auth.context.user.email || '',
      applicantPhone: typeof body.applicantPhone === 'string' ? body.applicantPhone.slice(0, 40) : '',
      applicantRole: auth.context.profile.role,
      resumeSummary: typeof body.resumeSummary === 'string' ? body.resumeSummary.slice(0, 3000) : '',
      portfolioUrl: typeof body.portfolioUrl === 'string' ? body.portfolioUrl.slice(0, 500) : '',
      coverNote: typeof body.coverNote === 'string' ? body.coverNote.slice(0, 3000) : '',
    }, auth.context.user.id);
    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAccount(['business_owner', 'admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || !validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: 'Choose an application and a valid status.' }, { status: 400 });
    }
    const updated = await updateApplicationStatus(body.id, body.status);
    if (!updated) return NextResponse.json({ success: false, error: 'Application not found or not managed by your account.' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
