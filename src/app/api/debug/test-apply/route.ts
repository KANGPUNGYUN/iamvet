import { NextRequest, NextResponse } from "next/server";
import { getJobById, createApplication } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    console.log('=== Testing job apply functions ===');
    
    // Test getJobById function
    const job = await getJobById('HlstieUzUGIpyrDS');
    console.log('Job found:', !!job);
    console.log('Job isActive:', job?.isActive);
    console.log('Job hospitalId:', job?.hospitalId);

    // Test createApplication (with real data)
    try {
      const testApplication = await createApplication({
        jobId: 'HlstieUzUGIpyrDS',
        veterinarianId: 'mVTzzWLtXOtuNwJ_',
        status: 'PENDING'
      });
      console.log('Test application created:', !!testApplication);
      console.log('Application ID:', testApplication?.id);
    } catch (appError) {
      console.log('Application creation test error:', {
        message: appError instanceof Error ? appError.message : 'Unknown',
        code: (appError as any)?.code,
        detail: (appError as any)?.detail,
        constraint: (appError as any)?.constraint
      });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        jobFound: !!job,
        jobActive: job?.isActive,
        jobHospitalId: job?.hospitalId
      }
    });
  } catch (error) {
    console.error('Debug test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        code: (error as any)?.code,
        detail: (error as any)?.detail
      }
    }, { status: 500 });
  }
}