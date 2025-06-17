#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 프로젝트 루트 디렉토리
const projectRoot = "IAMVET";

// 디렉토리 생성 함수
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// 파일 생성 함수
function createFile(filePath, content) {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created file: ${filePath}`);
}

// 프로젝트 구조 생성
function createProject() {
  console.log("🚀 Creating IAMVET project structure...\n");

  // 루트 디렉토리 생성
  createDir(projectRoot);

  // Prisma 관련 파일들
  createFile(
    path.join(projectRoot, "prisma/schema.prisma"),
    `// Prisma 스키마 정의
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`
  );

  createFile(
    path.join(projectRoot, "prisma/seed.ts"),
    `// 시드 데이터
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });`
  );

  createDir(path.join(projectRoot, "prisma/migrations"));

  // Next.js App Router 파일들
  createFile(
    path.join(projectRoot, "src/app/layout.tsx"),
    `import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}`
  );

  createFile(
    path.join(projectRoot, "src/app/page.tsx"),
    `export default function HomePage() {
  return (
    <div>
      <h1>IAMVET 홈페이지</h1>
    </div>
  );
}`
  );

  createFile(
    path.join(projectRoot, "src/app/loading.tsx"),
    `export default function Loading() {
  return <div>Loading...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/error.tsx"),
    `'use client';

export default function Error() {
  return <div>Error occurred</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/not-found.tsx"),
    `export default function NotFound() {
  return <div>404 - Page Not Found</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/globals.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;`
  );

  // API Routes
  createFile(
    path.join(projectRoot, "src/app/api/auth/login/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Login API' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/auth/register/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Register API' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/auth/logout/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Logout API' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/veterinarians/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get veterinarians' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Create veterinarian' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/veterinarians/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get veterinarian \${params.id}\` });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Update veterinarian \${params.id}\` });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Delete veterinarian \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/hospitals/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get hospitals' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Create hospital' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/hospitals/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get hospital \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/jobs/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get jobs' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Create job' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/jobs/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get job \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/resumes/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get resumes' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/resumes/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get resume \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/transfers/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get transfers' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/transfers/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get transfer \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/lectures/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get lectures' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/lectures/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get lecture \${params.id}\` });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/applications/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get applications' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/bookmarks/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get bookmarks' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/messages/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get messages' });
}`
  );

  createFile(
    path.join(projectRoot, "src/app/api/messages/[id]/route.ts"),
    `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: \`Get message \${params.id}\` });
}`
  );

  // 페이지 파일들
  createFile(
    path.join(projectRoot, "src/app/member-select/page.tsx"),
    `export default function MemberSelectPage() {
  return <div>회원 유형 선택</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/login/veterinarian/page.tsx"),
    `export default function VeterinarianLoginPage() {
  return <div>수의사 로그인</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/login/hospital/page.tsx"),
    `export default function HospitalLoginPage() {
  return <div>병원 로그인</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/register/veterinarian/page.tsx"),
    `export default function VeterinarianRegisterPage() {
  return <div>수의사 회원가입</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/register/hospital/page.tsx"),
    `export default function HospitalRegisterPage() {
  return <div>병원 회원가입</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/jobs/page.tsx"),
    `export default function JobsPage() {
  return <div>채용공고 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/jobs/loading.tsx"),
    `export default function JobsLoading() {
  return <div>Loading jobs...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/jobs/[id]/page.tsx"),
    `export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <div>채용공고 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/resumes/page.tsx"),
    `export default function ResumesPage() {
  return <div>인재정보 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/resumes/loading.tsx"),
    `export default function ResumesLoading() {
  return <div>Loading resumes...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/resumes/[id]/page.tsx"),
    `export default function ResumeDetailPage({ params }: { params: { id: string } }) {
  return <div>인재정보 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/hospitals/[id]/page.tsx"),
    `export default function HospitalDetailPage({ params }: { params: { id: string } }) {
  return <div>병원 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/lectures/page.tsx"),
    `export default function LecturesPage() {
  return <div>강의영상 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/lectures/loading.tsx"),
    `export default function LecturesLoading() {
  return <div>Loading lectures...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/lectures/[id]/page.tsx"),
    `export default function LectureDetailPage({ params }: { params: { id: string } }) {
  return <div>강의영상 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/transfers/page.tsx"),
    `export default function TransfersPage() {
  return <div>양도양수 게시판</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/transfers/loading.tsx"),
    `export default function TransfersLoading() {
  return <div>Loading transfers...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/transfers/create/page.tsx"),
    `export default function CreateTransferPage() {
  return <div>양도양수 글 작성</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/transfers/[id]/page.tsx"),
    `export default function TransferDetailPage({ params }: { params: { id: string } }) {
  return <div>양도양수 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/transfers/[id]/edit/page.tsx"),
    `export default function EditTransferPage({ params }: { params: { id: string } }) {
  return <div>양도양수 수정: {params.id}</div>;
}`
  );

  // Dashboard 레이아웃
  createFile(
    path.join(projectRoot, "src/app/dashboard/layout.tsx"),
    `export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Dashboard Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}`
  );

  // 수의사 대시보드 페이지들
  createFile(
    path.join(projectRoot, "src/app/dashboard/veterinarian/page.tsx"),
    `export default function VeterinarianDashboardPage() {
  return <div>수의사 대시보드</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/veterinarian/applications/page.tsx"
    ),
    `export default function VeterinarianApplicationsPage() {
  return <div>지원내역</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/veterinarian/bookmarks/page.tsx"),
    `export default function VeterinarianBookmarksPage() {
  return <div>찜한 공고 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/veterinarian/messages/page.tsx"),
    `export default function VeterinarianMessagesPage() {
  return <div>알림/메시지 관리</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/veterinarian/messages/[id]/page.tsx"
    ),
    `export default function VeterinarianMessageDetailPage({ params }: { params: { id: string } }) {
  return <div>메시지 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/veterinarian/profile/page.tsx"),
    `export default function VeterinarianProfilePage() {
  return <div>프로필 설정</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/veterinarian/profile/edit/page.tsx"
    ),
    `export default function VeterinarianProfileEditPage() {
  return <div>프로필 수정</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/veterinarian/resume/page.tsx"),
    `export default function VeterinarianResumePage() {
  return <div>나의 이력서</div>;
}`
  );

  // 병원 대시보드 페이지들
  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/page.tsx"),
    `export default function HospitalDashboardPage() {
  return <div>병원 대시보드</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/applicants/page.tsx"),
    `export default function HospitalApplicantsPage() {
  return <div>지원자 정보 목록</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/hospital/transfer-bookmarks/page.tsx"
    ),
    `export default function HospitalTransferBookmarksPage() {
  return <div>양도양수 찜 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/messages/page.tsx"),
    `export default function HospitalMessagesPage() {
  return <div>알림/메시지 관리</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/messages/[id]/page.tsx"),
    `export default function HospitalMessageDetailPage({ params }: { params: { id: string } }) {
  return <div>메시지 상세: {params.id}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/profile/page.tsx"),
    `export default function HospitalProfilePage() {
  return <div>프로필 설정</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/profile/edit/page.tsx"),
    `export default function HospitalProfileEditPage() {
  return <div>프로필 수정</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/app/dashboard/hospital/my-jobs/page.tsx"),
    `export default function HospitalMyJobsPage() {
  return <div>올린 공고 관리</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/hospital/my-jobs/create/page.tsx"
    ),
    `export default function CreateJobPage() {
  return <div>채용공고 등록</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/hospital/my-jobs/[id]/edit/page.tsx"
    ),
    `export default function EditJobPage({ params }: { params: { id: string } }) {
  return <div>채용공고 수정: {params.id}</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/hospital/talent-management/[id]/page.tsx"
    ),
    `export default function TalentManagementPage({ params }: { params: { id: string } }) {
  return <div>인재정보 상세 관리: {params.id}</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/app/dashboard/hospital/favorite-talents/page.tsx"
    ),
    `export default function FavoriteTalentsPage() {
  return <div>관심인재 목록</div>;
}`
  );

  // Types
  createFile(
    path.join(projectRoot, "src/types/index.ts"),
    `export * from './auth';
export * from './user';
export * from './job';
export * from './resume';
export * from './hospital';
export * from './transfer';
export * from './lecture';
export * from './application';
export * from './message';
export * from './api';`
  );

  createFile(
    path.join(projectRoot, "src/types/auth.ts"),
    `export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/user.ts"),
    `export interface User {
  id: string;
  email: string;
  name: string;
  type: 'veterinarian' | 'hospital';
}`
  );

  createFile(
    path.join(projectRoot, "src/types/job.ts"),
    `export interface Job {
  id: string;
  title: string;
  description: string;
  hospitalId: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/resume.ts"),
    `export interface Resume {
  id: string;
  title: string;
  content: string;
  veterinarianId: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/hospital.ts"),
    `export interface Hospital {
  id: string;
  name: string;
  address: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/transfer.ts"),
    `export interface Transfer {
  id: string;
  title: string;
  content: string;
  price: number;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/lecture.ts"),
    `export interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/application.ts"),
    `export interface Application {
  id: string;
  jobId: string;
  veterinarianId: string;
  status: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/message.ts"),
    `export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}`
  );

  createFile(
    path.join(projectRoot, "src/types/api.ts"),
    `export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}`
  );

  // Interfaces
  createFile(
    path.join(projectRoot, "src/interfaces/index.ts"),
    `export * from './AuthRepository';
export * from './UserRepository';
export * from './JobRepository';
export * from './ResumeRepository';
export * from './HospitalRepository';
export * from './TransferRepository';
export * from './LectureRepository';
export * from './ApplicationRepository';
export * from './MessageRepository';`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/AuthRepository.ts"),
    `export interface AuthRepository {
  login(email: string, password: string): Promise<any>;
  register(data: any): Promise<any>;
  logout(): Promise<void>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/UserRepository.ts"),
    `export interface UserRepository {
  findById(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/JobRepository.ts"),
    `export interface JobRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/ResumeRepository.ts"),
    `export interface ResumeRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/HospitalRepository.ts"),
    `export interface HospitalRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/TransferRepository.ts"),
    `export interface TransferRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/LectureRepository.ts"),
    `export interface LectureRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/ApplicationRepository.ts"),
    `export interface ApplicationRepository {
  findAll(): Promise<any[]>;
  create(data: any): Promise<any>;
}`
  );

  createFile(
    path.join(projectRoot, "src/interfaces/MessageRepository.ts"),
    `export interface MessageRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
}`
  );

  // Repositories
  createFile(
    path.join(projectRoot, "src/repositories/index.ts"),
    `export * from './PrismaAuthRepository';
export * from './PrismaUserRepository';
export * from './PrismaJobRepository';
export * from './PrismaResumeRepository';
export * from './PrismaHospitalRepository';
export * from './PrismaTransferRepository';
export * from './PrismaLectureRepository';
export * from './PrismaApplicationRepository';
export * from './PrismaMessageRepository';`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaAuthRepository.ts"),
    `import { AuthRepository } from '../interfaces/AuthRepository';

export class PrismaAuthRepository implements AuthRepository {
  async login(email: string, password: string) {
    return { id: '1', email, name: 'User' };
  }
  
  async register(data: any) {
    return { id: '1', ...data };
  }
  
  async logout() {
    return;
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaUserRepository.ts"),
    `import { UserRepository } from '../interfaces/UserRepository';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string) {
    return { id, name: 'User', email: 'user@example.com' };
  }
  
  async update(id: string, data: any) {
    return { id, ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaJobRepository.ts"),
    `import { JobRepository } from '../interfaces/JobRepository';

export class PrismaJobRepository implements JobRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Job Title' };
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaResumeRepository.ts"),
    `import { ResumeRepository } from '../interfaces/ResumeRepository';

export class PrismaResumeRepository implements ResumeRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Resume Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaHospitalRepository.ts"),
    `import { HospitalRepository } from '../interfaces/HospitalRepository';

export class PrismaHospitalRepository implements HospitalRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, name: 'Hospital Name' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaTransferRepository.ts"),
    `import { TransferRepository } from '../interfaces/TransferRepository';

export class PrismaTransferRepository implements TransferRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Transfer Title' };
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaLectureRepository.ts"),
    `import { LectureRepository } from '../interfaces/LectureRepository';

export class PrismaLectureRepository implements LectureRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, title: 'Lecture Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaApplicationRepository.ts"),
    `import { ApplicationRepository } from '../interfaces/ApplicationRepository';

export class PrismaApplicationRepository implements ApplicationRepository {
  async findAll() {
    return [];
  }
  
  async create(data: any) {
    return { id: '1', ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/repositories/PrismaMessageRepository.ts"),
    `import { MessageRepository } from '../interfaces/MessageRepository';

export class PrismaMessageRepository implements MessageRepository {
  async findAll() {
    return [];
  }
  
  async findById(id: string) {
    return { id, content: 'Message content' };
  }
}`
  );

  createDir(path.join(projectRoot, "src/repositories/implementations"));

  // Services
  createFile(
    path.join(projectRoot, "src/services/index.ts"),
    `export * from './AuthService';
export * from './UserService';
export * from './JobService';
export * from './ResumeService';
export * from './HospitalService';
export * from './TransferService';
export * from './LectureService';
export * from './ApplicationService';
export * from './MessageService';`
  );

  createFile(
    path.join(projectRoot, "src/services/AuthService.ts"),
    `export class AuthService {
  async login(email: string, password: string) {
    return { token: 'jwt-token' };
  }
  
  async register(data: any) {
    return { user: data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/UserService.ts"),
    `export class UserService {
  async getUser(id: string) {
    return { id, name: 'User' };
  }
  
  async updateUser(id: string, data: any) {
    return { id, ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/JobService.ts"),
    `export class JobService {
  async getJobs() {
    return [];
  }
  
  async getJob(id: string) {
    return { id, title: 'Job Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/ResumeService.ts"),
    `export class ResumeService {
  async getResumes() {
    return [];
  }
  
  async getResume(id: string) {
    return { id, title: 'Resume Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/HospitalService.ts"),
    `export class HospitalService {
  async getHospitals() {
    return [];
  }
  
  async getHospital(id: string) {
    return { id, name: 'Hospital Name' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/TransferService.ts"),
    `export class TransferService {
  async getTransfers() {
    return [];
  }
  
  async getTransfer(id: string) {
    return { id, title: 'Transfer Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/LectureService.ts"),
    `export class LectureService {
  async getLectures() {
    return [];
  }
  
  async getLecture(id: string) {
    return { id, title: 'Lecture Title' };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/ApplicationService.ts"),
    `export class ApplicationService {
  async getApplications() {
    return [];
  }
  
  async createApplication(data: any) {
    return { id: '1', ...data };
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/services/MessageService.ts"),
    `export class MessageService {
  async getMessages() {
    return [];
  }
  
  async getMessage(id: string) {
    return { id, content: 'Message content' };
  }
}`
  );

  // Lib
  createFile(
    path.join(projectRoot, "src/lib/database.ts"),
    `export class DatabaseFactory {
  static create() {
    return {};
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/lib/prisma.ts"),
    `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;`
  );

  createFile(
    path.join(projectRoot, "src/lib/api.ts"),
    `export class ApiClient {
  async get(url: string) {
    return fetch(url);
  }
  
  async post(url: string, data: any) {
    return fetch(url, { method: 'POST', body: JSON.stringify(data) });
  }
}`
  );

  createFile(
    path.join(projectRoot, "src/lib/validations.ts"),
    `import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});`
  );

  createFile(
    path.join(projectRoot, "src/lib/utils.ts"),
    `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  return date.toLocaleDateString();
}`
  );

  createFile(
    path.join(projectRoot, "src/lib/constants.ts"),
    `export const API_BASE_URL = '/api';

export const USER_TYPES = {
  VETERINARIAN: 'veterinarian',
  HOSPITAL: 'hospital',
} as const;`
  );

  createFile(
    path.join(projectRoot, "src/lib/env.ts"),
    `import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);`
  );

  // Hooks
  createFile(
    path.join(projectRoot, "src/hooks/index.ts"),
    `export * from './api';
export * from './common';`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useAuth.ts"),
    `import { useMutation, useQuery } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: any) => {
      return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: any) => {
      return fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
    },
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useUsers.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(\`/api/users/\${id}\`).then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useJobs.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetch(\`/api/jobs/\${id}\`).then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useResumes.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => fetch('/api/resumes').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useHospitals.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useHospitals() {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: () => fetch('/api/hospitals').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useTransfers.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useTransfers() {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: () => fetch('/api/transfers').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useLectures.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useLectures() {
  return useQuery({
    queryKey: ['lectures'],
    queryFn: () => fetch('/api/lectures').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useApplications.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/api/useMessages.ts"),
    `import { useQuery } from '@tanstack/react-query';

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => fetch('/api/messages').then(res => res.json()),
  });
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/common/useLocalStorage.ts"),
    `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/common/useDebounce.ts"),
    `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`
  );

  createFile(
    path.join(projectRoot, "src/hooks/common/useToggle.ts"),
    `import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);

  return [value, toggle] as const;
}`
  );

  // Store
  createFile(
    path.join(projectRoot, "src/store/index.ts"),
    `export * from './authStore';
export * from './uiStore';
export * from './userStore';
export * from './searchStore';`
  );

  createFile(
    path.join(projectRoot, "src/store/authStore.ts"),
    `import { create } from 'zustand';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));`
  );

  createFile(
    path.join(projectRoot, "src/store/uiStore.ts"),
    `import { create } from 'zustand';

interface UiState {
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isModalOpen: false,
  isSidebarOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));`
  );

  createFile(
    path.join(projectRoot, "src/store/userStore.ts"),
    `import { create } from 'zustand';

interface UserState {
  profile: any | null;
  setProfile: (profile: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));`
  );

  createFile(
    path.join(projectRoot, "src/store/searchStore.ts"),
    `import { create } from 'zustand';

interface SearchState {
  filters: Record<string, any>;
  searchQuery: string;
  setFilters: (filters: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {},
  searchQuery: '',
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));`
  );

  // Components
  createFile(
    path.join(projectRoot, "src/components/index.ts"),
    `export * from './ui';
export * from './forms';
export * from './layout';
export * from './features';
export * from './providers';`
  );

  // UI Components
  createFile(
    path.join(projectRoot, "src/components/ui/Button.tsx"),
    `export function Button({ children, ...props }: any) {
  return <button {...props}>{children}</button>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Input.tsx"),
    `export function Input(props: any) {
  return <input {...props} />;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Modal.tsx"),
    `export function Modal({ children, isOpen, onClose }: any) {
  if (!isOpen) return null;
  return <div onClick={onClose}>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Spinner.tsx"),
    `export function Spinner() {
  return <div>Loading...</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Card.tsx"),
    `export function Card({ children }: any) {
  return <div>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Badge.tsx"),
    `export function Badge({ children }: any) {
  return <span>{children}</span>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Alert.tsx"),
    `export function Alert({ children }: any) {
  return <div>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/Pagination.tsx"),
    `export function Pagination({ currentPage, totalPages }: any) {
  return <div>Page {currentPage} of {totalPages}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/SearchInput.tsx"),
    `export function SearchInput(props: any) {
  return <input type="search" {...props} />;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/FilterDropdown.tsx"),
    `export function FilterDropdown({ options, onChange }: any) {
  return <select onChange={onChange}>{options?.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/ui/index.ts"),
    `export * from './Button';
export * from './Input';
export * from './Modal';
export * from './Spinner';
export * from './Card';
export * from './Badge';
export * from './Alert';
export * from './Pagination';
export * from './SearchInput';
export * from './FilterDropdown';`
  );

  // Form Components
  createFile(
    path.join(projectRoot, "src/components/forms/LoginForm.tsx"),
    `export function LoginForm() {
  return <form><input type="email" /><input type="password" /><button>로그인</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/RegisterForm.tsx"),
    `export function RegisterForm() {
  return <form><input type="email" /><input type="password" /><input type="text" /><button>회원가입</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/JobForm.tsx"),
    `export function JobForm() {
  return <form><input type="text" placeholder="제목" /><textarea placeholder="설명"></textarea><button>등록</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/ResumeForm.tsx"),
    `export function ResumeForm() {
  return <form><input type="text" placeholder="제목" /><textarea placeholder="내용"></textarea><button>저장</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/TransferForm.tsx"),
    `export function TransferForm() {
  return <form><input type="text" placeholder="제목" /><textarea placeholder="내용"></textarea><button>등록</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/ProfileForm.tsx"),
    `export function ProfileForm() {
  return <form><input type="text" placeholder="이름" /><input type="email" placeholder="이메일" /><button>저장</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/forms/index.ts"),
    `export * from './LoginForm';
export * from './RegisterForm';
export * from './JobForm';
export * from './ResumeForm';
export * from './TransferForm';
export * from './ProfileForm';`
  );

  // Layout Components
  createFile(
    path.join(projectRoot, "src/components/layout/Header.tsx"),
    `export function Header() {
  return <header>IAMVET Header</header>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/layout/Sidebar.tsx"),
    `export function Sidebar() {
  return <aside>Sidebar</aside>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/layout/Footer.tsx"),
    `export function Footer() {
  return <footer>IAMVET Footer</footer>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/layout/Navigation.tsx"),
    `export function Navigation() {
  return <nav>Navigation</nav>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/layout/DashboardLayout.tsx"),
    `export function DashboardLayout({ children }: any) {
  return <div><aside>Dashboard Sidebar</aside><main>{children}</main></div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/layout/index.ts"),
    `export * from './Header';
export * from './Sidebar';
export * from './Footer';
export * from './Navigation';
export * from './DashboardLayout';`
  );

  // Feature Components
  createFile(
    path.join(projectRoot, "src/components/features/auth/MemberSelectCard.tsx"),
    `export function MemberSelectCard({ type, onClick }: any) {
  return <div onClick={onClick}>{type} 회원</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/auth/AuthProvider.tsx"),
    `export function AuthProvider({ children }: any) {
  return <div>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/auth/ProtectedRoute.tsx"),
    `export function ProtectedRoute({ children }: any) {
  return <div>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/auth/index.ts"),
    `export * from './MemberSelectCard';
export * from './AuthProvider';
export * from './ProtectedRoute';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/job/JobList.tsx"),
    `export function JobList() {
  return <div>채용공고 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/job/JobCard.tsx"),
    `export function JobCard({ job }: any) {
  return <div>{job?.title}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/job/JobDetail.tsx"),
    `export function JobDetail({ job }: any) {
  return <div>{job?.description}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/job/JobFilters.tsx"),
    `export function JobFilters() {
  return <div>필터</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/job/index.ts"),
    `export * from './JobList';
export * from './JobCard';
export * from './JobDetail';
export * from './JobFilters';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/resume/ResumeList.tsx"),
    `export function ResumeList() {
  return <div>인재정보 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/resume/ResumeCard.tsx"),
    `export function ResumeCard({ resume }: any) {
  return <div>{resume?.title}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/resume/ResumeDetail.tsx"),
    `export function ResumeDetail({ resume }: any) {
  return <div>{resume?.content}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/resume/index.ts"),
    `export * from './ResumeList';
export * from './ResumeCard';
export * from './ResumeDetail';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/hospital/HospitalCard.tsx"),
    `export function HospitalCard({ hospital }: any) {
  return <div>{hospital?.name}</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/hospital/HospitalDetail.tsx"
    ),
    `export function HospitalDetail({ hospital }: any) {
  return <div>{hospital?.address}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/hospital/index.ts"),
    `export * from './HospitalCard';
export * from './HospitalDetail';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/transfer/TransferList.tsx"),
    `export function TransferList() {
  return <div>양도양수 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/transfer/TransferCard.tsx"),
    `export function TransferCard({ transfer }: any) {
  return <div>{transfer?.title}</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/transfer/TransferDetail.tsx"
    ),
    `export function TransferDetail({ transfer }: any) {
  return <div>{transfer?.content}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/transfer/index.ts"),
    `export * from './TransferList';
export * from './TransferCard';
export * from './TransferDetail';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/lecture/LectureList.tsx"),
    `export function LectureList() {
  return <div>강의영상 목록</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/lecture/LectureCard.tsx"),
    `export function LectureCard({ lecture }: any) {
  return <div>{lecture?.title}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/lecture/VideoPlayer.tsx"),
    `export function VideoPlayer({ videoUrl }: any) {
  return <video src={videoUrl} controls />;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/lecture/index.ts"),
    `export * from './LectureList';
export * from './LectureCard';
export * from './VideoPlayer';`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/dashboard/DashboardStats.tsx"
    ),
    `export function DashboardStats() {
  return <div>대시보드 통계</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/dashboard/ApplicationHistory.tsx"
    ),
    `export function ApplicationHistory() {
  return <div>지원내역</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/dashboard/BookmarkList.tsx"
    ),
    `export function BookmarkList() {
  return <div>찜 목록</div>;
}`
  );

  createFile(
    path.join(
      projectRoot,
      "src/components/features/dashboard/MessageCenter.tsx"
    ),
    `export function MessageCenter() {
  return <div>메시지 센터</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/dashboard/index.ts"),
    `export * from './DashboardStats';
export * from './ApplicationHistory';
export * from './BookmarkList';
export * from './MessageCenter';`
  );

  createFile(
    path.join(projectRoot, "src/components/features/profile/ProfileView.tsx"),
    `export function ProfileView({ profile }: any) {
  return <div>{profile?.name}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/profile/ProfileEdit.tsx"),
    `export function ProfileEdit() {
  return <form><input type="text" /><button>저장</button></form>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/features/profile/index.ts"),
    `export * from './ProfileView';
export * from './ProfileEdit';`
  );

  // Providers
  createFile(
    path.join(projectRoot, "src/components/providers/QueryProvider.tsx"),
    `'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function QueryProvider({ children }: any) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/providers/ThemeProvider.tsx"),
    `export function ThemeProvider({ children }: any) {
  return <div>{children}</div>;
}`
  );

  createFile(
    path.join(projectRoot, "src/components/providers/index.ts"),
    `export * from './QueryProvider';
export * from './ThemeProvider';`
  );

  // Styles
  createFile(
    path.join(projectRoot, "src/styles/globals.css"),
    `@tailwind base;
@tailwind components;
@tailwind utilities;`
  );

  createFile(
    path.join(projectRoot, "src/styles/components.css"),
    `/* Component styles */`
  );

  createDir(path.join(projectRoot, "src/styles/components"));

  // Public files
  createDir(path.join(projectRoot, "public/images"));
  createDir(path.join(projectRoot, "public/icons"));
  createFile(path.join(projectRoot, "public/favicon.ico"), "");

  // Docs
  createFile(
    path.join(projectRoot, "docs/README.md"),
    `# IAMVET 프로젝트

수의사 구인구직 플랫폼

## 프로젝트 구조

- \`src/app\`: Next.js App Router 페이지
- \`src/components\`: React 컴포넌트
- \`src/types\`: TypeScript 타입 정의
- \`src/services\`: 비즈니스 로직
- \`src/repositories\`: 데이터 접근 계층
`
  );

  createFile(
    path.join(projectRoot, "docs/API.md"),
    `# API 문서

## 인증 API
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

## 채용공고 API
- GET /api/jobs
- GET /api/jobs/[id]
- POST /api/jobs
`
  );

  createFile(
    path.join(projectRoot, "docs/DEPLOYMENT.md"),
    `# 배포 가이드

## 환경 설정
1. .env.local 파일 생성
2. 데이터베이스 연결 설정
3. 빌드 및 배포
`
  );

  // Config files
  createFile(
    path.join(projectRoot, ".env.local"),
    `DATABASE_URL="postgresql://username:password@localhost:5432/iamvet"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"`
  );

  createFile(
    path.join(projectRoot, ".env.example"),
    `DATABASE_URL="postgresql://username:password@localhost:5432/iamvet"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"`
  );

  createFile(
    path.join(projectRoot, ".gitignore"),
    `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/migrations/
!prisma/migrations/.gitkeep`
  );

  createFile(
    path.join(projectRoot, "next.config.js"),
    `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;`
  );

  createFile(
    path.join(projectRoot, "tailwind.config.js"),
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`
  );

  createFile(
    path.join(projectRoot, "tsconfig.json"),
    `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
  );

  createFile(
    path.join(projectRoot, "package.json"),
    `{
  "name": "iamvet",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "ts-node --compiler-options {\\"module\\":\\"CommonJS\\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "@tanstack/react-query": "^4.29.0",
    "next": "13.4.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "zustand": "^4.3.0",
    "zod": "^3.21.0"
  },
  "devDependencies": {
    "@types/node": "20.0.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "autoprefixer": "10.4.14",
    "eslint": "8.40.0",
    "eslint-config-next": "13.4.0",
    "postcss": "8.4.23",
    "prisma": "^5.0.0",
    "tailwindcss": "3.3.0",
    "ts-node": "^10.9.0",
    "typescript": "5.0.0"
  }
}`
  );

  createFile(
    path.join(projectRoot, "README.md"),
    `# IAMVET - 수의사 구인구직 플랫폼

Next.js 13 App Router와 Prisma를 사용한 수의사 전용 구인구직 플랫폼입니다.

## 주요 기능

- 🔐 수의사/병원 회원가입 및 로그인
- 💼 채용공고 등록 및 검색
- 👨‍⚕️ 인재정보 관리
- 🏥 병원 정보 관리
- 📹 강의영상 서비스
- 🔄 양도양수 게시판
- 📊 대시보드 (수의사/병원별)

## 기술 스택

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS
- **Validation**: Zod

## 시작하기

### 설치

\`\`\`bash
npm install
\`\`\`

### 환경 설정

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 데이터베이스 설정

\`\`\`bash
# 데이터베이스 스키마 적용
npm run db:push

# 시드 데이터 삽입
npm run db:seed
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

## 프로젝트 구조

\`\`\`
src/
├── app/                    # Next.js App Router 페이지
├── components/             # React 컴포넌트
├── types/                  # TypeScript 타입 정의
├── interfaces/             # Repository 인터페이스
├── repositories/           # 데이터 접근 계층
├── services/              # 비즈니스 로직
├── hooks/                 # React Query & Custom Hooks
├── store/                 # Zustand 스토어
├── lib/                   # 유틸리티 & 설정
└── styles/                # 스타일 파일
\`\`\`

## 페이지 구조

### 인증
- \`/member-select\` - 회원 유형 선택
- \`/login/veterinarian\` - 수의사 로그인
- \`/login/hospital\` - 병원 로그인
- \`/register/veterinarian\` - 수의사 회원가입
- \`/register/hospital\` - 병원 회원가입

### 메인 서비스
- \`/\` - 홈페이지
- \`/jobs\` - 채용공고 목록
- \`/jobs/[id]\` - 채용공고 상세
- \`/resumes\` - 인재정보 목록
- \`/resumes/[id]\` - 인재정보 상세
- \`/hospitals/[id]\` - 병원 상세
- \`/lectures\` - 강의영상 목록
- \`/lectures/[id]\` - 강의영상 상세

### 양도양수
- \`/transfers\` - 양도양수 게시판
- \`/transfers/create\` - 양도양수 글 작성
- \`/transfers/[id]\` - 양도양수 상세
- \`/transfers/[id]/edit\` - 양도양수 수정

### 수의사 대시보드
- \`/dashboard/veterinarian\` - 수의사 대시보드
- \`/dashboard/veterinarian/applications\` - 지원내역
- \`/dashboard/veterinarian/bookmarks\` - 찜한 공고
- \`/dashboard/veterinarian/messages\` - 메시지
- \`/dashboard/veterinarian/profile\` - 프로필 설정
- \`/dashboard/veterinarian/resume\` - 나의 이력서

### 병원 대시보드
- \`/dashboard/hospital\` - 병원 대시보드
- \`/dashboard/hospital/applicants\` - 지원자 정보
- \`/dashboard/hospital/transfer-bookmarks\` - 양도양수 찜 목록
- \`/dashboard/hospital/messages\` - 메시지
- \`/dashboard/hospital/profile\` - 프로필 설정
- \`/dashboard/hospital/my-jobs\` - 올린 공고 관리
- \`/dashboard/hospital/my-jobs/create\` - 채용공고 등록
- \`/dashboard/hospital/my-jobs/[id]/edit\` - 채용공고 수정
- \`/dashboard/hospital/talent-management/[id]\` - 인재정보 상세 관리
- \`/dashboard/hospital/favorite-talents\` - 관심인재 목록

## API 엔드포인트

### 인증
- \`POST /api/auth/login\` - 로그인
- \`POST /api/auth/register\` - 회원가입
- \`POST /api/auth/logout\` - 로그아웃

### 수의사
- \`GET /api/veterinarians\` - 수의사 목록
- \`GET /api/veterinarians/[id]\` - 수의사 상세
- \`POST /api/veterinarians\` - 수의사 등록
- \`PUT /api/veterinarians/[id]\` - 수의사 수정
- \`DELETE /api/veterinarians/[id]\` - 수의사 삭제

### 병원
- \`GET /api/hospitals\` - 병원 목록
- \`GET /api/hospitals/[id]\` - 병원 상세
- \`POST /api/hospitals\` - 병원 등록

### 채용공고
- \`GET /api/jobs\` - 채용공고 목록
- \`GET /api/jobs/[id]\` - 채용공고 상세
- \`POST /api/jobs\` - 채용공고 등록

### 인재정보
- \`GET /api/resumes\` - 인재정보 목록
- \`GET /api/resumes/[id]\` - 인재정보 상세

### 양도양수
- \`GET /api/transfers\` - 양도양수 목록
- \`GET /api/transfers/[id]\` - 양도양수 상세

### 강의영상
- \`GET /api/lectures\` - 강의영상 목록
- \`GET /api/lectures/[id]\` - 강의영상 상세

### 지원내역
- \`GET /api/applications\` - 지원내역 목록

### 찜 목록
- \`GET /api/bookmarks\` - 찜 목록

### 메시지
- \`GET /api/messages\` - 메시지 목록
- \`GET /api/messages/[id]\` - 메시지 상세

## 라이센스

MIT License
`
  );

  // 최종 메시지
  console.log("\n✅ IAMVET 프로젝트 구조가 성공적으로 생성되었습니다!");
  console.log("\n📋 다음 단계:");
  console.log("1. cd IAMVET");
  console.log("2. npm install");
  console.log("3. .env.local 파일 설정");
  console.log("4. npm run db:push");
  console.log("5. npm run dev");
  console.log("\n🚀 Happy coding!");
}

// 스크립트 실행
if (require.main === module) {
  createProject();
}
