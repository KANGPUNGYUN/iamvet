#!/bin/bash

# 배포 환경 관리자 시스템 설정 스크립트

echo "🚀 관리자 시스템 배포 시작..."

# 1. 환경변수 설정
echo "📝 환경변수 확인 중..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL 환경변수가 설정되지 않았습니다."
  exit 1
fi

if [ -z "$ADMIN_JWT_SECRET" ]; then
  echo "❌ ADMIN_JWT_SECRET 환경변수가 설정되지 않았습니다."
  exit 1
fi

# 2. Prisma 클라이언트 생성
echo "🔧 Prisma 클라이언트 생성 중..."
npx prisma generate

# 3. 데이터베이스 스키마 동기화
echo "🗄️  데이터베이스 스키마 동기화 중..."
npx prisma db push --force-reset

# 4. 관리자 계정 생성
echo "👤 관리자 계정 생성 중..."
npx tsx src/scripts/create-admin-production.ts

echo "✅ 관리자 시스템 배포 완료!"
echo ""
echo "📋 관리자 로그인 정보:"
echo "   이메일: admin@iamvet.co.kr"
echo "   비밀번호: admin123!@#"
echo ""
echo "⚠️  보안을 위해 첫 로그인 후 반드시 비밀번호를 변경해주세요!"