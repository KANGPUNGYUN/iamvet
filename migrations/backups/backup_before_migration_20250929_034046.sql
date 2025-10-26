--
-- PostgreSQL database dump
--

\restrict geKclzPfgtX2tKPtc8kgcEi2f1KKMIuvBTyfp6hhBX388G8ioMQnTNMMa4S0boN

-- Dumped from database version 17.5 (84bec44)
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AdminRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AdminRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'MODERATOR'
);


ALTER TYPE public."AdminRole" OWNER TO neondb_owner;

--
-- Name: AdvertisementStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AdvertisementStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'EXPIRED',
    'SCHEDULED'
);


ALTER TYPE public."AdvertisementStatus" OWNER TO neondb_owner;

--
-- Name: AdvertisementTargetAudience; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AdvertisementTargetAudience" AS ENUM (
    'ALL',
    'VETERINARIANS',
    'HOSPITALS'
);


ALTER TYPE public."AdvertisementTargetAudience" OWNER TO neondb_owner;

--
-- Name: AdvertisementType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AdvertisementType" AS ENUM (
    'HERO_BANNER',
    'GENERAL_BANNER',
    'SIDE_AD',
    'AD_CARD'
);


ALTER TYPE public."AdvertisementType" OWNER TO neondb_owner;

--
-- Name: AnimalType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AnimalType" AS ENUM (
    'DOG',
    'CAT',
    'EXOTIC',
    'LARGE_ANIMAL'
);


ALTER TYPE public."AnimalType" OWNER TO neondb_owner;

--
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'PENDING',
    'REVIEWING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."ApplicationStatus" OWNER TO neondb_owner;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."JobStatus" AS ENUM (
    'ACTIVE',
    'CLOSED',
    'DRAFT'
);


ALTER TYPE public."JobStatus" OWNER TO neondb_owner;

--
-- Name: MessageStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."MessageStatus" AS ENUM (
    'UNREAD',
    'READ'
);


ALTER TYPE public."MessageStatus" OWNER TO neondb_owner;

--
-- Name: NotificationBatchStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationBatchStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."NotificationBatchStatus" OWNER TO neondb_owner;

--
-- Name: NotificationPriority; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationPriority" AS ENUM (
    'HIGH',
    'NORMAL',
    'LOW'
);


ALTER TYPE public."NotificationPriority" OWNER TO neondb_owner;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationType" AS ENUM (
    'ANNOUNCEMENT',
    'INQUIRY',
    'COMMENT',
    'REPLY',
    'APPLICATION_STATUS',
    'APPLICATION_NEW'
);


ALTER TYPE public."NotificationType" OWNER TO neondb_owner;

--
-- Name: Provider; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Provider" AS ENUM (
    'NORMAL',
    'GOOGLE',
    'KAKAO',
    'NAVER'
);


ALTER TYPE public."Provider" OWNER TO neondb_owner;

--
-- Name: SalaryType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SalaryType" AS ENUM (
    'HOURLY',
    'MONTHLY',
    'YEARLY',
    'NEGOTIABLE'
);


ALTER TYPE public."SalaryType" OWNER TO neondb_owner;

--
-- Name: SpecialtyType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SpecialtyType" AS ENUM (
    'INTERNAL_MEDICINE',
    'SURGERY',
    'DERMATOLOGY',
    'DENTISTRY',
    'OPHTHALMOLOGY',
    'NEUROLOGY',
    'ORTHOPEDICS'
);


ALTER TYPE public."SpecialtyType" OWNER TO neondb_owner;

--
-- Name: TransferStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."TransferStatus" AS ENUM (
    'ACTIVE',
    'SOLD',
    'RESERVED',
    'DISABLED'
);


ALTER TYPE public."TransferStatus" OWNER TO neondb_owner;

--
-- Name: UserType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserType" AS ENUM (
    'VETERINARIAN',
    'HOSPITAL',
    'VETERINARY_STUDENT'
);


ALTER TYPE public."UserType" OWNER TO neondb_owner;

--
-- Name: WorkType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."WorkType" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP'
);


