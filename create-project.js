#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 프로젝트 구조 정의
const projectStructure = {
  'prisma/': {
    'schema.prisma': `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 개발용, 나중에 postgresql로 변경
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  type      UserType // 'VETERINARIAN' | 'HOSPITAL'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum UserType {
  VETERINARIAN
  HOSPITAL
}

model Job {
  id          String   @id @default(cuid())
  title       String
  description String
  hospitalId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("jobs")
}

model Resume {
  id              String   @id @default(cuid())
  title           String
  description     String
  veterinarianId  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("resumes")
}

model Transfer {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Int?
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("transfers")
}

model Lecture {
  id          String   @id @default(cuid())
  title       String
  description String
  videoUrl    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("lectures")
}`,

    'seed.ts': `import { PrismaClient, UserType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 시드 데이터 생성
  const veterinarian = await prisma.user.create({
    data: {
      email: 'vet@example.com',
      name: '김수의사',
      type: UserType.VETERINARIAN,
    },
  })

  const hospital = await prisma.user.create({
    data: {
      email: 'hospital@example.com',
      name: '서울동물병원',
      type: UserType.HOSPITAL,
    },
  })

  console.log({ veterinarian, hospital })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })`
  },

  'src/types/': {
    'index.ts': `export * from './auth'
export * from './user'
export * from './job'
export * from './resume'
export * from './hospital'
export * from './transfer'
export * from './lecture'
export * from './application'
export * from './message'
export * from './api'`,

    'auth.ts': `export interface LoginRequest {
  email: string
  password: string
  userType: 'VETERINARIAN' | 'HOSPITAL'
}

export interface RegisterRequest extends LoginRequest {
  name: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  type: 'VETERINARIAN' | 'HOSPITAL'
}`,

    'user.ts': `export interface User {
  id: string
  email: string
  name: string
  type: 'VETERINARIAN' | 'HOSPITAL'
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  name: string
  type: 'VETERINARIAN' | 'HOSPITAL'
}`,

    'job.ts': `export interface Job {
  id: string
  title: string
  description: string
  hospitalId: string
  createdAt: string
  updatedAt: string
}

export interface CreateJobRequest {
  title: string
  description: string
}`,

    'resume.ts': `export interface Resume {
  id: string
  title: string
  description: string
  veterinarianId: string
  createdAt: string
  updatedAt: string
}

export interface CreateResumeRequest {
  title: string
  description: string
}`,

    'hospital.ts': `export interface Hospital {
  id: string
  name: string
  address: string
  description: string
  createdAt: string
  updatedAt: string
}`,

    'transfer.ts': `export interface Transfer {
  id: string
  title: string
  description: string
  price?: number
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransferRequest {
  title: string
  description: string
  price?: number
}`,

    'lecture.ts': `export interface Lecture {
  id: string
  title: string
  description: string
  videoUrl: string
  createdAt: string
  updatedAt: string
}`,

    'application.ts': `export interface Application {
  id: string
  jobId: string
  veterinarianId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}`,

    'message.ts': `export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}`,

    'api.ts': `export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  message: string
}`
  },

  'src/interfaces/': {
    'index.ts': `export * from './UserRepository'
export * from './JobRepository'
export * from './ResumeRepository'
export * from './HospitalRepository'
export * from './TransferRepository'
export * from './LectureRepository'
export * from './ApplicationRepository'
export * from './MessageRepository'
export * from './AuthRepository'`,

    'UserRepository.ts': `import { User, CreateUserRequest } from '@/types'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserRequest): Promise<User>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  findMany(limit?: number, offset?: number): Promise<User[]>
}`,

    'JobRepository.ts': `import { Job, CreateJobRequest } from '@/types'

export interface JobRepository {
  findById(id: string): Promise<Job | null>
  findMany(limit?: number, offset?: number): Promise<Job[]>
  create(hospitalId: string, data: CreateJobRequest): Promise<Job>
  update(id: string, data: Partial<Job>): Promise<Job>
  delete(id: string): Promise<void>
  findByHospitalId(hospitalId: string): Promise<Job[]>
}`,

    'AuthRepository.ts': `import { AuthUser, LoginRequest, RegisterRequest } from '@/types'

export interface AuthRepository {
  login(data: LoginRequest): Promise<AuthUser>
  register(data: RegisterRequest): Promise<AuthUser>
  logout(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
}`
  },

  'src/repositories/': {
    'index.ts': `export * from './PrismaUserRepository'
export * from './PrismaJobRepository'
export * from './PrismaAuthRepository'`,

    'PrismaUserRepository.ts': `import { prisma } from '@/lib/prisma'
import { UserRepository } from '@/interfaces'
import { User, CreateUserRequest } from '@/types'

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user ? this.mapToUser(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user ? this.mapToUser(user) : null
  }

  async create(data: CreateUserRequest): Promise<User> {
    const user = await prisma.user.create({
      data
    })
    return this.mapToUser(user)
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data
    })
    return this.mapToUser(user)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    })
  }

  async findMany(limit = 10, offset = 0): Promise<User[]> {
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset
    })
    return users.map(this.mapToUser)
  }

  private mapToUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  }
}`,

    'PrismaJobRepository.ts': `import { prisma } from '@/lib/prisma'
import { JobRepository } from '@/interfaces'
import { Job, CreateJobRequest } from '@/types'

export class PrismaJobRepository implements JobRepository {
  async findById(id: string): Promise<Job | null> {
    const job = await prisma.job.findUnique({
      where: { id }
    })
    return job ? this.mapToJob(job) : null
  }

  async findMany(limit = 10, offset = 0): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    })
    return jobs.map(this.mapToJob)
  }

  async create(hospitalId: string, data: CreateJobRequest): Promise<Job> {
    const job = await prisma.job.create({
      data: {
        ...data,
        hospitalId
      }
    })
    return this.mapToJob(job)
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
    const job = await prisma.job.update({
      where: { id },
      data
    })
    return this.mapToJob(job)
  }

  async delete(id: string): Promise<void> {
    await prisma.job.delete({
      where: { id }
    })
  }

  async findByHospitalId(hospitalId: string): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      where: { hospitalId },
      orderBy: { createdAt: 'desc' }
    })
    return jobs.map(this.mapToJob)
  }

  private mapToJob(job: any): Job {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      hospitalId: job.hospitalId,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString()
    }
  }
}`
  },

  'src/lib/': {
    'database.ts': `import { UserRepository, JobRepository } from '@/interfaces'
import { PrismaUserRepository, PrismaJobRepository } from '@/repositories'

type DatabaseProvider = 'prisma' | 'supabase' | 'mongodb'

export class DatabaseFactory {
  static createUserRepository(): UserRepository {
    const provider = (process.env.DATABASE_PROVIDER as DatabaseProvider) || 'prisma'
    
    switch (provider) {
      case 'prisma':
        return new PrismaUserRepository()
      default:
        throw new Error(\`Unsupported database provider: \${provider}\`)
    }
  }

  static createJobRepository(): JobRepository {
    const provider = (process.env.DATABASE_PROVIDER as DatabaseProvider) || 'prisma'
    
    switch (provider) {
      case 'prisma':
        return new PrismaJobRepository()
      default:
        throw new Error(\`Unsupported database provider: \${provider}\`)
    }
  }
}

// 싱글톤으로 사용
export const userRepository = DatabaseFactory.createUserRepository()
export const jobRepository = DatabaseFactory.createJobRepository()`,

    'prisma.ts': `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`,

    'api.ts': `import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Request 인터셉터
api.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가 등
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 오류 처리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api`,

    'utils.ts': `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}`
  },

  'src/services/': {
    'index.ts': `export * from './AuthService'
export * from './UserService'
export * from './JobService'`,

    'UserService.ts': `import { userRepository } from '@/lib/database'
import { User, CreateUserRequest } from '@/types'

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다')
    }
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await userRepository.findByEmail(email)
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const existingUser = await userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다')
    }
    return await userRepository.create(data)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await userRepository.update(id, data)
  }

  async deleteUser(id: string): Promise<void> {
    await userRepository.delete(id)
  }

  async getUsers(limit?: number, offset?: number): Promise<User[]> {
    return await userRepository.findMany(limit, offset)
  }
}

export const userService = new UserService()`,

    'JobService.ts': `import { jobRepository } from '@/lib/database'
import { Job, CreateJobRequest } from '@/types'

export class JobService {
  async getJobById(id: string): Promise<Job> {
    const job = await jobRepository.findById(id)
    if (!job) {
      throw new Error('채용공고를 찾을 수 없습니다')
    }
    return job
  }

  async getJobs(limit?: number, offset?: number): Promise<Job[]> {
    return await jobRepository.findMany(limit, offset)
  }

  async createJob(hospitalId: string, data: CreateJobRequest): Promise<Job> {
    return await jobRepository.create(hospitalId, data)
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    return await jobRepository.update(id, data)
  }

  async deleteJob(id: string): Promise<void> {
    await jobRepository.delete(id)
  }

  async getJobsByHospitalId(hospitalId: string): Promise<Job[]> {
    return await jobRepository.findByHospitalId(hospitalId)
  }
}

export const jobService = new JobService()`
  },

  'src/hooks/api/': {
    'useAuth.ts': `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { LoginRequest, RegisterRequest, AuthUser } from '@/types'
import { useAuthStore } from '@/store'

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post('/auth/login', data)
      return response.data
    },
    onSuccess: (user: AuthUser) => {
      setUser(user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser)
  
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post('/auth/register', data)
      return response.data
    },
    onSuccess: (user: AuthUser) => {
      setUser(user)
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    }
  })
}

export function useLogout() {
  const clearUser = useAuthStore((state) => state.clearUser)
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      clearUser()
      queryClient.clear()
    }
  })
}`,

    'useJobs.ts': `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Job, CreateJobRequest } from '@/types'

export function useJobs(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ['jobs', limit, offset],
    queryFn: async () => {
      const response = await api.get('/jobs', {
        params: { limit, offset }
      })
      return response.data
    }
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await api.get(\`/jobs/\${id}\`)
      return response.data
    },
    enabled: !!id
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateJobRequest) => {
      const response = await api.post('/jobs', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })
}`
  },

  'src/store/': {
    'index.ts': `export * from './authStore'
export * from './uiStore'`,

    'authStore.ts': `import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)`,

    'uiStore.ts': `import { create } from 'zustand'

interface UiState {
  isSidebarOpen: boolean
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  setTheme: (theme) => set({ theme }),
}))`
  },

  'src/components/ui/': {
    'index.ts': `export * from './Button'
export * from './Input'
export * from './Card'`,

    'Button.tsx': `import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
      ghost: 'hover:bg-gray-100'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg'
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'`,

    'Input.tsx': `import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'`,

    'Card.tsx': `import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
      {...props}
    />
  )
)

Card.displayName = 'Card'`
  },

  'src/components/providers/': {
    'index.ts': `export * from './QueryProvider'`,

    'QueryProvider.tsx': `'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}`
  },

  'src/app/': {
    'layout.tsx': `import './globals.css'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '수의사 채용 플랫폼',
  description: '수의사와 병원을 연결하는 채용 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}`,

    'page.tsx': `import Link from 'next/link'
import { Button } from '@/components/ui'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            수의사 채용 플랫폼
          </h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            수의사와 병원을 연결합니다
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            최고의 수의사와 병원이 만나는 곳
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/jobs">
              <Button size="lg">채용공고 보기</Button>
            </Link>
            <Link href="/resumes">
              <Button variant="outline" size="lg">인재정보 보기</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}`,

    'globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply text-gray-900;
  }
}

