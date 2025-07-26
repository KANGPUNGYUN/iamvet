// src/lib/swagger.ts
// Swagger 설정을 위한 유틸리티 함수들

import type {
  BaseResponse,
  ApiResponse,
  ErrorResponse,
  LoginRequest,
  VeterinarianLoginRequest,
  HospitalLoginRequest,
  LoginResponse,
  VeterinarianRegisterRequest,
  HospitalRegisterRequest,
  JobPostingCreateRequest,
  JobDetail,
  JobsQueryParams,
  ResumesQueryParams,
  LecturesQueryParams,
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentResponse,
  CommentsListResponse,
  PasswordChangeRequest,
} from "./types";

// OpenAPI 스키마 생성 헬퍼
export const createOpenApiSchema = <T>(example: T) => {
  const schema: any = {};

  if (typeof example === "object" && example !== null) {
    schema.type = "object";
    schema.properties = {};

    Object.entries(example).forEach(([key, value]) => {
      if (typeof value === "string") {
        schema.properties[key] = { type: "string" };
      } else if (typeof value === "number") {
        schema.properties[key] = { type: "number" };
      } else if (typeof value === "boolean") {
        schema.properties[key] = { type: "boolean" };
      } else if (Array.isArray(value)) {
        schema.properties[key] = {
          type: "array",
          items: { type: "string" },
        };
      } else if (typeof value === "object") {
        schema.properties[key] = createOpenApiSchema(value);
      }
    });
  }

  return schema;
};

// API 경로별 스키마 맵핑
export const API_SCHEMAS = {
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
  VeterinarianRegisterRequest: {
    type: "object",
    required: [
      "username",
      "nickname",
      "phone",
      "email",
      "licenseImage",
      "agreements",
    ],
    properties: {
      username: { type: "string" },
      password: { type: "string", minLength: 6 },
      nickname: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      birthDate: { type: "string", format: "date" },
      profileImage: { type: "string", format: "binary" },
      licenseImage: { type: "string", format: "binary" },
      agreements: {
        type: "object",
        properties: {
          terms: { type: "boolean" },
          privacy: { type: "boolean" },
          marketing: { type: "boolean" },
        },
      },
    },
  },
  HospitalRegisterRequest: {
    type: "object",
    required: [
      "username",
      "password",
      "hospitalName",
      "businessNumber",
      "phone",
      "email",
      "address",
    ],
    properties: {
      username: { type: "string" },
      password: { type: "string", minLength: 6 },
      hospitalName: { type: "string" },
      businessNumber: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      address: { type: "string" },
      detailAddress: { type: "string" },
      website: { type: "string", format: "uri" },
      treatableAnimals: {
        type: "array",
        items: { type: "string" },
      },
      medicalFields: {
        type: "array",
        items: { type: "string" },
      },
      logoImage: { type: "string", format: "binary" },
      facilityImages: {
        type: "array",
        items: { type: "string", format: "binary" },
      },
      businessRegistration: { type: "string", format: "binary" },
      foundedDate: { type: "string", format: "date" },
      agreements: {
        type: "object",
        properties: {
          terms: { type: "boolean" },
          privacy: { type: "boolean" },
          marketing: { type: "boolean" },
        },
      },
    },
  },
  JobPostingCreateRequest: {
    type: "object",
    required: ["title", "description", "workType", "position"],
    properties: {
      title: { type: "string", maxLength: 200 },
      description: { type: "string" },
      workType: { type: "string" },
      position: { type: "string" },
      salary: { type: "string" },
      deadline: { type: "string", format: "date" },
      isDeadlineUnlimited: { type: "boolean" },
      recruitCount: { type: "integer", minimum: 1 },
      isDraft: { type: "boolean" },
      isPublic: { type: "boolean" },
    },
  },
  JobsQueryParams: {
    type: "object",
    properties: {
      keyword: { type: "string" },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sort: {
        type: "string",
        enum: ["latest", "oldest", "deadline"],
        default: "latest",
      },
      workType: { type: "string" },
      experience: { type: "string" },
      region: { type: "string" },
    },
  },
  ResumesQueryParams: {
    type: "object",
    properties: {
      keyword: { type: "string" },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sort: {
        type: "string",
        enum: ["latest", "oldest"],
        default: "latest",
      },
      workType: { type: "string" },
      experience: { type: "string" },
      region: { type: "string" },
      license: { type: "string" },
    },
  },
  LecturesQueryParams: {
    type: "object",
    properties: {
      keyword: { type: "string" },
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sort: {
        type: "string",
        enum: ["latest", "oldest"],
        default: "latest",
      },
      medicalField: { type: "string" },
      animal: { type: "string" },
      difficulty: { type: "string" },
    },
  },
  CommentCreateRequest: {
    type: "object",
    required: ["content"],
    properties: {
      content: { type: "string", maxLength: 1000 },
      parentCommentId: { type: "string" },
    },
  },
  CommentUpdateRequest: {
    type: "object",
    required: ["content"],
    properties: {
      content: { type: "string", maxLength: 1000 },
    },
  },
  CommentResponse: {
    type: "object",
    properties: {
      commentId: { type: "string" },
      lectureId: { type: "string" },
      userId: { type: "string" },
      content: { type: "string" },
      parentCommentId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      author: {
        type: "object",
        properties: {
          username: { type: "string" },
          nickname: { type: "string" },
          profileImage: { type: "string" },
        },
      },
      repliesCount: { type: "integer" },
      likesCount: { type: "integer" },
    },
  },
  CommentsListResponse: {
    type: "object",
    properties: {
      comments: {
        type: "array",
        items: { $ref: "#/components/schemas/CommentResponse" },
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
        },
      },
    },
  },
  PasswordChangeRequest: {
    type: "object",
    required: ["newPassword"],
    properties: {
      currentPassword: { type: "string" },
      newPassword: { type: "string", minLength: 6 },
    },
  },
  ApiResponse: {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: {},
    },
  },
  ErrorResponse: {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", enum: [false] },
      message: { type: "string" },
      error: { type: "string" },
      errorCode: { type: "string" },
    },
  },
} as const;

