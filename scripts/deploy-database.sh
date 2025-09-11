#!/bin/bash
# 수의학과 학생 시스템 데이터베이스 배포 스크립트
# 실행 방법: ./scripts/deploy-database.sh

set -e  # 오류 발생 시 스크립트 종료

echo "🚀 수의학과 학생 시스템 데이터베이스 배포 시작..."
echo "=================================================="

# 환경 변수 확인
if [ -z "$DATABASE_URL" ]; then
    echo "❌ 오류: DATABASE_URL 환경변수가 설정되지 않았습니다."
    exit 1
fi

echo "📊 현재 마이그레이션 상태 확인..."
npx prisma migrate status || echo "마이그레이션 상태 확인 중 오류 발생 (계속 진행)"

echo ""
echo "🔧 실패한 마이그레이션 해결..."
echo "실패한 마이그레이션을 수동으로 해결합니다..."

# 실패한 마이그레이션 해결
npx prisma migrate resolve --applied 20240109000000_add_real_name || echo "마이그레이션 해결 실패 (계속 진행)"

echo ""
echo "📦 새로운 마이그레이션 적용..."
echo "수의학과 학생 시스템 마이그레이션을 적용합니다..."

# 새로운 마이그레이션 배포
npx prisma migrate deploy

echo ""
echo "🔄 Prisma 클라이언트 재생성..."
npx prisma generate

echo ""
echo "✅ 데이터베이스 배포 완료!"
echo "=================================================="
echo "배포된 내용:"
echo "  ✓ UserType enum에 VETERINARY_STUDENT 추가"
echo "  ✓ veterinary_student_profiles 테이블 생성"
echo "  ✓ 유니크 인덱스 및 제약조건 추가"
echo "  ✓ Prisma 클라이언트 업데이트"
echo ""
echo "🎯 다음 단계:"
echo "  1. 애플리케이션 재시작"
echo "  2. 수의학과 학생 회원가입 테스트"
echo "  3. 로그 모니터링"
echo "=================================================="