import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApplication, query } from "@/lib/database";

export const POST = withAuth(
  async (request: NextRequest, context: any) => {
    try {
      const params = await context.params;
      const jobId = params.id;
      const user = (request as any).user;
    
      console.log('=== Apply route called ===');
      console.log('Job ID:', jobId);
      console.log('User:', { userId: user.userId, userType: user.userType });
      
      // Check if already applied
      const existingApplication = await query(
        `SELECT id FROM applications 
         WHERE "jobId" = $1 AND "veterinarianId" = $2`,
        [jobId, user.userId]
      );
      
      if (existingApplication && existingApplication.length > 0) {
        return NextResponse.json({
          status: 'error',
          message: '이미 지원한 채용공고입니다'
        }, { status: 400 });
      }
      
      // Create application in database
      const application = await createApplication({
        jobId,
        veterinarianId: user.userId,
        status: "PENDING",
      });
      
      console.log('Application created:', !!application, 'ID:', application?.id);
      
      return NextResponse.json({
        status: 'success',
        message: '지원이 완료되었습니다',
        data: {
          applicationId: application.id,
          status: application.status,
        }
      });
  } catch (error) {
    console.error('Simple apply route error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    // Handle specific duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json({
        status: 'error',
        message: '이미 지원한 채용공고입니다'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
    }
  }
);