// 공통 응답 스키마
export const COMMON_RESPONSES = {
  200: {
    description: "성공",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ApiResponse" },
      },
    },
  },
  400: {
    description: "잘못된 요청",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
  401: {
    description: "인증 실패",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
  404: {
    description: "리소스를 찾을 수 없습니다",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
  409: {
    description: "중복된 리소스",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
  500: {
    description: "서버 오류",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

// OpenAPI 태그 정의
export const API_TAGS = [
  {
    name: "Authentication",
    description: "인증 관련 API",
  },
  {
    name: "Users",
    description: "사용자 관리 API",
  },
  {
    name: "Jobs",
    description: "채용공고 관리 API",
  },
  {
    name: "Resumes",
    description: "인재정보 관리 API",
  },
  {
    name: "Lectures",
    description: "강의영상 관리 API",
  },
  {
    name: "Dashboard",
    description: "대시보드 API",
  },
  {
    name: "Upload",
    description: "파일 업로드 API",
  },
  {
    name: "Comments",
    description: "댓글 관리 API",
  },
];

// API 문서 생성을 위한 데코레이터 (실험적)
export const ApiDoc = (config: {
  summary: string;
  description?: string;
  tags?: string[];
  requestBody?: any;
  responses?: any;
}) => {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor
  ) {
    // 메타데이터 저장 (실제 구현은 필요에 따라)
    // Note: reflect-metadata 패키지가 필요한 경우에만 사용
    console.log(
      `API documentation for ${target.constructor.name}.${propertyKey}:`,
      config
    );
  };
};

// OpenAPI 문서 생성 헬퍼
export const generateOpenApiSpec = () => {
  return {
    openapi: "3.0.0",
    info: {
      title: "I AM VET API",
      version: "1.0.0",
      description: "수의사 및 동물병원을 위한 채용 플랫폼 API",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "API 서버",
      },
    ],
    tags: API_TAGS,
    components: {
      schemas: API_SCHEMAS,
      responses: COMMON_RESPONSES,
    },
  };
};
