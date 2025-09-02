#!/usr/bin/env tsx
// Production data creation script
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import fs from "fs";

// 환경별 DATABASE_URL 설정
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env.local';

// Manual env file loading since dotenv isn't available
try {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, ...value] = line.trim().split('=');
    if (key && value.length > 0) {
      // Remove quotes if present
      const val = value.join('=').replace(/^["']|["']$/g, '');
      acc[key] = val;
    }
    return acc;
  }, {} as Record<string, string>);

  // Set environment variables
  Object.entries(envVars).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
} catch (error) {
  console.error(`❌ Failed to load ${envFile}:`, error);
}

// 환경별 DATABASE_URL 설정 확인
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(`DATABASE_URL not found in ${envFile}`);
}

// Import neon directly with loaded environment variables
import { neon } from "@neondatabase/serverless";
const sql = neon(DATABASE_URL);

// Simple ID generator (similar to cuid2)
function createId() {
  return randomBytes(12).toString("base64url");
}

// 랜덤 선택 헬퍼
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// 랜덤 날짜 생성
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function createProductionData() {
  try {
    console.log("🚀 Starting production data creation...");
    console.log(`🔗 Using database: ${DATABASE_URL?.substring(0, 50)}...`);

    // 1. 사용자 생성
    console.log("👥 Creating users...");
    const users = await createUsers();

    // 2. 채용공고 생성
    console.log("💼 Creating jobs...");
    await createJobs(users.hospitals);

    // 3. 인재정보(이력서) 생성
    console.log("📄 Creating resumes...");
    const resumes = await createResumes(users.veterinarians);

    // 4. 강의영상 생성
    console.log("🎥 Creating lectures...");
    const lectures = await createLectures();

    // 5. 양도양수 생성
    console.log("🔄 Creating transfers...");
    await createTransfers([...users.hospitals, ...users.veterinarians]);

    // 6. 포럼 게시글 생성
    console.log("💬 Creating forum posts...");
    await createForumPosts([...users.hospitals, ...users.veterinarians]);

    // 7. 북마크 및 지원서 생성
    console.log("⭐ Creating bookmarks and applications...");
    await createBookmarksAndApplications(users.veterinarians, users.hospitals);

    // 8. 메시지 생성
    console.log("📩 Creating messages...");
    await createMessages([...users.hospitals, ...users.veterinarians]);

    console.log("✅ Production data created successfully!");
    console.log("📊 Summary:");
    console.log(`- ${users.hospitals.length + users.veterinarians.length} users created`);
    console.log("- Jobs, resumes, lectures, transfers, and forum posts created");
    console.log("- Bookmarks, applications, and messages created");
    
  } catch (error) {
    console.error("❌ Error creating production data:", error);
  }
}

