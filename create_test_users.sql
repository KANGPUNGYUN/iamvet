-- 고정된 테스트 회원 생성 스크립트
-- 수의사 계정 2개, 수의학과 학생 계정 2개, 병원 계정 2개

-- 수의사 계정 1
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "birthDate", "licenseImage"
) VALUES (
  'vet_001', 
  'vet1@test.com', 
  '010-1111-1111', 
  '$2b$10$example.hash.for.password123', 
  '김수의', 
  '김수의사', 
  'vet001',
  'VETERINARIAN', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '1985-03-15'::timestamp, 
  'https://example.com/license1.jpg'
);

-- 수의사 계정 2
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "birthDate", "licenseImage"
) VALUES (
  'vet_002', 
  'vet2@test.com', 
  '010-2222-2222', 
  '$2b$10$example.hash.for.password123', 
  '박동물', 
  '박수의사', 
  'vet002',
  'VETERINARIAN', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '1988-07-22'::timestamp, 
  'https://example.com/license2.jpg'
);

-- 수의학과 학생 계정 1
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "birthDate", "universityEmail"
) VALUES (
  'student_001', 
  'student1@test.com', 
  '010-3333-3333', 
  '$2b$10$example.hash.for.password123', 
  '이학생', 
  '이수의학생', 
  'student001',
  'VETERINARY_STUDENT', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '1998-05-10'::timestamp, 
  'student1@university.ac.kr'
);

-- 수의학과 학생 계정 2
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "birthDate", "universityEmail"
) VALUES (
  'student_002', 
  'student2@test.com', 
  '010-4444-4444', 
  '$2b$10$example.hash.for.password123', 
  '최예과', 
  '최수의학생', 
  'student002',
  'VETERINARY_STUDENT', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '1999-11-08'::timestamp, 
  'student2@university.ac.kr'
);

-- 병원 계정 1
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "hospitalName", "businessNumber", 
  "establishedDate", "hospitalAddress", "hospitalAddressDetail", 
  "hospitalWebsite", "hospitalLogo"
) VALUES (
  'hospital_001', 
  'hospital1@test.com', 
  '02-1111-1111', 
  '$2b$10$example.hash.for.password123', 
  '서울동물병원', 
  '서울동물병원', 
  'hospital001',
  'HOSPITAL', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '서울동물병원', 
  '123-45-67890', 
  '2010-01-15'::timestamp,
  '서울시 강남구 테헤란로 123', 
  '1층 101호',
  'https://seoul-animal.com', 
  'https://example.com/hospital1_logo.jpg'
);

-- 병원 계정 2
INSERT INTO users (
  id, email, phone, "passwordHash", "realName", nickname, "loginId",
  "userType", provider, "isActive", 
  "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt",
  "createdAt", "updatedAt", "hospitalName", "businessNumber", 
  "establishedDate", "hospitalAddress", "hospitalAddressDetail", 
  "hospitalWebsite", "hospitalLogo"
) VALUES (
  'hospital_002', 
  'hospital2@test.com', 
  '02-2222-2222', 
  '$2b$10$example.hash.for.password123', 
  '부산펫클리닉', 
  '부산펫클리닉', 
  'hospital002',
  'HOSPITAL', 
  'NORMAL', 
  true,
  NOW(), 
  NOW(), 
  NOW(),
  NOW(), 
  NOW(), 
  '부산펫클리닉', 
  '987-65-43210', 
  '2015-06-20'::timestamp,
  '부산시 해운대구 센텀로 456', 
  '2층 201호',
  'https://busan-pet.com', 
  'https://example.com/hospital2_logo.jpg'
);

-- 생성된 사용자 확인
SELECT 
  id, 
  email, 
  "realName", 
  nickname, 
  "userType", 
  "createdAt"
FROM users 
ORDER BY "userType", id;