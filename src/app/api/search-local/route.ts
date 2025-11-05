import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // 네이버 검색 API 키 확인
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn('네이버 검색 API 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 네이버 지역 검색 API 호출
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&start=1&sort=random`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    );

    if (!response.ok) {
      console.error('네이버 검색 API 오류:', response.status, response.statusText);
      return NextResponse.json(
        { error: '검색 API 호출 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // WGS84 좌표를 위도/경도로 변환
    const convertedItems = data.items?.map((item: any) => ({
      ...item,
      lat: item.mapy ? parseInt(item.mapy) / 10000000 : null,
      lng: item.mapx ? parseInt(item.mapx) / 10000000 : null,
    }));

    return NextResponse.json({
      ...data,
      items: convertedItems
    });

  } catch (error) {
    console.error('지역 검색 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}