async function createUsers() {
  const hospitals: any[] = [];
  const veterinarians: any[] = [];
  
  // 병원 사용자 생성
  const hospitalNames = [
    "서울동물병원", "강남펫클리닉", "부산동물메디컬센터", "대구펫병원", "인천동물의료원",
    "경기동물병원", "전주펫케어", "울산동물클리닉", "창원펫메디컬", "수원동물병원"
  ];

  for (let i = 0; i < hospitalNames.length; i++) {
    const hospitalId = createId();
    const password = "hospital123!";
    const passwordHash = await bcrypt.hash(password, 12);
    const hospitalName = hospitalNames[i];
    const email = `hospital${i + 1}@iamvet.kr`;

    const hospitalUser = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType", 
        "termsAgreedAt", "privacyAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${hospitalId}, ${hospitalName}, ${email}, ${`010-${(1000 + i).toString()}-${(5678 + i).toString()}`},
        ${passwordHash}, 'HOSPITAL', NOW(), NOW(), true, NOW(), NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        "passwordHash" = ${passwordHash},
        "updatedAt" = NOW()
      RETURNING *
    `;

    if (hospitalUser[0]) {
      hospitals.push(hospitalUser[0]);

      // 병원 프로필 생성
      const hospitalProfileId = createId();
      await sql`
        INSERT INTO hospital_profiles (
          id, "userId", "hospitalName", "businessNumber", address, phone, "businessLicense", 
          website, description, "createdAt", "updatedAt"
        )
        VALUES (
          ${hospitalProfileId}, ${hospitalUser[0].id}, ${hospitalName}, 
          ${`${(123 + i).toString()}-${(45 + i).toString()}-${(67890 + i).toString()}`},
          ${`서울시 강남구 테스트로 ${100 + i * 10}`}, ${`02-${(1234 + i).toString()}-${(5678 + i).toString()}`},
          ${`business-license-${i + 1}.jpg`},
          ${`https://${hospitalName.toLowerCase()}.com`},
          ${`${hospitalName}은(는) 최신 의료 장비와 경험 많은 수의사들이 함께하는 종합 동물병원입니다.`},
          NOW(), NOW()
        )
        ON CONFLICT ("userId") DO UPDATE SET
          "hospitalName" = ${hospitalName},
          "updatedAt" = NOW()
      `;
    }
  }

  // 수의사 사용자 생성
  const veterinarianNames = [
    "김수의", "이동물", "박펫닥터", "정케어", "최힐링", "장메디컬", "윤치료", "임수술",
    "한진료", "조예방", "신건강", "오치유", "민전문", "배전문", "류숙련", "홍경험",
    "구전문", "송베테랑", "유명의", "노경력"
  ];

  for (let i = 0; i < veterinarianNames.length; i++) {
    const veterinarianId = createId();
    const password = "vet123!";
    const passwordHash = await bcrypt.hash(password, 12);
    const name = veterinarianNames[i];
    const email = `vet${i + 1}@iamvet.kr`;

    const veterinarianUser = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType",
        "termsAgreedAt", "privacyAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${veterinarianId}, ${name}, ${email}, ${`010-${(9000 + i).toString()}-${(1234 + i).toString()}`},
        ${passwordHash}, 'VETERINARIAN', NOW(), NOW(), true, NOW(), NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        "passwordHash" = ${passwordHash},
        "updatedAt" = NOW()
      RETURNING *
    `;

    if (veterinarianUser[0]) {
      veterinarians.push(veterinarianUser[0]);

      // 수의사 프로필 생성
      const vetProfileId = createId();
      const specialties = ["내과", "외과", "치과", "피부과", "안과", "정형외과", "응급의학"];
      const experiences = ["1-3년", "3-5년", "5-10년", "10년 이상"];
      
      await sql`
        INSERT INTO veterinarian_profiles (
          id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, introduction, "createdAt", "updatedAt"
        )
        VALUES (
          ${vetProfileId}, ${veterinarianUser[0].id}, ${`${name} 수의사`}, 
          ${randomDate(new Date('1980-01-01'), new Date('1995-12-31'))},
          ${`vet-license-${i + 1}.jpg`}, 
          ${randomChoice(experiences)}, 
          ${randomChoice(specialties)},
          ${`${name} 수의사입니다. ${randomChoice(specialties)} 전문으로 ${randomChoice(experiences)}의 경력을 가지고 있습니다. 동물들의 건강과 행복을 위해 최선을 다하겠습니다.`},
          NOW(), NOW()
        )
        ON CONFLICT ("userId") DO UPDATE SET
          nickname = ${`${name} 수의사`},
          "updatedAt" = NOW()
      `;
    }
  }

  console.log(`   ✅ Created ${hospitals.length} hospitals and ${veterinarians.length} veterinarians`);
  return { hospitals, veterinarians };
}

