export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const veterinarianId = params.id;
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");

    // 인재정보 조회
    const resume = await getResumeById(veterinarianId);
    if (!resume || !resume.isProfilePublic) {
      return NextResponse.json(
        createErrorResponse("존재하지 않거나 비공개 프로필입니다"),
        { status: 404 }
      );
    }

    // 조회수 증가
    await incrementResumeViewCount(veterinarianId, userIp);

    // 관련 인재 추천
    const relatedTalents = await getRelatedTalents(
      veterinarianId,
      resume.medicalField,
      5
    );

    const resumeDetail = {
      ...resume,
      relatedTalents,
    };

    return NextResponse.json(
      createApiResponse("success", "인재정보 조회 성공", resumeDetail)
    );
  } catch (error) {
    console.error("Resume detail error:", error);
    return NextResponse.json(
      createErrorResponse("인재정보 조회 중 오류가 발생했습니다"),
      { status: 500 }
    );
  }
}