@layer components {
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }
}`
  },

  'package.json': `{
  "name": "veterinary-job-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate dev",
    "generate": "prisma generate"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "zustand": "^4.0.0",
    "axios": "^1.0.0",
    "zod": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "tsx": "^4.0.0"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}`,

  '.env.example': `# Database
DATABASE_URL="file:./dev.db"
DATABASE_PROVIDER="prisma"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"`,

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}`,

  'tsconfig.json': `{
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
}`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  '.gitignore': `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
/prisma/dev.db
/prisma/dev.db-journal`,

  'README.md': `# 수의사 채용 플랫폼

수의사와 병원을 연결하는 채용 플랫폼입니다.

## 시작하기

1. 의존성 설치:
\`\`\`bash
npm install
\`\`\`

2. 환경 변수 설정:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. 데이터베이스 설정:
\`\`\`bash
npx prisma generate
npx prisma db push
npx prisma db seed
\`\`\`

4. 개발 서버 실행:
\`\`\`bash
npm run dev
\`\`\`

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite (개발) / PostgreSQL (프로덕션)
- **상태 관리**: React Query + Zustand
- **스타일링**: Tailwind CSS
- **폼 검증**: Zod

## 폴더 구조

- \`src/app/\`: Next.js App Router 페이지
- \`src/components/\`: React 컴포넌트
- \`src/hooks/\`: Custom hooks (React Query)
- \`src/store/\`: Zustand 스토어
- \`src/services/\`: 비즈니스 로직
- \`src/repositories/\`: 데이터 접근 계층
- \`src/types/\`: TypeScript 타입 정의

## 주요 기능

- 수의사/병원 회원가입 및 로그인
- 채용공고 등록 및 검색
- 인재정보 등록 및 검색
- 양도양수 게시판
- 강의영상 시스템
- 마이페이지 (대시보드, 지원내역, 메시지 등)
`
}