async function createJobs(hospitals: any[]) {
  const jobTitles = [
    "소동물 임상수의사", "대동물 수의사", "응급의학과 수의사", "외과 전문의", "내과 전문의",
    "치과 수의사", "마취과 수의사", "영상의학과 수의사", "병리학과 수의사", "예방의학과 수의사"
  ];

  const locations = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "수원", "창원", "고양"];
  const workTypes = ["FULL_TIME", "PART_TIME", "CONTRACT"];
  const salaryTypes = ["MONTHLY", "YEARLY", "HOURLY", "NEGOTIABLE"];

  for (let i = 0; i < 30; i++) {
    const hospitalId = randomChoice(hospitals).id;
    const jobId = createId();
    const title = randomChoice(jobTitles);
    const location = randomChoice(locations);
    const workType = randomChoice(workTypes);
    const salaryType = randomChoice(salaryTypes);

    await sql`
      INSERT INTO jobs (
        id, "hospitalId", title, description, location, "salaryType", "salaryMin", "salaryMax", 
        "experienceMin", "workType", benefits, requirements, status, deadline, "createdAt", "updatedAt"
      )
      VALUES (
        ${jobId}, ${hospitalId}, ${title}, 
        ${`${title} 모집합니다. 경력자 우대하며, 복리후생이 우수한 병원입니다.`},
        ${location}, ${salaryType}, 
        ${salaryType === 'HOURLY' ? 15000 + Math.floor(Math.random() * 10000) : 2500000 + Math.floor(Math.random() * 2000000)},
        ${salaryType === 'HOURLY' ? 25000 + Math.floor(Math.random() * 15000) : 4500000 + Math.floor(Math.random() * 3000000)},
        ${Math.floor(Math.random() * 5)}, ${workType},
        ${"4대보험, 연차수당, 교육비 지원, 식대 지원"},
        ${"수의사 면허, 관련 경력 우대, 성실하고 책임감 있는 분"},
        'ACTIVE', 
        ${randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))},
        NOW(), NOW()
      )
    `;
  }

  console.log("   ✅ Created 30 job postings");
}

async function createResumes(veterinarians: any[]) {
  const resumeTitles = [
    "경력 5년차 소동물 임상수의사", "신규 수의사 구직", "대동물 전문 경력수의사", 
    "응급의학 전문의", "외과 수술 경험 풍부한 수의사", "내과 진료 전문 수의사"
  ];

  const educations = [
    "서울대학교 수의과대학 졸업", "건국대학교 수의과대학 졸업", "전북대학교 수의과대학 졸업",
    "경상국립대학교 수의과대학 졸업", "충남대학교 수의과대학 졸업"
  ];

  for (let i = 0; i < veterinarians.length; i++) {
    const veterinarianId = veterinarians[i].id;
    const resumeId = createId();
    const title = randomChoice(resumeTitles);

    await sql`
      INSERT INTO resumes (
        id, "veterinarianId", title, introduction, experience, education, certifications, 
        skills, "preferredSalary", "preferredLocation", "availableFrom", "createdAt", "updatedAt"
      )
      VALUES (
        ${resumeId}, ${veterinarianId}, ${title},
        ${"안녕하세요. 동물을 사랑하고 최고의 진료를 제공하고자 하는 수의사입니다."},
        ${`${Math.floor(Math.random() * 8) + 1}년간의 임상경험을 보유하고 있으며, 다양한 케이스를 경험했습니다.`},
        ${randomChoice(educations)},
        ${"수의사 면허, BLS 자격증, 초음파 진단 자격증"},
        ${"소동물 진료, 수술, 응급처치, 고객 상담"},
        ${3000000 + Math.floor(Math.random() * 2000000)},
        ${randomChoice(["서울", "경기", "부산", "대구", "전국"])},
        ${randomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))},
        NOW(), NOW()
      )
    `;
  }

  console.log(`   ✅ Created ${veterinarians.length} resumes`);
  return veterinarians.map(v => ({ ...v, resumeId: createId() }));
}