ALTER TYPE public."WorkType" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin_users (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    name text NOT NULL,
    role public."AdminRole" DEFAULT 'ADMIN'::public."AdminRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.admin_users OWNER TO neondb_owner;

--
-- Name: advertisements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.advertisements (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public."AdvertisementType" NOT NULL,
    "imageUrl" text,
    "linkUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "targetAudience" public."AdvertisementTargetAudience" DEFAULT 'ALL'::public."AdvertisementTargetAudience" NOT NULL,
    "buttonText" text,
    variant text,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "clickCount" integer DEFAULT 0 NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.advertisements OWNER TO neondb_owner;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    "notificationId" text NOT NULL,
    "targetUserTypes" text[],
    priority public."NotificationPriority" DEFAULT 'NORMAL'::public."NotificationPriority" NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdBy" text NOT NULL
);


ALTER TABLE public.announcements OWNER TO neondb_owner;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.applications (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "veterinarianId" text NOT NULL,
    "coverLetter" text,
    status public."ApplicationStatus" DEFAULT 'PENDING'::public."ApplicationStatus" NOT NULL,
    "appliedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.applications OWNER TO neondb_owner;

--
-- Name: comment_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comment_notifications (
    id text NOT NULL,
    "notificationId" text NOT NULL,
    "postType" text NOT NULL,
    "postId" text NOT NULL,
    "commentId" text NOT NULL,
    "parentCommentId" text
);


ALTER TABLE public.comment_notifications OWNER TO neondb_owner;

--
-- Name: comment_replies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comment_replies (
    id text NOT NULL,
    "commentId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.comment_replies OWNER TO neondb_owner;

--
-- Name: contact_inquiries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.contact_inquiries (
    id text NOT NULL,
    sender_id text NOT NULL,
    recipient_id text NOT NULL,
    job_id text,
    resume_id text,
    subject text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'general'::text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contact_inquiries OWNER TO neondb_owner;

--
-- Name: detailed_resumes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.detailed_resumes (
    id text NOT NULL,
    "userId" text NOT NULL,
    photo text,
    name text NOT NULL,
    "birthDate" text,
    introduction text,
    phone text,
    email text,
    "phonePublic" boolean DEFAULT false NOT NULL,
    "emailPublic" boolean DEFAULT false NOT NULL,
    "position" text,
    specialties text[],
    "preferredRegions" text[],
    "expectedSalary" text,
    "workTypes" text[],
    "startDate" text,
    "preferredWeekdays" text[],
    "weekdaysNegotiable" boolean DEFAULT false NOT NULL,
    "workStartTime" text,
    "workEndTime" text,
    "workTimeNegotiable" boolean DEFAULT false NOT NULL,
    "selfIntroduction" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "viewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.detailed_resumes OWNER TO neondb_owner;

--
-- Name: forum_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.forum_comments (
    id character varying(255) NOT NULL,
    forum_id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    parent_id character varying(255),
    content text NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" timestamp(6) with time zone
);


ALTER TABLE public.forum_comments OWNER TO neondb_owner;

--
-- Name: forum_post_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.forum_post_likes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "forumPostId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.forum_post_likes OWNER TO neondb_owner;

--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.forum_posts (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "animalType" text NOT NULL,
    "medicalField" text NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.forum_posts OWNER TO neondb_owner;

--
-- Name: hospital_animals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_animals (
    id text NOT NULL,
    "userId" text NOT NULL,
    "animalType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.hospital_animals OWNER TO neondb_owner;

--
-- Name: hospital_animals_backup; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_animals_backup (
    id text,
    "userId" text,
    "animalType" text,
    "createdAt" timestamp(3) without time zone
);


ALTER TABLE public.hospital_animals_backup OWNER TO neondb_owner;

--
-- Name: hospital_business_licenses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_business_licenses (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fileSize" integer
);


ALTER TABLE public.hospital_business_licenses OWNER TO neondb_owner;

--
-- Name: hospital_evaluations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_evaluations (
    id text NOT NULL,
    "hospitalId" text NOT NULL,
    "userId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.hospital_evaluations OWNER TO neondb_owner;

--
-- Name: hospital_images; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_images (
    id character varying NOT NULL,
    "hospitalId" character varying NOT NULL,
    "userId" character varying NOT NULL,
    "imageUrl" character varying NOT NULL,
    "imageOrder" integer NOT NULL,
    "imageDescription" character varying,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_image_order CHECK ((("imageOrder" >= 1) AND ("imageOrder" <= 10)))
);


ALTER TABLE public.hospital_images OWNER TO neondb_owner;

--
-- Name: hospital_specialties; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_specialties (
    id text NOT NULL,
    "userId" text NOT NULL,
    specialty text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.hospital_specialties OWNER TO neondb_owner;

--
-- Name: hospital_specialties_backup; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_specialties_backup (
    id text,
    "userId" text,
    specialty text,
    "createdAt" timestamp(3) without time zone
);


ALTER TABLE public.hospital_specialties_backup OWNER TO neondb_owner;

--
-- Name: hospital_treatment_animals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_treatment_animals (
    id character varying NOT NULL,
    "hospitalId" character varying NOT NULL,
    "userId" character varying NOT NULL,
    "animalType" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospital_treatment_animals OWNER TO neondb_owner;

--
-- Name: hospital_treatment_specialties; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospital_treatment_specialties (
    id character varying NOT NULL,
    "hospitalId" character varying NOT NULL,
    "userId" character varying NOT NULL,
    specialty character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospital_treatment_specialties OWNER TO neondb_owner;

--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospitals (
    id character varying NOT NULL,
    "userId" character varying NOT NULL,
    "hospitalName" character varying NOT NULL,
    "representativeName" character varying NOT NULL,
    "businessNumber" character varying,
    "businessLicenseFile" character varying,
    "establishedDate" timestamp without time zone,
    "hospitalAddress" character varying,
    "hospitalAddressDetail" character varying,
    "postalCode" character varying,
    latitude numeric(10,8),
    longitude numeric(11,8),
    "hospitalLogo" character varying,
    "hospitalWebsite" character varying,
    "hospitalDescription" text,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospitals OWNER TO neondb_owner;

--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inquiries (
    id text NOT NULL,
    "notificationId" text NOT NULL,
    "inquiryType" text NOT NULL,
    subject text NOT NULL,
    attachments text[],
    "repliedAt" timestamp(3) without time zone
);


ALTER TABLE public.inquiries OWNER TO neondb_owner;

--
-- Name: job_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.job_likes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "jobId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.job_likes OWNER TO neondb_owner;

--
-- Name: job_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.job_notifications (
    id text NOT NULL,
    "notificationId" text NOT NULL,
    "jobId" text NOT NULL,
    "applicationId" text NOT NULL,
    "previousStatus" text,
    "newStatus" public."ApplicationStatus" NOT NULL
);


ALTER TABLE public.job_notifications OWNER TO neondb_owner;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jobs (
    id text NOT NULL,
    "hospitalId" text NOT NULL,
    title text NOT NULL,
    benefits text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    certifications text[] DEFAULT ARRAY[]::text[],
    department text NOT NULL,
    education text[] DEFAULT ARRAY[]::text[],
    experience text[] DEFAULT ARRAY[]::text[],
    "experienceDetails" text[] DEFAULT ARRAY[]::text[],
    "isActive" boolean DEFAULT true NOT NULL,
    "isDraft" boolean DEFAULT false NOT NULL,
    "isUnlimitedRecruit" boolean DEFAULT false NOT NULL,
    "isWorkDaysNegotiable" boolean DEFAULT false NOT NULL,
    "isWorkTimeNegotiable" boolean DEFAULT false NOT NULL,
    major text[] DEFAULT ARRAY[]::text[],
    "managerEmail" text NOT NULL,
    "managerName" text NOT NULL,
    "managerPhone" text NOT NULL,
    "position" text NOT NULL,
    preferences text[] DEFAULT ARRAY[]::text[],
    "recruitEndDate" timestamp(3) without time zone,
    salary text NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "workDays" text[] DEFAULT ARRAY[]::text[],
    "workEndTime" text,
    "workStartTime" text,
    "salaryType" text NOT NULL,
    "workType" text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.jobs OWNER TO neondb_owner;

--
-- Name: lecture_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lecture_comments (
    id text NOT NULL,
    "lectureId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "parentId" character varying(255)
);


ALTER TABLE public.lecture_comments OWNER TO neondb_owner;

--
-- Name: lecture_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lecture_likes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lectureId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.lecture_likes OWNER TO neondb_owner;

--
-- Name: lectures; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lectures (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "videoUrl" text NOT NULL,
    thumbnail text,
    duration integer,
    category text,
    tags text[],
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    instructor character varying(255)
);


ALTER TABLE public.lectures OWNER TO neondb_owner;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    subject text,
    content text NOT NULL,
    status public."MessageStatus" DEFAULT 'UNREAD'::public."MessageStatus" NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: migration_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.migration_log (
    id integer NOT NULL,
    migration_name character varying(255) NOT NULL,
    executed_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    description text
);


ALTER TABLE public.migration_log OWNER TO neondb_owner;

--
-- Name: migration_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.migration_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migration_log_id_seq OWNER TO neondb_owner;

--
-- Name: migration_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.migration_log_id_seq OWNED BY public.migration_log.id;


--
-- Name: notification_batches; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_batches (
    id text NOT NULL,
    "announcementId" text NOT NULL,
    "totalRecipients" integer NOT NULL,
    "sentCount" integer DEFAULT 0 NOT NULL,
    "failedCount" integer DEFAULT 0 NOT NULL,
    status public."NotificationBatchStatus" DEFAULT 'PENDING'::public."NotificationBatchStatus" NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notification_batches OWNER TO neondb_owner;

--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_settings (
    id text NOT NULL,
    "userId" text NOT NULL,
    "announcementEnabled" boolean DEFAULT true NOT NULL,
    "inquiryEnabled" boolean DEFAULT true NOT NULL,
    "commentEnabled" boolean DEFAULT true NOT NULL,
    "jobEnabled" boolean DEFAULT true NOT NULL,
    "emailNotifications" boolean DEFAULT false NOT NULL,
    "pushNotifications" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notification_settings OWNER TO neondb_owner;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    type public."NotificationType" NOT NULL,
    "recipientId" text NOT NULL,
    "recipientType" public."UserType" NOT NULL,
    "senderId" text,
    title text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: resume_educations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_educations (
    id text NOT NULL,
    "resumeId" text NOT NULL,
    degree text NOT NULL,
    "graduationStatus" text NOT NULL,
    "schoolName" text NOT NULL,
    major text NOT NULL,
    gpa text,
    "totalGpa" text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resume_educations OWNER TO neondb_owner;

--
-- Name: resume_evaluations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_evaluations (
    id text NOT NULL,
    "resumeId" text NOT NULL,
    "userId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.resume_evaluations OWNER TO neondb_owner;

--
-- Name: resume_experiences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_experiences (
    id text NOT NULL,
    "resumeId" text NOT NULL,
    "hospitalName" text NOT NULL,
    "mainTasks" text NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resume_experiences OWNER TO neondb_owner;

--
-- Name: resume_licenses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_licenses (
    id text NOT NULL,
    "resumeId" text NOT NULL,
    name text NOT NULL,
    issuer text NOT NULL,
    "acquiredDate" timestamp(3) without time zone,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resume_licenses OWNER TO neondb_owner;

--
-- Name: resume_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_likes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "resumeId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.resume_likes OWNER TO neondb_owner;

--
-- Name: resume_medical_capabilities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resume_medical_capabilities (
    id text NOT NULL,
    "resumeId" text NOT NULL,
    field text NOT NULL,
    proficiency text NOT NULL,
    description text,
    others text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.resume_medical_capabilities OWNER TO neondb_owner;

--
-- Name: resumes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resumes (
    id text NOT NULL,
    "veterinarianId" text NOT NULL,
    title text NOT NULL,
    introduction text,
    experience text,
    education text,
    certifications text,
    skills text,
    "preferredSalary" integer,
    "preferredLocation" text,
    "availableFrom" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.resumes OWNER TO neondb_owner;

--
-- Name: social_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    provider public."Provider" NOT NULL,
    "providerId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.social_accounts OWNER TO neondb_owner;

--
-- Name: transfer_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transfer_likes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "transferId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transfer_likes OWNER TO neondb_owner;

--
-- Name: transfers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transfers (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    price integer,
    category text NOT NULL,
    images text[],
    status public."TransferStatus" DEFAULT 'ACTIVE'::public."TransferStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    area integer,
    base_address text,
    detail_address text,
    latitude double precision,
    longitude double precision,
    sido text,
    sigungu text,
    views integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.transfers OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "passwordHash" text,
    "profileImage" text,
    "userType" public."UserType" NOT NULL,
    provider public."Provider" DEFAULT 'NORMAL'::public."Provider" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "termsAgreedAt" timestamp(3) without time zone NOT NULL,
    "privacyAgreedAt" timestamp(3) without time zone NOT NULL,
    "marketingAgreedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "withdrawReason" text,
    "restoredAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(6) without time zone,
    "loginId" character varying(100),
    seq integer NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_seq_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_seq_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_seq_seq OWNER TO neondb_owner;

--
-- Name: users_seq_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_seq_seq OWNED BY public.users.seq;


--
-- Name: veterinarian_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.veterinarian_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    nickname text NOT NULL,
    "birthDate" timestamp(3) without time zone,
    "licenseImage" text,
    experience text,
    specialty text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.veterinarian_profiles OWNER TO neondb_owner;

--
-- Name: veterinarians; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.veterinarians (
    id character varying NOT NULL,
    "userId" character varying NOT NULL,
    "realName" character varying NOT NULL,
    "birthDate" timestamp without time zone,
    nickname character varying(100),
    "licenseImage" character varying,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.veterinarians OWNER TO neondb_owner;

--
-- Name: veterinary_students; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.veterinary_students (
    id character varying NOT NULL,
    "userId" character varying NOT NULL,
    "realName" character varying NOT NULL,
    "birthDate" timestamp without time zone,
    nickname character varying(100),
    "universityEmail" character varying,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.veterinary_students OWNER TO neondb_owner;

--
-- Name: view_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.view_logs (
    id text NOT NULL,
    content_type text NOT NULL,
    content_id text NOT NULL,
    user_id text,
    user_identifier text NOT NULL,
    ip_address text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.view_logs OWNER TO neondb_owner;

--
-- Name: migration_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.migration_log ALTER COLUMN id SET DEFAULT nextval('public.migration_log_id_seq'::regclass);


--
-- Name: users seq; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN seq SET DEFAULT nextval('public.users_seq_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d719149d-2bfb-4232-8af5-41ab76bdf29d	a1e6257bde04151b24e373dabee0989e8cad5e0dfb4dd397c1f8a01b9b99d129	\N	20250928_merge_hospital_tables	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250928_merge_hospital_tables\n\nDatabase error code: 2BP01\n\nDatabase error:\nERROR: cannot drop table detailed_hospital_profiles because other objects depend on it\nDETAIL: constraint hospital_staff_hospitalProfileId_fkey on table hospital_staff depends on table detailed_hospital_profiles\nconstraint hospital_equipments_hospitalProfileId_fkey on table hospital_equipments depends on table detailed_hospital_profiles\nHINT: Use DROP ... CASCADE to drop the dependent objects too.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E2BP01), message: "cannot drop table detailed_hospital_profiles because other objects depend on it", detail: Some("constraint hospital_staff_hospitalProfileId_fkey on table hospital_staff depends on table detailed_hospital_profiles\\nconstraint hospital_equipments_hospitalProfileId_fkey on table hospital_equipments depends on table detailed_hospital_profiles"), hint: Some("Use DROP ... CASCADE to drop the dependent objects too."), position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("dependency.c"), line: Some(1148), routine: Some("reportDependentObjects") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250928_merge_hospital_tables"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20250928_merge_hospital_tables"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	2025-09-28 14:26:05.095534+00	2025-09-28 14:25:18.334688+00	0
fa7ba18a-c9da-4e99-a644-4c9fe091a2f3	5ef6ed51a42d5cd9c7738e7d792812f17672770fd8260627da02f51300ae1630	2025-09-24 22:57:57.111855+00	20240101000000_init	\N	\N	2025-09-24 22:57:56.448114+00	1
d2678fa2-67e5-4fe4-926c-830d4706b4b2	a3e273b2aedfcdd04c8cc8df8e5d834ed163260cf853c128a5bef3017d27dcc7	2025-09-28 14:26:05.262508+00	20250928_merge_hospital_tables		\N	2025-09-28 14:26:05.262508+00	0
c66f3271-6d5b-474a-adf9-44a038e3f58a	788a96c99c8931aa671620d7f1dfaefebf66b66fff797578b7a0a0fbdef70af8	2025-09-24 22:57:57.701048+00	20240108000000_fix_license_image_nullable	\N	\N	2025-09-24 22:57:57.281214+00	1
baeee47c-b146-4174-a0be-4ffb47c19806	5d96d3cd4f613b1f85aa06855f1ab9af0c0e647b10467eabc0b1974920f33c81	2025-09-24 22:57:58.292671+00	20240109000000_add_real_name	\N	\N	2025-09-24 22:57:57.869971+00	1
6ec034ad-753c-4c7e-a7ab-2bb841007e2e	18995d01051d46c58b70f21fec26fc2224855636cb3769b8bd8b301ae110577f	\N	20250911000000_add_veterinary_student	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250911000000_add_veterinary_student\n\nDatabase error code: 42701\n\nDatabase error:\nERROR: column "realName" of relation "users" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42701), message: "column \\"realName\\" of relation \\"users\\" already exists", detail: None, hint: None, position: None, where_: Some("SQL statement \\"ALTER TABLE \\"users\\" ADD COLUMN \\"realName\\" VARCHAR\\"\\nPL/pgSQL function inline_code_block line 5 at SQL statement"), schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7478), routine: Some("check_for_column_name_collision") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250911000000_add_veterinary_student"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20250911000000_add_veterinary_student"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	2025-09-24 22:58:10.269325+00	2025-09-24 22:57:58.461789+00	0
d6d42b5c-15ff-49bb-908f-80b4fb12f340	18995d01051d46c58b70f21fec26fc2224855636cb3769b8bd8b301ae110577f	2025-09-24 22:58:10.442076+00	20250911000000_add_veterinary_student		\N	2025-09-24 22:58:10.442076+00	0
7e621591-87f4-4ca3-aac1-7eb011eb265f	3ea4db1995f7e003eb1d46271fb7e1003c81825a47dc163396d9514a22a0d309	2025-09-24 22:58:19.677105+00	20250917011159_unify_veterinarian_profiles		\N	2025-09-24 22:58:19.677105+00	0
04b56b32-77d1-4144-a4f8-e953afecffa4	b59b2da23e73391f738bff3da94bcefbbfacd3d734f1dbcc6f8418cc7c2dcdfe	2025-09-24 22:58:43.625734+00	20250920000000_add_birth_date_to_users		\N	2025-09-24 22:58:43.625734+00	0
c779c980-97a2-4066-be0a-913de5d5a6f5	0e4ecfcbaf8dad4addad5c92e760ebcbfda4bb7cfe9a77c6cb2be89c2e2c8f33	2025-09-24 22:58:55.231496+00	20250923042314_add_notification_system		\N	2025-09-24 22:58:55.231496+00	0
b683f8f4-564f-4959-b0fb-45e271d32faa	b68839ae75983553fc54f3db6c1f8957322135b9173115d38160ae626b587dea	2025-09-24 22:59:05.634409+00	20250924_fix_resume_evaluations_fkey		\N	2025-09-24 22:59:05.634409+00	0
0fb9753e-b34d-4295-a7d7-6fb704af128c	efd70bfa77218a7823740963744961fbd5d820cf122f3be4d0e47c087c027898	2025-09-28 11:26:32.882036+00	005_remove_license_grade	\N	\N	2025-09-28 11:26:32.418502+00	1
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admin_users (id, email, "passwordHash", name, role, "isActive", "lastLoginAt", "createdAt", "updatedAt") FROM stdin;
admin_GwDUKRa75D_v2zTo	admin@iamvet.co.kr	$2b$12$synkHxSd40vu68to9YJ7yuJNeZ4iG0Y9zlwowxIN7abWuJecufsru	시스템 관리자	SUPER_ADMIN	t	2025-09-25 21:25:55.166	2025-09-25 21:12:13.225	2025-09-25 21:25:55.166
\.


--
-- Data for Name: advertisements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.advertisements (id, title, description, type, "imageUrl", "linkUrl", "isActive", "startDate", "endDate", "targetAudience", "buttonText", variant, "viewCount", "clickCount", "createdBy", "createdAt", "updatedAt", "deletedAt") FROM stdin;
ad_L0dVJyroTO_3OBRu	광고테스트 2	히어로 배너 광고 테스트	HERO_BANNER	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/advertisements/olcwnzhtco8ff1f9g1sawqp1.png	https://iamvet.vercel.app/member-select	t	2025-09-26 00:00:00	2025-09-30 00:00:00	ALL	이동하기	default	0	0	admin_GwDUKRa75D_v2zTo	2025-09-25 21:26:53.496	2025-09-25 21:27:40.407	2025-09-25 21:27:40.407
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.announcements (id, "notificationId", "targetUserTypes", priority, "expiresAt", "createdBy") FROM stdin;
Mxf9cwtjEOgOMP1aypuXn	ABTWRo8N9ONZ10WznTBGY	{ALL}	NORMAL	\N	DOWHFF7Lxg2af_Ex
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.applications (id, "jobId", "veterinarianId", "coverLetter", status, "appliedAt", "reviewedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: comment_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comment_notifications (id, "notificationId", "postType", "postId", "commentId", "parentCommentId") FROM stdin;
\.


--
-- Data for Name: comment_replies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comment_replies (id, "commentId", "userId", content, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: contact_inquiries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contact_inquiries (id, sender_id, recipient_id, job_id, resume_id, subject, message, type, is_read, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: detailed_resumes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.detailed_resumes (id, "userId", photo, name, "birthDate", introduction, phone, email, "phonePublic", "emailPublic", "position", specialties, "preferredRegions", "expectedSalary", "workTypes", "startDate", "preferredWeekdays", "weekdaysNegotiable", "workStartTime", "workEndTime", "workTimeNegotiable", "selfIntroduction", "createdAt", "updatedAt", "deletedAt", "viewCount") FROM stdin;
resume_7tGca3YS19it1i42_1759061443812	7tGca3YS19it1i42	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/resumes/jikuasf2t0kpzd66pbmi342k.png	김학생	2011-11-12	안녕하세요?	010-1111-1112	test@snu.ac.kr	t	t	veterinarian	{internal}	{seoul}	20000	{정규직}	1month	{monday,wednesday,tuesday,thursday,friday}	t	11:00	19:00	t	잘 부탁드립니다!	2025-09-28 12:10:45.953	2025-09-28 12:10:45.953	\N	0
resume_ExS5veE4OqwHGwkl_1759056330702	ExS5veE4OqwHGwkl	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/resumes/jpy0fqj359ffep6i3fbhp8iz.png	김진짜	1999-01-01	한줄 소개입니다	010-1111-1111	test@test.com	t	t	veterinarian	{dermatology}	{busan}	30000	{정규직}	immediate	{monday,tuesday,wednesday,thursday,friday}	t	11:00	18:00	t	자기 소개입니다	2025-09-28 10:45:30.756	2025-09-28 11:49:37.834	\N	3
\.


--
-- Data for Name: forum_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.forum_comments (id, forum_id, user_id, parent_id, content, "createdAt", "updatedAt", "deletedAt") FROM stdin;
comment_1759052791249_dsmp0tpyur9	forum_1759051547530_vafu6ka3nhe	ExS5veE4OqwHGwkl	\N	안녕하세요?	2025-09-28 09:46:31.307875+00	2025-09-28 09:46:31.307875+00	\N
comment_1759053577378_2ytlxzuru7v	forum_1759051547530_vafu6ka3nhe	ExS5veE4OqwHGwkl	comment_1759052791249_dsmp0tpyur9	반갑숩니다	2025-09-28 09:59:37.437732+00	2025-09-28 09:59:37.437732+00	\N
comment_1759053583639_739f7hj9x6f	forum_1759051547530_vafu6ka3nhe	ExS5veE4OqwHGwkl	\N	반가워요	2025-09-28 09:59:43.697526+00	2025-09-28 09:59:43.697526+00	\N
comment_1759053587602_h4oqi3wh809	forum_1759051547530_vafu6ka3nhe	ExS5veE4OqwHGwkl	comment_1759052791249_dsmp0tpyur9	ㅎㅎㅎ	2025-09-28 09:59:47.66082+00	2025-09-28 09:59:47.66082+00	\N
comment_1759078882636_b6rcpky6c56	forum_1759051547530_vafu6ka3nhe	Vb3jlzzQeX-sHIaB	comment_1759053583639_739f7hj9x6f	반갑습니다!	2025-09-28 17:01:22.693623+00	2025-09-28 17:01:22.693623+00	\N
comment_1759079960633_0sxtmn79o1fq	forum_1759051547530_vafu6ka3nhe	Vb3jlzzQeX-sHIaB	comment_1759053583639_739f7hj9x6f	반가워요	2025-09-28 17:19:20.688927+00	2025-09-28 17:19:20.688927+00	\N
comment_1759079978917_xyaimkkzz2p	forum_1759051547530_vafu6ka3nhe	Vb3jlzzQeX-sHIaB	\N	반갑습니다	2025-09-28 17:19:38.974837+00	2025-09-28 17:19:38.974837+00	\N
comment_1759080121276_sun62557daf	forum_1759051547530_vafu6ka3nhe	Vb3jlzzQeX-sHIaB	comment_1759053583639_739f7hj9x6f	반갑습니다	2025-09-28 17:22:01.325078+00	2025-09-28 17:22:01.325078+00	\N
comment_1759080947302_rdvircy682	forum_1759051547530_vafu6ka3nhe	Vb3jlzzQeX-sHIaB	comment_1759079978917_xyaimkkzz2p	ㅎㅇ요	2025-09-28 17:35:47.352738+00	2025-09-28 17:35:47.352738+00	\N
\.


--
-- Data for Name: forum_post_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.forum_post_likes (id, "userId", "forumPostId", "createdAt") FROM stdin;
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.forum_posts (id, "userId", title, content, "createdAt", "updatedAt", "deletedAt", "animalType", "medicalField", "viewCount") FROM stdin;
forum_1759051547530_vafu6ka3nhe	ExS5veE4OqwHGwkl	임상포럼	<p>좋아요!</p>	2025-09-28 09:25:48.12	2025-09-28 09:25:48.12	\N	강아지	내과	1
\.


--
-- Data for Name: hospital_animals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_animals (id, "userId", "animalType", "createdAt") FROM stdin;
XaAU3P-43VSwIFMs	DOWHFF7Lxg2af_Ex	DOG	2025-09-26 08:37:24.528
fkTmugbkST8f9ySD	Vb3jlzzQeX-sHIaB	DOG	2025-09-28 17:00:09.731
T8YeGhIf3ZVeB8i-	Vb3jlzzQeX-sHIaB	LARGE_ANIMAL	2025-09-28 17:00:09.823
\.


--
-- Data for Name: hospital_animals_backup; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_animals_backup (id, "userId", "animalType", "createdAt") FROM stdin;
XaAU3P-43VSwIFMs	DOWHFF7Lxg2af_Ex	DOG	2025-09-26 08:37:24.528
\.


--
-- Data for Name: hospital_business_licenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_business_licenses (id, "userId", "fileName", "fileUrl", "fileType", "uploadedAt", "fileSize") FROM stdin;
X8cuoEcqZsztWa-R	DOWHFF7Lxg2af_Ex	#35길동353-15.pdf	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/business-licenses/rlmuudmk3egaghdl3pougo5a.pdf	pdf	2025-09-26 08:37:24.528	5520578
_keqBwbKLx8l3CiZ	Vb3jlzzQeX-sHIaB	#66신림610-42.pdf	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/business-licenses/ctbzg2dbfbnzqstg0dd9ykls.pdf	pdf	2025-09-29 01:10:44.159	9003312
\.


--
-- Data for Name: hospital_evaluations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_evaluations (id, "hospitalId", "userId", rating, comment, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: hospital_images; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_images (id, "hospitalId", "userId", "imageUrl", "imageOrder", "imageDescription", "createdAt", "updatedAt") FROM stdin;
DR-QUHJ37wFVlVL_	G0bWAOX76fTBuXTf	Vb3jlzzQeX-sHIaB	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospital-facilities/imblu9ung5x8v3jmn0o989sj.jpg	1	\N	2025-09-28 17:00:09.273672	2025-09-28 17:00:09.273672
X2dRRteDNZLMLocK	G0bWAOX76fTBuXTf	Vb3jlzzQeX-sHIaB	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospital-facilities/apbk0wewmqrp89y7lchc5q4y.jpg	2	\N	2025-09-28 17:00:09.369803	2025-09-28 17:00:09.369803
\.


--
-- Data for Name: hospital_specialties; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_specialties (id, "userId", specialty, "createdAt") FROM stdin;
eXcGfqUJyzsc44VO	DOWHFF7Lxg2af_Ex	INTERNAL_MEDICINE	2025-09-26 08:37:24.528
ASb8An3ojhkHgfUX	Vb3jlzzQeX-sHIaB	INTERNAL_MEDICINE	2025-09-28 17:00:09.913
tgXFguPKEsnaoGdF	Vb3jlzzQeX-sHIaB	DERMATOLOGY	2025-09-28 17:00:10.004
\.


--
-- Data for Name: hospital_specialties_backup; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_specialties_backup (id, "userId", specialty, "createdAt") FROM stdin;
eXcGfqUJyzsc44VO	DOWHFF7Lxg2af_Ex	INTERNAL_MEDICINE	2025-09-26 08:37:24.528
\.


--
-- Data for Name: hospital_treatment_animals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_treatment_animals (id, "hospitalId", "userId", "animalType", "createdAt") FROM stdin;
4796e372-8cd2-437b-a850-f7f0f7b5e53a	9ed7af4f-f207-4eb0-b73a-06ca804bf100	DOWHFF7Lxg2af_Ex	DOG	2025-09-26 08:37:24.528
\.


--
-- Data for Name: hospital_treatment_specialties; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospital_treatment_specialties (id, "hospitalId", "userId", specialty, "createdAt") FROM stdin;
59e7137f-e5b3-493d-ad9f-273420c5523e	9ed7af4f-f207-4eb0-b73a-06ca804bf100	DOWHFF7Lxg2af_Ex	INTERNAL_MEDICINE	2025-09-26 08:37:24.528
\.


--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospitals (id, "userId", "hospitalName", "representativeName", "businessNumber", "businessLicenseFile", "establishedDate", "hospitalAddress", "hospitalAddressDetail", "postalCode", latitude, longitude, "hospitalLogo", "hospitalWebsite", "hospitalDescription", "createdAt", "updatedAt") FROM stdin;
9ed7af4f-f207-4eb0-b73a-06ca804bf100	DOWHFF7Lxg2af_Ex	아이엠벳 병원	김대표	134-35-15111	\N	2000-01-11 09:00:00	서울 강동구 동남로 892 (상일동)	강동경희대학교 동물병원 101호	\N	\N	\N	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospitals/a6r26jfptybeon1um7bqdipe.png		\N	2025-09-26 08:37:24.528	2025-09-26 08:37:24.528
rnkm120f5ZXNQkE9	35rAltMdlKfKfG4m	아이엠벳병원	박대표	141-45-55555	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/business-licenses/c4ru9ol8fs17hbw54l2vixn6.pdf	2011-11-11 09:00:00	서울 송파구 올림픽로 300 (신천동)	101호	05551	\N	\N	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospitals/kpr2oz94w40q19l8b0yl576a.png	https://www.naver.com	아이엠벳병원입니다,	2025-09-29 00:17:07.759	2025-09-29 00:17:07.759
G0bWAOX76fTBuXTf	Vb3jlzzQeX-sHIaB	아이엠벳병원	정대표	124-51-55555	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/business-licenses/pqzbihbbjqom3myv0e7zlxx1.pdf	2022-12-22 09:00:00	서울 송파구 올림픽로 300 (신천동)	101호	05551	\N	\N	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospitals/yfqamk16bot3u8wsn5tobwjl.png	https://www.naver.com	안녕하세여~	2025-09-29 01:10:44.159	2025-09-28 17:00:08.944851
\.


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inquiries (id, "notificationId", "inquiryType", subject, attachments, "repliedAt") FROM stdin;
\.


--
-- Data for Name: job_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.job_likes (id, "userId", "jobId", "createdAt") FROM stdin;
\.


--
-- Data for Name: job_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.job_notifications (id, "notificationId", "jobId", "applicationId", "previousStatus", "newStatus") FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jobs (id, "hospitalId", title, benefits, "createdAt", "updatedAt", "deletedAt", certifications, department, education, experience, "experienceDetails", "isActive", "isDraft", "isUnlimitedRecruit", "isWorkDaysNegotiable", "isWorkTimeNegotiable", major, "managerEmail", "managerName", "managerPhone", "position", preferences, "recruitEndDate", salary, "viewCount", "workDays", "workEndTime", "workStartTime", "salaryType", "workType") FROM stdin;
n26iPvINBObl9a0P	Vb3jlzzQeX-sHIaB	수의사 채용	식비지원	2025-09-29 03:15:39.392	2025-09-29 03:15:39.392	\N	{수의사}	인사팀	{학사졸업}	{신입}	{없음}	t	f	t	t	t	{내과}	test@test.com	김실장	010-1111-1111	수의사	{없음}	\N	12353555	0	{monday,tuesday,wednesday,thursday,friday}	04:00	10:00	연봉	{정규직}
\.


--
-- Data for Name: lecture_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lecture_comments (id, "lectureId", "userId", content, "createdAt", "updatedAt", "deletedAt", "parentId") FROM stdin;
comment_1759079373813_jj3ky6p6xlb	lecture_1758861568505_pu2ub1f4k8	Vb3jlzzQeX-sHIaB	안녕하세여?	2025-09-28 17:09:33.871	2025-09-28 17:09:33.871	\N	\N
comment_1759081522353_xkwhrz82x7	lecture_1758861568505_pu2ub1f4k8	Vb3jlzzQeX-sHIaB	안녕하세요?	2025-09-28 17:45:22.403	2025-09-28 17:45:22.403	\N	\N
comment_1759081850838_upa92ltoe9	lecture_1758861568505_pu2ub1f4k8	Vb3jlzzQeX-sHIaB	안녕하세요?	2025-09-28 17:50:50.886	2025-09-28 17:50:50.886	\N	\N
comment_1759082247226_6g7ufw5a54k	lecture_1758861568505_pu2ub1f4k8	Vb3jlzzQeX-sHIaB	ㅎㅇ요	2025-09-28 17:57:27.275	2025-09-28 17:57:27.275	\N	\N
comment_1759082254376_i9smmg2o3x	lecture_1758861568505_pu2ub1f4k8	Vb3jlzzQeX-sHIaB	ㅎㅇㅎㅇ	2025-09-28 17:57:34.425	2025-09-28 17:57:34.425	\N	comment_1759082247226_6g7ufw5a54k
\.


--
-- Data for Name: lecture_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lecture_likes (id, "userId", "lectureId", "createdAt") FROM stdin;
like_1759050562124_j2pieyfc3	ExS5veE4OqwHGwkl	lecture_1758861568505_pu2ub1f4k8	2025-09-28 09:09:22.125
like_1759082298102_vvubr872q	Vb3jlzzQeX-sHIaB	lecture_1758861568505_pu2ub1f4k8	2025-09-28 17:58:18.103
\.


--
-- Data for Name: lectures; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lectures (id, title, description, "videoUrl", thumbnail, duration, category, tags, "viewCount", "createdAt", "updatedAt", "deletedAt", instructor) FROM stdin;
lecture_1758861568505_pu2ub1f4k8	강의 1	강의설명 222	https://www.youtube.com/watch?v=5tLui8HA7Ag	https://img.youtube.com/vi/5tLui8HA7Ag/maxresdefault.jpg	\N	응급의학	{}	2	2025-09-26 04:39:29.081	2025-09-26 04:44:46.879	\N	정승제
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, "senderId", "receiverId", subject, content, status, "readAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: migration_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.migration_log (id, migration_name, executed_at, description) FROM stdin;
1	000_create_migration_log	2025-09-26 04:36:37.860258	Created migration_log table to track database migrations
2	001_drop_job_postings_table	2025-09-26 04:36:37.959411	Dropped deprecated job_postings table
3	002_ensure_jobs_table_structure	2025-09-26 04:36:38.04816	Ensured jobs and applications tables have correct structure
7	004_add_instructor_to_lectures	2025-09-26 04:37:17.027498	\N
8	003_normalize_users_schema	2025-09-27 18:22:18.062059	Normalized users table by separating user type specific data into dedicated tables
9	004_cleanup_users_table	2025-09-28 07:37:36.276417	Removed normalized fields from users table and cleaned up old tables
\.


--
-- Data for Name: notification_batches; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_batches (id, "announcementId", "totalRecipients", "sentCount", "failedCount", status, "startedAt", "completedAt", "createdAt") FROM stdin;
bgZzqP-XIa7vnxH_pr4JU	Mxf9cwtjEOgOMP1aypuXn	1	1	0	COMPLETED	2025-09-25 23:55:16.864	2025-09-25 23:55:17.129	2025-09-25 23:55:16.866
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_settings (id, "userId", "announcementEnabled", "inquiryEnabled", "commentEnabled", "jobEnabled", "emailNotifications", "pushNotifications", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, type, "recipientId", "recipientType", "senderId", title, content, "isRead", "readAt", "createdAt", "updatedAt") FROM stdin;
BKtj3TkcXiZr-782bmbP-	ANNOUNCEMENT	DOWHFF7Lxg2af_Ex	HOSPITAL	DOWHFF7Lxg2af_Ex	광고테스트	테스트=중압니다	t	2025-09-26 00:07:25.913	2025-09-25 23:55:17.042	2025-09-25 23:55:17.04
ABTWRo8N9ONZ10WznTBGY	ANNOUNCEMENT	DOWHFF7Lxg2af_Ex	HOSPITAL	DOWHFF7Lxg2af_Ex	광고테스트	테스트=중압니다	t	2025-09-26 00:07:33.982	2025-09-25 23:55:00.039	2025-09-25 23:55:00.034
\.


--
-- Data for Name: resume_educations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_educations (id, "resumeId", degree, "graduationStatus", "schoolName", major, gpa, "totalGpa", "startDate", "endDate", "sortOrder", "createdAt", "updatedAt") FROM stdin;
resume_education_1759055886636	resume_ExS5veE4OqwHGwkl_1759056330702	bachelor	graduated	서울대학교	수의학과	4.2	4.5	2025-09-04 00:00:00	2025-09-06 00:00:00	0	2025-09-28 11:49:38.05	2025-09-28 11:49:38.05
resume_education_1759061293965	resume_7tGca3YS19it1i42_1759061443812	bachelor	graduated	서울대	수의학과	4.2	4.5	2025-09-02 00:00:00	2025-09-06 00:00:00	0	2025-09-28 12:10:46.235	2025-09-28 12:10:46.235
\.


--
-- Data for Name: resume_evaluations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_evaluations (id, "resumeId", "userId", rating, comment, "createdAt", "updatedAt", "deletedAt") FROM stdin;
eval_1759082924088_m63ohmvyfb8	resume_ExS5veE4OqwHGwkl_1759056330702	Vb3jlzzQeX-sHIaB	4	평가: {"stressManagement":2.5,"growth":4,"care":5,"documentation":4.5,"contribution":4} | 코멘트: {"stressManagement":"굿","growth":"굿굿","care":"굿굿굿","documentation":"굿굿굿","contribution":"굿굿"}	2025-09-28 18:08:44.135	2025-09-28 18:08:44.135	\N
\.


--
-- Data for Name: resume_experiences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_experiences (id, "resumeId", "hospitalName", "mainTasks", "startDate", "endDate", "sortOrder", "createdAt", "updatedAt") FROM stdin;
resume_experience_1759055886636	resume_ExS5veE4OqwHGwkl_1759056330702	네이버동물병원	내과	2025-09-02 00:00:00	2025-09-05 00:00:00	0	2025-09-28 11:49:38.05	2025-09-28 11:49:38.05
resume_experience_1759061293965	resume_7tGca3YS19it1i42_1759061443812	김씨동물병원	인턴	2025-09-01 00:00:00	2025-09-06 00:00:00	0	2025-09-28 12:10:46.055	2025-09-28 12:10:46.055
\.


--
-- Data for Name: resume_licenses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_licenses (id, "resumeId", name, issuer, "acquiredDate", "sortOrder", "createdAt", "updatedAt") FROM stdin;
resume_license_1759055886636	resume_ExS5veE4OqwHGwkl_1759056330702	수의사	수의학회	2025-09-01 00:00:00	0	2025-09-28 11:49:38.062	2025-09-28 11:49:38.062
resume_license_1759061293965	resume_7tGca3YS19it1i42_1759061443812	수의사	대한수의학회	2025-09-01 00:00:00	0	2025-09-28 12:10:46.232	2025-09-28 12:10:46.232
\.


--
-- Data for Name: resume_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_likes (id, "userId", "resumeId", "createdAt") FROM stdin;
like_1759082302447_d055glr7e	Vb3jlzzQeX-sHIaB	resume_ExS5veE4OqwHGwkl_1759056330702	2025-09-28 17:58:22.448
like_1759082303063_7scbt8gom	Vb3jlzzQeX-sHIaB	resume_7tGca3YS19it1i42_1759061443812	2025-09-28 17:58:23.064
\.


--
-- Data for Name: resume_medical_capabilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resume_medical_capabilities (id, "resumeId", field, proficiency, description, others, "sortOrder", "createdAt", "updatedAt") FROM stdin;
resume_capability_1759055886636	resume_ExS5veE4OqwHGwkl_1759056330702	internal	intermediate	잘합니다!	기타 설명	0	2025-09-28 11:49:38.051	2025-09-28 11:49:38.051
resume_capability_1759061293965	resume_7tGca3YS19it1i42_1759061443812	orthopedics	beginner	인턴 경험있습니다	인턴	0	2025-09-28 12:10:46.229	2025-09-28 12:10:46.229
\.


--
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resumes (id, "veterinarianId", title, introduction, experience, education, certifications, skills, "preferredSalary", "preferredLocation", "availableFrom", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: social_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_accounts (id, "userId", provider, "providerId", "accessToken", "refreshToken", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: transfer_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transfer_likes (id, "userId", "transferId", "createdAt") FROM stdin;
like_1759051516182_forxn8mei	ExS5veE4OqwHGwkl	transfer_1759050929888_cdxfawvpjfi	2025-09-28 09:25:16.183
like_1759082279430_4a7znm4o0	Vb3jlzzQeX-sHIaB	transfer_1759050929888_cdxfawvpjfi	2025-09-28 17:57:59.43
\.


--
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transfers (id, "userId", title, description, location, price, category, images, status, "createdAt", "updatedAt", "deletedAt", area, base_address, detail_address, latitude, longitude, sido, sigungu, views) FROM stdin;
transfer_1759050929888_cdxfawvpjfi	ExS5veE4OqwHGwkl	양도양수 테스트	팝니다!	서울 송파구 올림픽로 300 (신천동) 101호	20000000	병원양도	{https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/transfers/af110mi2auuo3177sdisxc1o.jpg,https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/transfers/hekxypz3v0s8gmm9cp9dyj1i.jpg}	ACTIVE	2025-09-28 09:15:30.475	2025-09-28 09:15:30.475	\N	21	서울 송파구 올림픽로 300 (신천동)	101호	\N	\N	서울	송파구	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, phone, "passwordHash", "profileImage", "userType", provider, "isActive", "termsAgreedAt", "privacyAgreedAt", "marketingAgreedAt", "deletedAt", "withdrawReason", "restoredAt", "createdAt", "updatedAt", "lastLoginAt", "loginId", seq) FROM stdin;
DOWHFF7Lxg2af_Ex	test@test.com	011-1214-2424	$2b$12$GvMrcnvW7sB5T4y29hLn1OhfV8lNBMxbXb5MsX7mjtINqOtmJkwYS	\N	HOSPITAL	NORMAL	t	2025-09-26 08:37:24.528	2025-09-26 08:37:24.528	2025-09-26 08:37:24.528	\N	\N	\N	2025-09-26 08:37:24.528	2025-09-26 08:37:24.528	\N	test1	1
ExS5veE4OqwHGwkl	test@naver.com	010-1111-1111	$2b$12$eIClpYEOi0gi1fGUW2TPbuXUFJNWIk4kquOoSjpF5M0jby9ABM1kS	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/profiles/fzi8ij9f0iccge4b9ymcm1ux.png	VETERINARIAN	NORMAL	t	2025-09-28 16:39:51.555	2025-09-28 16:39:51.555	2025-09-28 16:39:51.555	\N	\N	\N	2025-09-28 16:39:51.555	2025-09-28 08:56:23.085	\N	test	3
7tGca3YS19it1i42	test@snu.ac.kr	010-1111-1112	$2b$12$rN3T8.cENK0aS7vUDOpuKurk5/LkgGurjk8pUc2Ox0Zmk8JYEioMW	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/profiles/nghkq6tdluys862jgyad67wr.png	VETERINARY_STUDENT	NORMAL	t	2025-09-28 21:07:59.807	2025-09-28 21:07:59.807	2025-09-28 21:07:59.807	\N	\N	\N	2025-09-28 21:07:59.807	2025-09-28 21:07:59.807	\N	test2	4
35rAltMdlKfKfG4m	test@hospital.com	010-3243-4235	$2b$12$HuVET6oeGcugtVxduV.Vf.4VbkSDGI6ehoa5qCCx0Nem.JEvAAgUm	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospitals/kpr2oz94w40q19l8b0yl576a.png	HOSPITAL	NORMAL	t	2025-09-29 00:17:07.759	2025-09-29 00:17:07.759	2025-09-29 00:17:07.759	\N	\N	\N	2025-09-29 00:17:07.759	2025-09-29 00:17:07.759	\N	test3	5
Vb3jlzzQeX-sHIaB	test@hospi.com	010-1244-4555	$2b$12$DAbioc49vF8EPjxEi6lR9.MnHqJdHFWpUEIkooVlwutxGpDDZmyGq	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/hospitals/yfqamk16bot3u8wsn5tobwjl.png	HOSPITAL	NORMAL	t	2025-09-29 01:10:44.159	2025-09-29 01:10:44.159	2025-09-29 01:10:44.159	\N	\N	\N	2025-09-29 01:10:44.159	2025-09-28 17:00:09.082	\N	test4	6
\.


--
-- Data for Name: veterinarian_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.veterinarian_profiles (id, "userId", nickname, "birthDate", "licenseImage", experience, specialty, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: veterinarians; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.veterinarians (id, "userId", "realName", "birthDate", nickname, "licenseImage", "createdAt", "updatedAt") FROM stdin;
omu2VhmmYjjlHpbj	ExS5veE4OqwHGwkl	김가짜	2011-11-11 09:00:00	닉네임	https://iamvet-bucket.s3.ap-northeast-2.amazonaws.com/licenses/bgpvfjlehsp9l2kzwx798mfo.jpeg	2025-09-28 16:39:51.555	2025-09-28 08:56:23.547161
\.


--
-- Data for Name: veterinary_students; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.veterinary_students (id, "userId", "realName", "birthDate", nickname, "universityEmail", "createdAt", "updatedAt") FROM stdin;
gDKl2e1oNEn9In1X	7tGca3YS19it1i42	김학생	1999-11-11 09:00:00	학생1	test@snu.ac.kr	2025-09-28 21:07:59.807	2025-09-28 21:07:59.807
\.


--
-- Data for Name: view_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.view_logs (id, content_type, content_id, user_id, user_identifier, ip_address, created_at) FROM stdin;
yoiqw9bvrqvd92poauk3k12q	lecture	lecture_1758861568505_pu2ub1f4k8	\N	::1	::1	2025-09-26 07:49:33.164
fuijcge5vj7aj6v3spppjw51	lecture	lecture_1758861568505_pu2ub1f4k8	\N	::1	::1	2025-09-28 06:54:51.365
z3x1sc339d8chx8frtbrhyok	forum	forum_1759051547530_vafu6ka3nhe	\N	guest_OjoxX01vemlsbGEv	guest_OjoxX01vemlsbGEv	2025-09-28 09:46:17.854
z8jckarukezcq8gaci6p0954	detailed_resume	resume_ExS5veE4OqwHGwkl_1759056330702	\N	guest_OjoxX2N1cmwvOC43	guest_OjoxX2N1cmwvOC43	2025-09-28 11:57:18.56
udkz8gq7j4vox1zrgql6wtc2	detailed_resume	resume_ExS5veE4OqwHGwkl_1759056330702	ExS5veE4OqwHGwkl	user_ExS5veE4OqwHGwkl	user_ExS5veE4OqwHGwkl	2025-09-28 11:58:54.057
n87x07o0plh8pufkall974uo	detailed_resume	resume_ExS5veE4OqwHGwkl_1759056330702	Vb3jlzzQeX-sHIaB	user_Vb3jlzzQeX-sHIaB	user_Vb3jlzzQeX-sHIaB	2025-09-28 18:08:12.084
\.


--
-- Name: migration_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.migration_log_id_seq', 12, true);


--
-- Name: users_seq_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_seq_seq', 6, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: advertisements advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: comment_notifications comment_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_notifications
    ADD CONSTRAINT comment_notifications_pkey PRIMARY KEY (id);


--
-- Name: comment_replies comment_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT comment_replies_pkey PRIMARY KEY (id);


--
-- Name: contact_inquiries contact_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id);


--
-- Name: detailed_resumes detailed_resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.detailed_resumes
    ADD CONSTRAINT detailed_resumes_pkey PRIMARY KEY (id);


--
-- Name: forum_comments forum_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_pkey PRIMARY KEY (id);


--
-- Name: forum_post_likes forum_post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_post_likes
    ADD CONSTRAINT forum_post_likes_pkey PRIMARY KEY (id);


--
-- Name: forum_posts forum_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT forum_posts_pkey PRIMARY KEY (id);


--
-- Name: hospital_animals hospital_animals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_animals
    ADD CONSTRAINT hospital_animals_pkey PRIMARY KEY (id);


--
-- Name: hospital_business_licenses hospital_business_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_business_licenses
    ADD CONSTRAINT hospital_business_licenses_pkey PRIMARY KEY (id);


--
-- Name: hospital_evaluations hospital_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_evaluations
    ADD CONSTRAINT hospital_evaluations_pkey PRIMARY KEY (id);


--
-- Name: hospital_images hospital_images_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_images
    ADD CONSTRAINT hospital_images_pkey PRIMARY KEY (id);


--
-- Name: hospital_specialties hospital_specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_specialties
    ADD CONSTRAINT hospital_specialties_pkey PRIMARY KEY (id);


--
-- Name: hospital_treatment_animals hospital_treatment_animals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_animals
    ADD CONSTRAINT hospital_treatment_animals_pkey PRIMARY KEY (id);


--
-- Name: hospital_treatment_specialties hospital_treatment_specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_specialties
    ADD CONSTRAINT hospital_treatment_specialties_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_businessNumber_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT "hospitals_businessNumber_key" UNIQUE ("businessNumber");


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_userId_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT "hospitals_userId_key" UNIQUE ("userId");


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: job_likes job_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_likes
    ADD CONSTRAINT job_likes_pkey PRIMARY KEY (id);


--
-- Name: job_notifications job_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_notifications
    ADD CONSTRAINT job_notifications_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: lecture_comments lecture_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_comments
    ADD CONSTRAINT lecture_comments_pkey PRIMARY KEY (id);


--
-- Name: lecture_likes lecture_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_likes
    ADD CONSTRAINT lecture_likes_pkey PRIMARY KEY (id);


--
-- Name: lectures lectures_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: migration_log migration_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.migration_log
    ADD CONSTRAINT migration_log_pkey PRIMARY KEY (id);


--
-- Name: notification_batches notification_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_batches
    ADD CONSTRAINT notification_batches_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: resume_educations resume_educations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_educations
    ADD CONSTRAINT resume_educations_pkey PRIMARY KEY (id);


--
-- Name: resume_evaluations resume_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_evaluations
    ADD CONSTRAINT resume_evaluations_pkey PRIMARY KEY (id);


--
-- Name: resume_experiences resume_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_experiences
    ADD CONSTRAINT resume_experiences_pkey PRIMARY KEY (id);


--
-- Name: resume_licenses resume_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_licenses
    ADD CONSTRAINT resume_licenses_pkey PRIMARY KEY (id);


--
-- Name: resume_likes resume_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_likes
    ADD CONSTRAINT resume_likes_pkey PRIMARY KEY (id);


--
-- Name: resume_medical_capabilities resume_medical_capabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_medical_capabilities
    ADD CONSTRAINT resume_medical_capabilities_pkey PRIMARY KEY (id);


--
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (id);


--
-- Name: social_accounts social_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT social_accounts_pkey PRIMARY KEY (id);


--
-- Name: transfer_likes transfer_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfer_likes
    ADD CONSTRAINT transfer_likes_pkey PRIMARY KEY (id);


--
-- Name: transfers transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_pkey PRIMARY KEY (id);


--
-- Name: hospital_treatment_animals uk_hospital_animal; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_animals
    ADD CONSTRAINT uk_hospital_animal UNIQUE ("hospitalId", "animalType");


--
-- Name: hospital_images uk_hospital_image_order; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_images
    ADD CONSTRAINT uk_hospital_image_order UNIQUE ("hospitalId", "imageOrder");


--
-- Name: hospital_treatment_specialties uk_hospital_specialty; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_specialties
    ADD CONSTRAINT uk_hospital_specialty UNIQUE ("hospitalId", specialty);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: veterinarian_profiles veterinarian_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinarian_profiles
    ADD CONSTRAINT veterinarian_profiles_pkey PRIMARY KEY (id);


--
-- Name: veterinarians veterinarians_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinarians
    ADD CONSTRAINT veterinarians_pkey PRIMARY KEY (id);


--
-- Name: veterinarians veterinarians_userId_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinarians
    ADD CONSTRAINT "veterinarians_userId_key" UNIQUE ("userId");


--
-- Name: veterinary_students veterinary_students_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinary_students
    ADD CONSTRAINT veterinary_students_pkey PRIMARY KEY (id);


--
-- Name: veterinary_students veterinary_students_universityEmail_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinary_students
    ADD CONSTRAINT "veterinary_students_universityEmail_key" UNIQUE ("universityEmail");


--
-- Name: veterinary_students veterinary_students_userId_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinary_students
    ADD CONSTRAINT "veterinary_students_userId_key" UNIQUE ("userId");


--
-- Name: view_logs view_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.view_logs
    ADD CONSTRAINT view_logs_pkey PRIMARY KEY (id);


--
-- Name: admin_users_email_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX admin_users_email_idx ON public.admin_users USING btree (email);


--
-- Name: admin_users_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX admin_users_email_key ON public.admin_users USING btree (email);


--
-- Name: admin_users_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "admin_users_isActive_idx" ON public.admin_users USING btree ("isActive");


--
-- Name: advertisements_createdBy_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "advertisements_createdBy_idx" ON public.advertisements USING btree ("createdBy");


--
-- Name: advertisements_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "advertisements_isActive_idx" ON public.advertisements USING btree ("isActive");


--
-- Name: advertisements_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "advertisements_startDate_endDate_idx" ON public.advertisements USING btree ("startDate", "endDate");


--
-- Name: advertisements_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX advertisements_type_idx ON public.advertisements USING btree (type);


--
-- Name: announcements_notificationId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "announcements_notificationId_key" ON public.announcements USING btree ("notificationId");


--
-- Name: applications_jobId_veterinarianId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "applications_jobId_veterinarianId_key" ON public.applications USING btree ("jobId", "veterinarianId");


--
-- Name: comment_notifications_notificationId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "comment_notifications_notificationId_key" ON public.comment_notifications USING btree ("notificationId");


--
-- Name: comment_notifications_postType_postId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "comment_notifications_postType_postId_idx" ON public.comment_notifications USING btree ("postType", "postId");


--
-- Name: contact_inquiries_created_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_created_at_idx ON public.contact_inquiries USING btree (created_at);


--
-- Name: contact_inquiries_is_read_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_is_read_idx ON public.contact_inquiries USING btree (is_read);


--
-- Name: contact_inquiries_job_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_job_id_idx ON public.contact_inquiries USING btree (job_id);


--
-- Name: contact_inquiries_recipient_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_recipient_id_idx ON public.contact_inquiries USING btree (recipient_id);


--
-- Name: contact_inquiries_resume_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_resume_id_idx ON public.contact_inquiries USING btree (resume_id);


--
-- Name: contact_inquiries_sender_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX contact_inquiries_sender_id_idx ON public.contact_inquiries USING btree (sender_id);


--
-- Name: detailed_resumes_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "detailed_resumes_userId_key" ON public.detailed_resumes USING btree ("userId");


--
-- Name: forum_post_likes_forumPostId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "forum_post_likes_forumPostId_idx" ON public.forum_post_likes USING btree ("forumPostId");


--
-- Name: forum_post_likes_userId_forumPostId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "forum_post_likes_userId_forumPostId_key" ON public.forum_post_likes USING btree ("userId", "forumPostId");


--
-- Name: forum_post_likes_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "forum_post_likes_userId_idx" ON public.forum_post_likes USING btree ("userId");


--
-- Name: hospital_animals_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "hospital_animals_userId_idx" ON public.hospital_animals USING btree ("userId");


--
-- Name: hospital_business_licenses_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "hospital_business_licenses_userId_idx" ON public.hospital_business_licenses USING btree ("userId");


--
-- Name: hospital_evaluations_hospitalId_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "hospital_evaluations_hospitalId_userId_key" ON public.hospital_evaluations USING btree ("hospitalId", "userId");


--
-- Name: hospital_specialties_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "hospital_specialties_userId_idx" ON public.hospital_specialties USING btree ("userId");


--
-- Name: idx_applications_job_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_applications_job_id ON public.applications USING btree ("jobId");


--
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_applications_status ON public.applications USING btree (status);


--
-- Name: idx_applications_veterinarian_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_applications_veterinarian_id ON public.applications USING btree ("veterinarianId");


--
-- Name: idx_forum_comments_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_forum_comments_created_at ON public.forum_comments USING btree ("createdAt");


--
-- Name: idx_forum_comments_forum_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_forum_comments_forum_id ON public.forum_comments USING btree (forum_id);


--
-- Name: idx_forum_comments_parent_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_forum_comments_parent_id ON public.forum_comments USING btree (parent_id);


--
-- Name: idx_forum_comments_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_forum_comments_user_id ON public.forum_comments USING btree (user_id);


--
-- Name: idx_hospital_images_hospital; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospital_images_hospital ON public.hospital_images USING btree ("hospitalId");


--
-- Name: idx_hospital_images_order; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospital_images_order ON public.hospital_images USING btree ("hospitalId", "imageOrder");


--
-- Name: idx_hospital_treatment_animals_hospital; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospital_treatment_animals_hospital ON public.hospital_treatment_animals USING btree ("hospitalId");


--
-- Name: idx_hospital_treatment_specialties_hospital; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospital_treatment_specialties_hospital ON public.hospital_treatment_specialties USING btree ("hospitalId");


--
-- Name: idx_hospitals_business_number; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospitals_business_number ON public.hospitals USING btree ("businessNumber");


--
-- Name: idx_hospitals_location; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospitals_location ON public.hospitals USING btree (latitude, longitude);


--
-- Name: idx_hospitals_userid; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_hospitals_userid ON public.hospitals USING btree ("userId");


--
-- Name: idx_jobs_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_jobs_created_at ON public.jobs USING btree ("createdAt");


--
-- Name: idx_jobs_deleted_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_jobs_deleted_at ON public.jobs USING btree ("deletedAt");


--
-- Name: idx_jobs_hospital_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_jobs_hospital_id ON public.jobs USING btree ("hospitalId");


--
-- Name: idx_jobs_is_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_jobs_is_active ON public.jobs USING btree ("isActive");


--
-- Name: idx_jobs_is_draft; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_jobs_is_draft ON public.jobs USING btree ("isDraft");


--
-- Name: idx_lecture_comments_lecture_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_lecture_comments_lecture_id ON public.lecture_comments USING btree ("lectureId");


--
-- Name: idx_lecture_comments_parent_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_lecture_comments_parent_id ON public.lecture_comments USING btree ("parentId");


--
-- Name: idx_users_loginid; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_loginid ON public.users USING btree ("loginId");


--
-- Name: idx_veterinarians_nickname; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_veterinarians_nickname ON public.veterinarians USING btree (nickname);


--
-- Name: idx_veterinarians_userid; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_veterinarians_userid ON public.veterinarians USING btree ("userId");


--
-- Name: idx_veterinary_students_nickname; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_veterinary_students_nickname ON public.veterinary_students USING btree (nickname);


--
-- Name: idx_veterinary_students_university_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_veterinary_students_university_email ON public.veterinary_students USING btree ("universityEmail");


--
-- Name: idx_veterinary_students_userid; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_veterinary_students_userid ON public.veterinary_students USING btree ("userId");


--
-- Name: inquiries_notificationId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "inquiries_notificationId_key" ON public.inquiries USING btree ("notificationId");


--
-- Name: job_likes_jobId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "job_likes_jobId_idx" ON public.job_likes USING btree ("jobId");


--
-- Name: job_likes_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "job_likes_userId_idx" ON public.job_likes USING btree ("userId");


--
-- Name: job_likes_userId_jobId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "job_likes_userId_jobId_key" ON public.job_likes USING btree ("userId", "jobId");


--
-- Name: job_notifications_jobId_applicationId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "job_notifications_jobId_applicationId_idx" ON public.job_notifications USING btree ("jobId", "applicationId");


--
-- Name: job_notifications_notificationId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "job_notifications_notificationId_key" ON public.job_notifications USING btree ("notificationId");


--
-- Name: jobs_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "jobs_createdAt_idx" ON public.jobs USING btree ("createdAt");


--
-- Name: jobs_hospitalId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "jobs_hospitalId_idx" ON public.jobs USING btree ("hospitalId");


--
-- Name: jobs_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "jobs_isActive_idx" ON public.jobs USING btree ("isActive");


--
-- Name: jobs_isDraft_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "jobs_isDraft_idx" ON public.jobs USING btree ("isDraft");


--
-- Name: lecture_likes_lectureId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "lecture_likes_lectureId_idx" ON public.lecture_likes USING btree ("lectureId");


--
-- Name: lecture_likes_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "lecture_likes_userId_idx" ON public.lecture_likes USING btree ("userId");


--
-- Name: lecture_likes_userId_lectureId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "lecture_likes_userId_lectureId_key" ON public.lecture_likes USING btree ("userId", "lectureId");


--
-- Name: migration_log_migration_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX migration_log_migration_name_key ON public.migration_log USING btree (migration_name);


--
-- Name: notification_settings_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "notification_settings_userId_key" ON public.notification_settings USING btree ("userId");


--
-- Name: notifications_recipientId_isRead_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "notifications_recipientId_isRead_createdAt_idx" ON public.notifications USING btree ("recipientId", "isRead", "createdAt" DESC);


--
-- Name: notifications_type_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "notifications_type_createdAt_idx" ON public.notifications USING btree (type, "createdAt" DESC);


--
-- Name: resume_evaluations_resumeId_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "resume_evaluations_resumeId_userId_key" ON public.resume_evaluations USING btree ("resumeId", "userId");


--
-- Name: resume_likes_resumeId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "resume_likes_resumeId_idx" ON public.resume_likes USING btree ("resumeId");


--
-- Name: resume_likes_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "resume_likes_userId_idx" ON public.resume_likes USING btree ("userId");


--
-- Name: resume_likes_userId_resumeId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "resume_likes_userId_resumeId_key" ON public.resume_likes USING btree ("userId", "resumeId");


--
-- Name: social_accounts_provider_providerId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "social_accounts_provider_providerId_key" ON public.social_accounts USING btree (provider, "providerId");


--
-- Name: transfer_likes_transferId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "transfer_likes_transferId_idx" ON public.transfer_likes USING btree ("transferId");


--
-- Name: transfer_likes_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "transfer_likes_userId_idx" ON public.transfer_likes USING btree ("userId");


--
-- Name: transfer_likes_userId_transferId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "transfer_likes_userId_transferId_key" ON public.transfer_likes USING btree ("userId", "transferId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_loginId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "users_loginId_key" ON public.users USING btree ("loginId");


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: users_seq_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_seq_key ON public.users USING btree (seq);


--
-- Name: veterinarian_profiles_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "veterinarian_profiles_userId_key" ON public.veterinarian_profiles USING btree ("userId");


--
-- Name: view_logs_content_type_content_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX view_logs_content_type_content_id_idx ON public.view_logs USING btree (content_type, content_id);


--
-- Name: view_logs_created_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX view_logs_created_at_idx ON public.view_logs USING btree (created_at);


--
-- Name: view_logs_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX view_logs_user_id_idx ON public.view_logs USING btree (user_id);


--
-- Name: view_logs_user_identifier_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX view_logs_user_identifier_idx ON public.view_logs USING btree (user_identifier);


--
-- Name: advertisements advertisements_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT "advertisements_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.admin_users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: applications applications_veterinarianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comment_notifications comment_notifications_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_notifications
    ADD CONSTRAINT "comment_notifications_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment_replies comment_replies_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT "comment_replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public.lecture_comments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comment_replies comment_replies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT "comment_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contact_inquiries contact_inquiries_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contact_inquiries contact_inquiries_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contact_inquiries contact_inquiries_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contact_inquiries contact_inquiries_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_inquiries
    ADD CONSTRAINT contact_inquiries_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: detailed_resumes detailed_resumes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.detailed_resumes
    ADD CONSTRAINT "detailed_resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hospital_treatment_animals fk_hospital_animals_hospital; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_animals
    ADD CONSTRAINT fk_hospital_animals_hospital FOREIGN KEY ("hospitalId") REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_treatment_animals fk_hospital_animals_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_animals
    ADD CONSTRAINT fk_hospital_animals_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospital_images fk_hospital_images_hospital; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_images
    ADD CONSTRAINT fk_hospital_images_hospital FOREIGN KEY ("hospitalId") REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_images fk_hospital_images_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_images
    ADD CONSTRAINT fk_hospital_images_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospital_treatment_specialties fk_hospital_specialties_hospital; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_specialties
    ADD CONSTRAINT fk_hospital_specialties_hospital FOREIGN KEY ("hospitalId") REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: hospital_treatment_specialties fk_hospital_specialties_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_treatment_specialties
    ADD CONSTRAINT fk_hospital_specialties_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: hospitals fk_hospitals_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT fk_hospitals_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lecture_comments fk_lecture_comment_parent; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_comments
    ADD CONSTRAINT fk_lecture_comment_parent FOREIGN KEY ("parentId") REFERENCES public.lecture_comments(id) ON DELETE CASCADE;


--
-- Name: veterinarians fk_veterinarians_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinarians
    ADD CONSTRAINT fk_veterinarians_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: veterinary_students fk_veterinary_students_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinary_students
    ADD CONSTRAINT fk_veterinary_students_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: forum_comments forum_comments_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;


--
-- Name: forum_comments forum_comments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.forum_comments(id) ON DELETE CASCADE;


--
-- Name: forum_comments forum_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_comments
    ADD CONSTRAINT forum_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: forum_post_likes forum_post_likes_forumPostId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_post_likes
    ADD CONSTRAINT "forum_post_likes_forumPostId_fkey" FOREIGN KEY ("forumPostId") REFERENCES public.forum_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_post_likes forum_post_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_post_likes
    ADD CONSTRAINT "forum_post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: forum_posts forum_posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "forum_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hospital_animals hospital_animals_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_animals
    ADD CONSTRAINT "hospital_animals_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hospital_business_licenses hospital_business_licenses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_business_licenses
    ADD CONSTRAINT "hospital_business_licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hospital_evaluations hospital_evaluations_hospitalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_evaluations
    ADD CONSTRAINT "hospital_evaluations_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hospital_evaluations hospital_evaluations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_evaluations
    ADD CONSTRAINT "hospital_evaluations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hospital_specialties hospital_specialties_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospital_specialties
    ADD CONSTRAINT "hospital_specialties_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inquiries inquiries_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT "inquiries_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_likes job_likes_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_likes
    ADD CONSTRAINT "job_likes_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_likes job_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_likes
    ADD CONSTRAINT "job_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_notifications job_notifications_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_notifications
    ADD CONSTRAINT "job_notifications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_notifications job_notifications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_notifications
    ADD CONSTRAINT "job_notifications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_notifications job_notifications_notificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_notifications
    ADD CONSTRAINT "job_notifications_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_hospitalid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_hospitalid_fkey FOREIGN KEY ("hospitalId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lecture_comments lecture_comments_lectureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_comments
    ADD CONSTRAINT "lecture_comments_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES public.lectures(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lecture_comments lecture_comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_comments
    ADD CONSTRAINT "lecture_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lecture_likes lecture_likes_lectureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_likes
    ADD CONSTRAINT "lecture_likes_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES public.lectures(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lecture_likes lecture_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lecture_likes
    ADD CONSTRAINT "lecture_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notification_batches notification_batches_announcementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_batches
    ADD CONSTRAINT "notification_batches_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notification_settings notification_settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT "notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: resume_educations resume_educations_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_educations
    ADD CONSTRAINT "resume_educations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_evaluations resume_evaluations_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_evaluations
    ADD CONSTRAINT "resume_evaluations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON DELETE CASCADE;


--
-- Name: resume_evaluations resume_evaluations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_evaluations
    ADD CONSTRAINT "resume_evaluations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: resume_experiences resume_experiences_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_experiences
    ADD CONSTRAINT "resume_experiences_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_licenses resume_licenses_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_licenses
    ADD CONSTRAINT "resume_licenses_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_likes resume_likes_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_likes
    ADD CONSTRAINT "resume_likes_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_likes resume_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_likes
    ADD CONSTRAINT "resume_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resume_medical_capabilities resume_medical_capabilities_resumeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resume_medical_capabilities
    ADD CONSTRAINT "resume_medical_capabilities_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES public.detailed_resumes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resumes resumes_veterinarianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT "resumes_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: social_accounts social_accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT "social_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transfer_likes transfer_likes_transferId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfer_likes
    ADD CONSTRAINT "transfer_likes_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES public.transfers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transfer_likes transfer_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfer_likes
    ADD CONSTRAINT "transfer_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transfers transfers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "transfers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: veterinarian_profiles veterinarian_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.veterinarian_profiles
    ADD CONSTRAINT "veterinarian_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict geKclzPfgtX2tKPtc8kgcEi2f1KKMIuvBTyfp6hhBX388G8ioMQnTNMMa4S0boN

