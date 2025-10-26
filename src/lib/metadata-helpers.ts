import { Metadata } from "next";

/**
 * 동적 페이지의 메타데이터 생성을 위한 헬퍼 함수
 */

// 채용공고 상세 페이지 메타데이터
export function generateJobMetadata(job: {
  title: string;
  hospitalName: string;
  location: string;
  description?: string;
}): Metadata {
  const title = `${job.title} - ${job.hospitalName}`;
  const description =
    job.description ||
    `${job.hospitalName}에서 ${job.title} 직무를 담당할 인재를 찾습니다. 위치: ${job.location}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.iam-vet.com/jobs/${job.hospitalName
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          alt: title,
        },
      ],
    },
  };
}

// 이력서 상세 페이지 메타데이터
export function generateResumeMetadata(resume: {
  title: string;
  name: string;
  experience: string;
  specialties?: string[];
}): Metadata {
  const title = `${resume.title} - ${resume.name}`;
  const specialtiesText = resume.specialties?.length
    ? ` 전문분야: ${resume.specialties.join(", ")}`
    : "";
  const description = `경력 ${resume.experience}의 ${resume.name}님 이력서.${specialtiesText}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.iam-vet.com/resumes/${resume.name
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          alt: title,
        },
      ],
    },
  };
}

// 포럼 게시글 메타데이터
export function generateForumMetadata(post: {
  title: string;
  author: string;
  category: string;
  excerpt?: string;
}): Metadata {
  const title = `${post.title} - ${post.category}`;
  const description =
    post.excerpt ||
    `${post.author}님이 작성한 ${post.category} 카테고리의 포럼 게시글입니다.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.iam-vet.com/forums/${post.category
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          alt: title,
        },
      ],
    },
  };
}

// 양도양수 상세 페이지 메타데이터
export function generateTransferMetadata(transfer: {
  title: string;
  type: string;
  location: string;
  price?: string;
}): Metadata {
  const title = `${transfer.title} - ${transfer.type}`;
  const priceText = transfer.price ? ` 가격: ${transfer.price}` : "";
  const description = `${transfer.location}의 ${transfer.type} 양도 정보입니다.${priceText}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.iam-vet.com/transfers/${transfer.type
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          alt: title,
        },
      ],
    },
  };
}

// 강의 상세 페이지 메타데이터
export function generateLectureMetadata(lecture: {
  title: string;
  instructor: string;
  duration: string;
  description?: string;
}): Metadata {
  const title = `${lecture.title} - ${lecture.instructor} 강사`;
  const description =
    lecture.description ||
    `${lecture.instructor} 강사의 ${lecture.title} 강의 (${lecture.duration})`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.iam-vet.com/lectures/${lecture.title
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: "video.other",
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "https://www.iam-vet.com/opengraph.png",
          alt: title,
        },
      ],
    },
  };
}