async function createLectures() {
  const lectureData = [
    { title: "기초 수의학 개론", category: "기초의학", description: "수의학의 기초 이론을 다룹니다" },
    { title: "소동물 내과학", category: "임상의학", description: "소동물 내과 질환 진단과 치료" },
    { title: "수술학 기초", category: "외과학", description: "기본적인 외과 수술 기법" },
    { title: "영상진단학", category: "진단의학", description: "X-ray, 초음파 등 영상 진단" },
    { title: "응급처치 및 중환자 관리", category: "응급의학", description: "응급상황 대응 방법" },
    { title: "예방의학과 백신", category: "예방의학", description: "질병 예방과 백신 접종" },
    { title: "치과학 개론", category: "치과학", description: "구강 질환 진단과 치료" },
    { title: "피부과학", category: "피부과", description: "피부 질환 진단과 치료" },
    { title: "안과학 기초", category: "안과학", description: "안과 질환 진단과 치료" },
    { title: "번식학과 산과", category: "번식학", description: "동물 번식과 출산 관리" }
  ];

  for (let i = 0; i < lectureData.length; i++) {
    const lecture = lectureData[i];
    const lectureId = createId();

    await sql`
      INSERT INTO lectures (
        id, title, description, "videoUrl", thumbnail, duration, category, tags, "viewCount", "createdAt", "updatedAt"
      )
      VALUES (
        ${lectureId}, ${lecture.title}, ${lecture.description},
        ${`https://example.com/videos/lecture-${i + 1}.mp4`},
        ${`https://example.com/thumbnails/lecture-${i + 1}.jpg`},
        ${1800 + Math.floor(Math.random() * 3600)},
        ${lecture.category},
        ${['수의학', '교육', lecture.category]},
        ${Math.floor(Math.random() * 1000)},
        NOW(), NOW()
      )
    `;
  }

  console.log("   ✅ Created 10 lectures");
}

async function createTransfers(users: any[]) {
  const transferItems = [
    { title: "동물병원 양도", category: "병원양도", price: 500000000 },
    { title: "수의용 초음파 장비", category: "의료장비", price: 15000000 },
    { title: "X-ray 촬영 장비", category: "의료장비", price: 25000000 },
    { title: "치과 유니트", category: "의료장비", price: 8000000 },
    { title: "수술대 및 무영등", category: "의료장비", price: 3000000 },
    { title: "펫샵 양도", category: "사업양도", price: 30000000 },
    { title: "동물 미용 장비 세트", category: "미용장비", price: 2000000 },
    { title: "입원장 케이지 세트", category: "사육장비", price: 1500000 },
    { title: "마취기 및 인공호흡기", category: "의료장비", price: 12000000 },
    { title: "혈액검사기", category: "검사장비", price: 8000000 }
  ];

  const locations = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "수원", "창원", "고양"];

  for (let i = 0; i < transferItems.length; i++) {
    const item = transferItems[i];
    const transferId = createId();
    const userId = randomChoice(users).id;

    await sql`
      INSERT INTO transfers (
        id, "userId", title, description, location, price, category, images, status, "createdAt", "updatedAt"
      )
      VALUES (
        ${transferId}, ${userId}, ${item.title},
        ${`${item.title} 양도합니다. 상태 양호하며 즉시 사용 가능합니다.`},
        ${randomChoice(locations)}, ${item.price}, ${item.category},
        ${['image1.jpg', 'image2.jpg', 'image3.jpg']},
        'ACTIVE', NOW(), NOW()
      )
    `;
  }

  console.log("   ✅ Created 10 transfer items");
}

async function createForumPosts(users: any[]) {
  const forumTopics = [
    { title: "신입 수의사 현실적인 조언", category: "경력개발" },
    { title: "어려운 케이스 공유", category: "케이스스터디" },
    { title: "수의학 최신 연구 동향", category: "학술정보" },
    { title: "동물병원 운영 노하우", category: "병원경영" },
    { title: "수의사 번아웃 극복법", category: "멘탈케어" },
    { title: "새로운 치료법 소개", category: "치료법" },
    { title: "의료장비 추천", category: "장비정보" },
    { title: "고객 응대 스킬", category: "커뮤니케이션" },
    { title: "응급상황 대처법", category: "응급의학" },
    { title: "지속가능한 수의학", category: "윤리" }
  ];

  for (let i = 0; i < forumTopics.length; i++) {
    const topic = forumTopics[i];
    const postId = createId();
    const userId = randomChoice(users).id;

    await sql`
      INSERT INTO forum_posts (
        id, "userId", title, content, category, tags, "createdAt", "updatedAt"
      )
      VALUES (
        ${postId}, ${userId}, ${topic.title},
        ${`${topic.title}에 대해 이야기해보고 싶습니다. 여러분의 경험과 의견을 공유해주세요.`},
        ${topic.category},
        ${[topic.category, '수의학', '토론']},
        NOW(), NOW()
      )
    `;
  }

  console.log("   ✅ Created 10 forum posts");
}

async function createBookmarksAndApplications(veterinarians: any[], hospitals: any[]) {
  // 채용공고 ID들 가져오기
  const jobs = await sql`SELECT id, "hospitalId" FROM jobs LIMIT 10`;
  
  // 이력서 ID들 가져오기  
  const resumes = await sql`SELECT id, "veterinarianId" FROM resumes LIMIT 10`;

  // Job bookmarks 생성
  for (let i = 0; i < Math.min(veterinarians.length, 15); i++) {
    const veterinarianId = randomChoice(veterinarians).id;
    const jobId = randomChoice(jobs).id;
    const bookmarkId = createId();

    try {
      await sql`
        INSERT INTO job_bookmarks (id, "userId", "jobId", "createdAt")
        VALUES (${bookmarkId}, ${veterinarianId}, ${jobId}, NOW())
        ON CONFLICT ("userId", "jobId") DO NOTHING
      `;
    } catch (error) {
      // Ignore duplicate key errors
    }
  }

  // Resume bookmarks 생성
  for (let i = 0; i < Math.min(hospitals.length, 15); i++) {
    const hospitalId = randomChoice(hospitals).id;
    const resumeId = randomChoice(resumes).id;
    const bookmarkId = createId();

    try {
      await sql`
        INSERT INTO resume_bookmarks (id, "userId", "resumeId", "createdAt")
        VALUES (${bookmarkId}, ${hospitalId}, ${resumeId}, NOW())
        ON CONFLICT ("userId", "resumeId") DO NOTHING
      `;
    } catch (error) {
      // Ignore duplicate key errors
    }
  }

  // Applications 생성
  for (let i = 0; i < Math.min(veterinarians.length, 20); i++) {
    const veterinarianId = randomChoice(veterinarians).id;
    const job = randomChoice(jobs);
    const applicationId = createId();
    const statuses = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];

    try {
      await sql`
        INSERT INTO applications (
          id, "jobId", "veterinarianId", "coverLetter", status, "appliedAt", "createdAt", "updatedAt"
        )
        VALUES (
          ${applicationId}, ${job.id}, ${veterinarianId}, 
          ${"안녕하세요. 해당 포지션에 지원하고 싶습니다. 성실히 근무하겠습니다."},
          ${randomChoice(statuses)}, NOW(), NOW(), NOW()
        )
        ON CONFLICT ("jobId", "veterinarianId") DO NOTHING
      `;
    } catch (error) {
      // Ignore duplicate key errors
    }
  }

  console.log("   ✅ Created bookmarks and applications");
}

async function createMessages(users: any[]) {
  const messageSubjects = [
    "면접 일정 안내", "추가 서류 요청", "합격 통보", "근무 조건 협의", "병원 견학 제안"
  ];

  const messageContents = [
    "안녕하세요. 면접 일정을 알려드립니다.",
    "추가로 필요한 서류가 있어 연락드립니다.", 
    "축하합니다! 합격하셨습니다.",
    "근무 조건에 대해 상의하고 싶습니다.",
    "병원 견학을 원하시면 연락해주세요."
  ];

  for (let i = 0; i < 20; i++) {
    const sender = randomChoice(users);
    const receiver = randomChoice(users.filter(u => u.id !== sender.id));
    const messageId = createId();
    const status = Math.random() > 0.3 ? "READ" : "UNREAD";

    await sql`
      INSERT INTO messages (
        id, "senderId", "receiverId", subject, content, status, "readAt", "createdAt", "updatedAt"
      )
      VALUES (
        ${messageId}, ${sender.id}, ${receiver.id}, 
        ${randomChoice(messageSubjects)}, ${randomChoice(messageContents)},
        ${status}, 
        ${status === "READ" ? sql`NOW()` : null},
        NOW(), NOW()
      )
    `;
  }

  console.log("   ✅ Created 20 messages");
}

// 환경 설정 함수
function setupEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  console.log(`🌍 Environment: ${env}`);
  
  if (env === 'production') {
    console.log("🚀 Running in production mode");
  } else {
    console.log("🛠️  Running in development mode");
  }
}

// Run if called directly
if (require.main === module) {
  setupEnvironment();
  createProductionData().then(() => process.exit(0));
}

export { createProductionData };