// 파일 생성 함수
function createFiles(structure, basePath = '') {
  for (const [path, content] of Object.entries(structure)) {
    const fullPath = basePath + path
    
    if (typeof content === 'object') {
      // 디렉토리 생성
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
        console.log(\`📁 Created directory: \${fullPath}\`)
      }
      
      // 하위 파일들 생성
      createFiles(content, fullPath)
    } else {
      // 파일 생성
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      fs.writeFileSync(fullPath, content)
      console.log(\`📄 Created file: \${fullPath}\`)
    }
  }
}

// 메인 실행 함수
function main() {
  const projectName = process.argv[2] || 'veterinary-job-platform'
  
  console.log(\`🚀 Creating Next.js project: \${projectName}\`)
  console.log('📦 Generating project structure...\\n')
  
  // 프로젝트 루트 디렉토리 생성
  if (!fs.existsSync(projectName)) {
    fs.mkdirSync(projectName)
  }
  
  // 프로젝트 구조 생성
  createFiles(projectStructure, \`\${projectName}/\`)
  
  console.log('\\n✅ Project structure created successfully!')
  console.log('\\n📋 Next steps:')
  console.log(\`1. cd \${projectName}\`)
  console.log('2. npm install')
  console.log('3. cp .env.example .env.local')
  console.log('4. npx prisma generate')
  console.log('5. npx prisma db push')
  console.log('6. npx prisma db seed')
  console.log('7. npm run dev')
  console.log('\\n🎉 Happy coding!')
}

// 스크립트 실행
if (require.main === module) {
  main()
}
