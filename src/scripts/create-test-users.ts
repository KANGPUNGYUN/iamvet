// Test users creation script
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Load environment variables manually
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-round-mouse-a1lqm39w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

import { sql } from "@/lib/db";

// Simple ID generator (similar to cuid2)
function createId() {
  return randomBytes(12).toString("base64url");
}

async function createTestUsers() {
  try {
    // Test passwords
    const hospitalPassword = "hospital123!";
    const veterinarianPassword = "vet123!";

    // Hash passwords
    const hospitalPasswordHash = await bcrypt.hash(hospitalPassword, 12);
    const veterinarianPasswordHash = await bcrypt.hash(veterinarianPassword, 12);

    console.log("Creating test users...");

    // Generate unique IDs
    const hospitalId = createId();
    const veterinarianId = createId();

    // Create test hospital user
    const hospitalUser = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType", 
        "termsAgreedAt", "privacyAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${hospitalId}, 'testHospital', 'hospital@test.com', '010-1234-5678', 
        ${hospitalPasswordHash}, 'HOSPITAL', NOW(), NOW(), true, NOW(), NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        "passwordHash" = ${hospitalPasswordHash},
        "updatedAt" = NOW()
      RETURNING *
    `;

    console.log("Hospital user created:", hospitalUser[0]?.id);

    // Create test veterinarian user
    const veterinarianUser = await sql`
      INSERT INTO users (
        id, username, email, phone, "passwordHash", "userType",
        "termsAgreedAt", "privacyAgreedAt", "isActive", "createdAt", "updatedAt"
      )
      VALUES (
        ${veterinarianId}, 'testVet', 'vet@test.com', '010-8765-4321',
        ${veterinarianPasswordHash}, 'VETERINARIAN', NOW(), NOW(), true, NOW(), NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        "passwordHash" = ${veterinarianPasswordHash},
        "updatedAt" = NOW()
      RETURNING *
    `;

    console.log("Veterinarian user created:", veterinarianUser[0]?.id);

    // Create hospital profile if user was created
    if (hospitalUser[0]) {
      const hospitalProfileId = createId();
      await sql`
        INSERT INTO hospital_profiles (
          id, "userId", "hospitalName", "businessNumber", address, phone, "businessLicense", "createdAt", "updatedAt"
        )
        VALUES (
          ${hospitalProfileId}, ${hospitalUser[0].id}, '테스트 동물병원', '123-45-67890', 
          '서울시 강남구 테스트로 123', '02-1234-5678', 'test-license.jpg', NOW(), NOW()
        )
        ON CONFLICT ("userId") DO UPDATE SET
          "hospitalName" = '테스트 동물병원',
          "updatedAt" = NOW()
      `;
      console.log("Hospital profile created");
    }

    // Create veterinarian profile if user was created  
    if (veterinarianUser[0]) {
      const vetProfileId = createId();
      await sql`
        INSERT INTO veterinarian_profiles (
          id, "userId", nickname, "licenseImage", "createdAt", "updatedAt"
        )
        VALUES (
          ${vetProfileId}, ${veterinarianUser[0].id}, '테스트수의사', 'test-vet-license.jpg', NOW(), NOW()
        )
        ON CONFLICT ("userId") DO UPDATE SET
          nickname = '테스트수의사',
          "updatedAt" = NOW()
      `;
      console.log("Veterinarian profile created");
    }

    console.log("✅ Test users created successfully!");
    console.log("Hospital Login - Email: hospital@test.com, Password: hospital123!");
    console.log("Veterinarian Login - Email: vet@test.com, Password: vet123!");

  } catch (error) {
    console.error("❌ Error creating test users:", error);
  }
}

// Run if called directly
if (require.main === module) {
  createTestUsers().then(() => process.exit(0));
}

export { createTestUsers };