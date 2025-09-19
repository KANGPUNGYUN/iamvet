import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { query } from "@/lib/database";

export const DELETE = withAuth(
  async (request: NextRequest, context: any) => {
    try {
      const params = await context.params;
      const jobId = params.id;
      const user = (request as any).user;
    
      console.log('=== Cancel apply route called ===');
      console.log('Job ID:', jobId);
      console.log('User:', { userId: user.userId, userType: user.userType });
      
      // Check if application exists
      const existingApplication = await query(
        `SELECT id, status FROM applications 
         WHERE "jobId" = $1 AND "veterinarianId" = $2`,
        [jobId, user.userId]
      );
      
      if (!existingApplication || existingApplication.length === 0) {
        return NextResponse.json({
          status: 'error',
          message: '지원 내역을 찾을 수 없습니다'
        }, { status: 404 });
      }
      
      // Delete the application
      await query(
        `DELETE FROM applications 
         WHERE "jobId" = $1 AND "veterinarianId" = $2`,
        [jobId, user.userId]
      );
      
      console.log('Application cancelled successfully');
      
      return NextResponse.json({
        status: 'success',
        message: '지원이 취소되었습니다'
      });
    } catch (error) {
      console.error('Cancel apply route error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      
      return NextResponse.json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }
);