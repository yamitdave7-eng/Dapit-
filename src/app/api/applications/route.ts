import { NextRequest, NextResponse } from 'next/server';
import { getApplications, createApplication, updateApplicationStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || undefined;
    const applicantEmail = searchParams.get('applicantEmail') || undefined;

    const applications = await getApplications(businessId, applicantEmail);
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error in GET /api/applications:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.jobId || !body.jobTitle || !body.applicantName || !body.applicantEmail) {
      return NextResponse.json({ success: false, error: 'Job ID, Job Title, Name, and Email are required' }, { status: 400 });
    }

    const application = await createApplication({
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      businessId: body.businessId || 'biz-1',
      businessName: body.businessName || 'Local Business',
      applicantName: body.applicantName,
      applicantEmail: body.applicantEmail,
      applicantPhone: body.applicantPhone || '',
      applicantRole: body.applicantRole || 'Applicant',
      resumeSummary: body.resumeSummary || 'Resume details provided in application.',
      portfolioUrl: body.portfolioUrl || '',
      coverNote: body.coverNote || '',
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/applications:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Application ID and status are required' }, { status: 400 });
    }

    const updated = await updateApplicationStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PATCH /api/applications:', error);
    return NextResponse.json({ success: false, error: 'Failed to update application' }, { status: 500 });
  }
}
