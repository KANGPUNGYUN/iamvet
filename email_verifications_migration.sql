-- Email verification table migration for production
-- This script adds the email_verifications table to the existing production database

-- Check if the table already exists, and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_verifications'
    ) THEN
        -- Create the email_verifications table
        CREATE TABLE "email_verifications" (
            "id" TEXT NOT NULL,
            "userId" TEXT,
            "email" TEXT NOT NULL,
            "verificationCode" TEXT NOT NULL,
            "expiresAt" TIMESTAMP(3) NOT NULL,
            "verified" BOOLEAN NOT NULL DEFAULT false,
            "verifiedAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
        );

        -- Create indexes for performance
        CREATE INDEX "email_verifications_userId_idx" ON "email_verifications"("userId");
        CREATE INDEX "email_verifications_email_idx" ON "email_verifications"("email");
        CREATE INDEX "email_verifications_verificationCode_idx" ON "email_verifications"("verificationCode");
        CREATE INDEX "email_verifications_expiresAt_idx" ON "email_verifications"("expiresAt");

        -- Add foreign key constraint
        ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

        RAISE NOTICE 'email_verifications table created successfully';
    ELSE
        RAISE NOTICE 'email_verifications table already exists';
    END IF;
END
$$;