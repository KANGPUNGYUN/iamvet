import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { createApplication, query } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { nanoid } from "nanoid";

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
      
      // Get job and hospital information for notification
      const jobInfo = await query(
        `SELECT j.title, j."hospitalId", h."hospitalName" as hospital_name 
         FROM jobs j 
         LEFT JOIN hospitals h ON j."hospitalId" = h."userId"
         WHERE j.id = $1`,
        [jobId]
      );
      
      if (jobInfo && jobInfo.length > 0) {
        const job = jobInfo[0];
        const hospitalName = job.hospital_name || '병원';
        
        try {
          // Create notification for the applicant (confirmation)
          await prisma.notifications.create({
            data: {
              id: nanoid(),
              type: NotificationType.APPLICATION_NEW,
              recipientId: user.userId,
              recipientType: user.userType,
              senderId: job.hospitalId,
              title: '지원 완료',
              content: `${hospitalName}의 "${job.title}" 공고를 정상적으로 지원했습니다.`,
              isRead: false,
              updatedAt: new Date(),
            }
          });
          
          // Create notification for the hospital (new application alert)
          await prisma.notifications.create({
            data: {
              id: nanoid(),
              type: NotificationType.APPLICATION_NEW,
              recipientId: job.hospitalId,
              recipientType: 'HOSPITAL',
              senderId: user.userId,
              title: '새로운 지원자',
              content: `"${job.title}" 공고에 새로운 지원자가 있습니다.`,
              isRead: false,
              updatedAt: new Date(),
            }
          });
          
          console.log('Notifications created for application:', application.id);
        } catch (notificationError) {
          console.error('Failed to create notifications:', notificationError);
          // 알림 생성 실패해도 지원은 성공으로 처리
        }
      }
      
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