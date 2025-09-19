// src/app/api/docs/openapi.json/route.ts
// OpenAPI JSON 스펙을 제공하는 API route

import { NextRequest, NextResponse } from "next/server";
import { API_SCHEMAS, COMMON_RESPONSES } from "@/lib/swagger";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "I AM VET - 수의사 채용 플랫폼 API",
    description: `
수의사와 병원을 위한 채용 플랫폼 API 문서

## 주요 기능
- 수의사/병원 회원가입 및 로그인
- 채용공고 등록, 조회 및 지원
- 인재정보 관리 및 검색
- 강의영상 시청 및 관리
- 대시보드를 통한 통합 관리
- 파일 업로드 및 관리

## 인증 방식
Bearer JWT Token을 Authorization 헤더에 포함하여 전송

## 기본 응답 형식
\`\`\`json
{
  "status": "success|error",
  "message": "응답 메시지",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`
    `,
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@iamvet.co.kr",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      description: "API Server",
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [
    { name: "Authentication", description: "인증 관련 API" },
    { name: "Jobs", description: "채용공고 관련 API" },
    { name: "Resumes", description: "인재정보 관련 API" },
    { name: "Lectures", description: "강의영상 관련 API" },
    { name: "Comments", description: "댓글 관련 API" },
    { name: "Dashboard", description: "대시보드 관련 API" },
    { name: "Upload", description: "파일 업로드 API" },
    { name: "Hospitals", description: "병원 관련 API" },
    { name: "Forums", description: "포럼 관련 API" },
    { name: "Transfers", description: "양도양수 관련 API" },
    { name: "Bookmarks", description: "북마크 관련 API" },
    { name: "Evaluations", description: "평가 관련 API" },
    { name: "Home", description: "홈페이지 API" },
  ],
  paths: {
    // Authentication endpoints
    "/login/veterinarian": {
      post: {
        tags: ["Authentication"],
        summary: "수의사 로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: {
                    type: "string",
                    format: "email",
                    example: "vet@example.com",
                  },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "로그인 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "로그인에 성공했습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        tokens: { $ref: "#/components/schemas/AuthTokens" },
                        isNewUser: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/login/hospital": {
      post: {
        tags: ["Authentication"],
        summary: "병원 로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string", example: "hospital123" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "로그인 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "로그인에 성공했습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        tokens: { $ref: "#/components/schemas/AuthTokens" },
                        isNewUser: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/register/veterinarian": {
      post: {
        tags: ["Authentication"],
        summary: "수의사 회원가입",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
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
                    type: "string",
                    description: "JSON string of agreements",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "회원가입 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "회원가입이 완료되었습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        tokens: { $ref: "#/components/schemas/AuthTokens" },
                        isNewUser: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/register/hospital": {
      post: {
        tags: ["Authentication"],
        summary: "병원 회원가입",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
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
                    type: "string",
                    description: "JSON array of treatable animals",
                  },
                  medicalFields: {
                    type: "string",
                    description: "JSON array of medical fields",
                  },
                  logoImage: { type: "string", format: "binary" },
                  facilityImages: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                  businessRegistration: { type: "string", format: "binary" },
                  foundedDate: { type: "string", format: "date" },
                  agreements: {
                    type: "string",
                    description: "JSON string of agreements",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "병원 등록 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "병원 등록이 완료되었습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        tokens: { $ref: "#/components/schemas/AuthTokens" },
                        isNewUser: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Jobs endpoints
    "/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "채용공고 목록 조회",
        parameters: [
          {
            name: "keyword",
            in: "query",
            schema: { type: "string" },
            description: "검색 키워드",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest", "deadline"],
              default: "latest",
            },
            description: "정렬 기준",
          },
          {
            name: "workType",
            in: "query",
            schema: { type: "string" },
            description: "근무 형태",
          },
          {
            name: "experience",
            in: "query",
            schema: { type: "string" },
            description: "경력 조건",
          },
          {
            name: "region",
            in: "query",
            schema: { type: "string" },
            description: "지역",
          },
        ],
        responses: {
          "200": {
            description: "채용공고 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "채용공고 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        jobs: {
                          type: "array",
                          items: { $ref: "#/components/schemas/JobListItem" },
                        },
                        totalCount: { type: "integer" },
                        advertisements: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Advertisement" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/jobs/{id}": {
      get: {
        tags: ["Jobs"],
        summary: "채용공고 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "채용공고 ID",
          },
        ],
        responses: {
          "200": {
            description: "채용공고 상세 정보",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "채용공고 상세 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        job: { $ref: "#/components/schemas/JobDetail" },
                        relatedJobs: {
                          type: "array",
                          items: { $ref: "#/components/schemas/JobListItem" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/jobs/{id}/apply": {
      post: {
        tags: ["Jobs"],
        summary: "채용공고 지원",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "채용공고 ID",
          },
        ],
        responses: {
          "200": {
            description: "지원 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "지원이 완료되었습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        applicationId: { type: "string" },
                        status: { type: "string", example: "pending" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Resumes endpoints
    "/resumes": {
      get: {
        tags: ["Resumes"],
        summary: "인재정보 목록 조회",
        parameters: [
          {
            name: "keyword",
            in: "query",
            schema: { type: "string" },
            description: "검색 키워드",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest"],
              default: "latest",
            },
            description: "정렬 기준",
          },
          {
            name: "workType",
            in: "query",
            schema: { type: "string" },
            description: "희망 근무 형태",
          },
          {
            name: "experience",
            in: "query",
            schema: { type: "string" },
            description: "경력",
          },
          {
            name: "region",
            in: "query",
            schema: { type: "string" },
            description: "희망 지역",
          },
          {
            name: "license",
            in: "query",
            schema: { type: "string" },
            description: "보유 자격증",
          },
        ],
        responses: {
          "200": {
            description: "인재정보 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "인재정보 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        resumes: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/ResumeListItem",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/resumes/{id}": {
      get: {
        tags: ["Resumes"],
        summary: "인재정보 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
        ],
        responses: {
          "200": {
            description: "인재정보 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "인재정보 상세 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        resume: { $ref: "#/components/schemas/ResumeDetail" },
                        relatedTalents: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/ResumeListItem",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/resumes/{id}/bookmark": {
      post: {
        tags: ["Resumes"],
        summary: "인재정보 북마크 추가",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 추가 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 추가되었습니다",
                    },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Resumes"],
        summary: "인재정보 북마크 제거",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 제거 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 제거되었습니다",
                    },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Lectures endpoints
    "/lectures": {
      get: {
        tags: ["Lectures"],
        summary: "강의영상 목록 조회",
        parameters: [
          {
            name: "keyword",
            in: "query",
            schema: { type: "string" },
            description: "검색 키워드",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest"],
              default: "latest",
            },
            description: "정렬 기준",
          },
          {
            name: "medicalField",
            in: "query",
            schema: { type: "string" },
            description: "진료 분야",
          },
          {
            name: "animal",
            in: "query",
            schema: { type: "string" },
            description: "동물 종류",
          },
          {
            name: "difficulty",
            in: "query",
            schema: { type: "string" },
            description: "난이도",
          },
        ],
        responses: {
          "200": {
            description: "강의영상 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "강의영상 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        lectures: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/LectureListItem",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/lectures/{id}": {
      get: {
        tags: ["Lectures"],
        summary: "강의영상 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
        ],
        responses: {
          "200": {
            description: "강의영상 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "강의영상 상세 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        lecture: { $ref: "#/components/schemas/LectureDetail" },
                        recommendedLectures: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/LectureListItem",
                          },
                        },
                        comments: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Comment" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Comments endpoints
    "/lectures/{id}/comments": {
      get: {
        tags: ["Comments"],
        summary: "강의 댓글 목록 조회",
        description:
          "특정 강의의 댓글 목록을 페이지네이션과 정렬 옵션으로 조회합니다.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
            description: "페이지당 항목 수",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest", "likes"],
              default: "latest",
            },
            description: "정렬 기준 (최신순, 오래된순, 좋아요순)",
          },
        ],
        responses: {
          "200": {
            description: "댓글 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "댓글 목록 조회 성공",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentsListResponse",
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "강의 댓글 작성",
        description: "특정 강의에 새로운 댓글을 작성합니다. 인증이 필요합니다.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommentCreateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "댓글 작성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "댓글이 작성되었습니다",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentResponse",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/lectures/{id}/comments/{commentId}": {
      get: {
        tags: ["Comments"],
        summary: "특정 댓글 조회",
        description: "특정 댓글의 상세 정보를 조회합니다.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "댓글 ID",
          },
        ],
        responses: {
          "200": {
            description: "댓글 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "댓글 조회 성공",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentResponse",
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Comments"],
        summary: "댓글 수정",
        description:
          "본인이 작성한 댓글의 내용을 수정합니다. 작성자만 수정 가능합니다.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "댓글 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommentUpdateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "댓글 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "댓글이 수정되었습니다",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentResponse",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "댓글 삭제",
        description:
          "본인이 작성한 댓글을 삭제합니다. 작성자만 삭제 가능합니다.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "댓글 ID",
          },
        ],
        responses: {
          "200": {
            description: "댓글 삭제 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "댓글이 삭제되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/lectures/{id}/comments/{commentId}/replies": {
      get: {
        tags: ["Comments"],
        summary: "댓글 답글 목록 조회",
        description:
          "특정 댓글의 답글 목록을 페이지네이션과 정렬 옵션으로 조회합니다.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "부모 댓글 ID",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
            description: "페이지당 항목 수",
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest", "likes"],
              default: "latest",
            },
            description: "정렬 기준 (최신순, 오래된순, 좋아요순)",
          },
        ],
        responses: {
          "200": {
            description: "답글 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "답글 목록 조회 성공",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentsListResponse",
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "댓글 답글 작성",
        description: "특정 댓글에 답글을 작성합니다. 인증이 필요합니다.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "부모 댓글 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: {
                    type: "string",
                    maxLength: 1000,
                    example: "유익한 강의에 대한 답글입니다.",
                    description: "답글 내용 (최대 1000자)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "답글 작성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "답글이 작성되었습니다",
                    },
                    data: {
                      $ref: "#/components/schemas/CommentResponse",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Dashboard endpoints
    "/dashboard/veterinarian": {
      get: {
        tags: ["Dashboard"],
        summary: "수의사 대시보드",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "수의사 대시보드 데이터",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "대시보드 조회 성공" },
                    data: {
                      $ref: "#/components/schemas/VeterinarianDashboard",
                    },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital": {
      get: {
        tags: ["Dashboard"],
        summary: "병원 대시보드",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "병원 대시보드 데이터",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "대시보드 조회 성공" },
                    data: { $ref: "#/components/schemas/HospitalDashboard" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/my-jobs/create": {
      post: {
        tags: ["Dashboard"],
        summary: "채용공고 생성",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/JobPostingCreateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "채용공고 생성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "채용공고가 생성되었습니다",
                    },
                    data: { $ref: "#/components/schemas/JobDetail" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/my-jobs/{id}/edit": {
      put: {
        tags: ["Dashboard"],
        summary: "채용공고 수정",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "채용공고 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/JobPostingCreateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "채용공고 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "채용공고가 수정되었습니다",
                    },
                    data: { $ref: "#/components/schemas/JobDetail" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/applicants/{id}/status": {
      put: {
        tags: ["Dashboard"],
        summary: "지원자 상태 업데이트",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "지원서 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: [
                      "PENDING",
                      "REVIEWING",
                      "ACCEPTED",
                      "REJECTED",
                    ],
                    description: "지원 상태",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "상태 업데이트 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "지원자 상태가 업데이트되었습니다",
                    },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/veterinarian/applications": {
      get: {
        tags: ["Dashboard"],
        summary: "수의사 지원 현황",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["latest", "oldest"],
              default: "latest",
            },
            description: "정렬 기준",
          },
        ],
        responses: {
          "200": {
            description: "지원 현황 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "지원 현황 조회 성공" },
                    data: {
                      type: "object",
                      properties: {
                        applications: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Application" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/veterinarian/profile": {
      get: {
        tags: ["Dashboard"],
        summary: "수의사 프로필 조회",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "프로필 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "프로필 조회 성공" },
                    data: { $ref: "#/components/schemas/VeterinarianProfile" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Dashboard"],
        summary: "수의사 프로필 수정",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  nickname: { type: "string" },
                  phone: { type: "string" },
                  birthDate: { type: "string", format: "date" },
                  profileImage: { type: "string", format: "binary" },
                  licenseImage: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "프로필 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "프로필이 수정되었습니다",
                    },
                    data: { $ref: "#/components/schemas/VeterinarianProfile" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/veterinarian/resume": {
      get: {
        tags: ["Dashboard"],
        summary: "수의사 이력서 조회",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "이력서 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "이력서 조회 성공" },
                    data: { $ref: "#/components/schemas/ResumeDetail" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Dashboard"],
        summary: "수의사 이력서 수정",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  introduction: { type: "string" },
                  experience: { type: "string" },
                  education: { type: "array", items: { type: "string" } },
                  licenses: { type: "array", items: { type: "string" } },
                  skills: { type: "array", items: { type: "string" } },
                  isPublic: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "이력서 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "이력서가 수정되었습니다",
                    },
                    data: { $ref: "#/components/schemas/ResumeDetail" },
                  },
                },
              },
            },
          },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/veterinarian/password": {
      put: {
        tags: ["Dashboard"],
        summary: "수의사 비밀번호 변경",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PasswordChangeRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "비밀번호 변경 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "비밀번호가 변경되었습니다",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/password": {
      put: {
        tags: ["Dashboard"],
        summary: "병원 비밀번호 변경",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PasswordChangeRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "비밀번호 변경 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "비밀번호가 변경되었습니다",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Upload endpoint
    "/upload": {
      post: {
        tags: ["Upload"],
        summary: "파일 업로드",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "업로드할 파일 (최대 10MB, 이미지/PDF만 허용)",
                  },
                  folder: {
                    type: "string",
                    description: "저장할 폴더명 (선택사항)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "파일 업로드 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "파일 업로드 성공" },
                    data: {
                      type: "object",
                      properties: {
                        url: {
                          type: "string",
                          example: "https://cdn.example.com/uploads/file.jpg",
                        },
                        filename: { type: "string", example: "file.jpg" },
                        size: { type: "integer", example: 1024000 },
                        mimeType: { type: "string", example: "image/jpeg" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Bookmark APIs
    "/jobs/{id}/bookmark": {
      post: {
        tags: ["Bookmarks"],
        summary: "채용공고 북마크 추가",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "채용공고 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 추가 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 추가되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Bookmarks"],
        summary: "채용공고 북마크 제거",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "채용공고 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 제거 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 제거되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/lectures/{id}/bookmark": {
      post: {
        tags: ["Bookmarks"],
        summary: "강의 북마크 추가",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 추가 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 추가되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Bookmarks"],
        summary: "강의 북마크 제거",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "강의 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 제거 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 제거되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Hospital APIs
    "/hospitals": {
      get: {
        tags: ["Hospitals"],
        summary: "병원 목록 조회",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "keyword",
            in: "query",
            schema: { type: "string" },
            description: "검색 키워드",
          },
        ],
        responses: {
          "200": {
            description: "병원 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "병원 목록 조회 성공" },
                    data: {
                      type: "object",
                      properties: {
                        hospitals: {
                          type: "array",
                          items: { type: "object" },
                        },
                        totalCount: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/hospitals/{id}": {
      get: {
        tags: ["Hospitals"],
        summary: "병원 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
        ],
        responses: {
          "200": {
            description: "병원 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "병원 상세 조회 성공" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Forum APIs
    "/forums": {
      get: {
        tags: ["Forums"],
        summary: "포럼 게시글 목록 조회",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "카테고리",
          },
        ],
        responses: {
          "200": {
            description: "포럼 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "포럼 목록 조회 성공" },
                    data: {
                      type: "object",
                      properties: {
                        posts: {
                          type: "array",
                          items: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Forums"],
        summary: "포럼 게시글 작성",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: { type: "string", example: "포럼 게시글 제목" },
                  content: { type: "string", example: "포럼 게시글 내용" },
                  category: { type: "string", example: "일반" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "게시글 작성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "게시글이 작성되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Transfer APIs
    "/transfers": {
      get: {
        tags: ["Transfers"],
        summary: "양도양수 게시글 목록 조회",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["양도", "양수"] },
            description: "양도양수 타입",
          },
        ],
        responses: {
          "200": {
            description: "양도양수 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "양도양수 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        transfers: {
                          type: "array",
                          items: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/transfers/{id}": {
      get: {
        tags: ["Transfers"],
        summary: "양도양수 게시글 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "게시글 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "게시글 조회 성공" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Social Authentication endpoints
    "/auth/google/login": {
      post: {
        tags: ["Authentication"],
        summary: "Google 소셜 로그인",
        responses: {
          "302": {
            description: "Google OAuth 페이지로 리다이렉트",
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/naver/login": {
      post: {
        tags: ["Authentication"],
        summary: "Naver 소셜 로그인",
        responses: {
          "302": {
            description: "Naver OAuth 페이지로 리다이렉트",
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/kakao/login": {
      post: {
        tags: ["Authentication"],
        summary: "Kakao 소셜 로그인",
        responses: {
          "302": {
            description: "Kakao OAuth 페이지로 리다이렉트",
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/google/callback": {
      get: {
        tags: ["Authentication"],
        summary: "Google OAuth 콜백",
        parameters: [
          {
            name: "code",
            in: "query",
            schema: { type: "string" },
            description: "Google OAuth 인증 코드",
          },
        ],
        responses: {
          "200": {
            description: "로그인 성공",
            content: {
              "text/html": {
                schema: { type: "string" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/kakao/callback": {
      get: {
        tags: ["Authentication"],
        summary: "Kakao OAuth 콜백",
        parameters: [
          {
            name: "code",
            in: "query",
            schema: { type: "string" },
            description: "Kakao OAuth 인증 코드",
          },
        ],
        responses: {
          "200": {
            description: "로그인 성공",
            content: {
              "text/html": {
                schema: { type: "string" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/naver/callback": {
      get: {
        tags: ["Authentication"],
        summary: "Naver OAuth 콜백",
        parameters: [
          {
            name: "code",
            in: "query",
            schema: { type: "string" },
            description: "Naver OAuth 인증 코드",
          },
          {
            name: "state",
            in: "query",
            schema: { type: "string" },
            description: "CSRF 방지용 state 값",
          },
        ],
        responses: {
          "200": {
            description: "로그인 성공",
            content: {
              "text/html": {
                schema: { type: "string" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Unified Auth APIs
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "로그아웃",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "로그아웃 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "로그아웃되었습니다" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/social/link": {
      post: {
        tags: ["Authentication"],
        summary: "소셜 계정 연동",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["provider", "socialId"],
                properties: {
                  provider: {
                    type: "string",
                    enum: ["google", "naver", "kakao"],
                    example: "google",
                  },
                  socialId: { type: "string", example: "google_123456789" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "소셜 계정 연동 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "소셜 계정이 연동되었습니다",
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/social/unlink/{provider}": {
      delete: {
        tags: ["Authentication"],
        summary: "소셜 계정 연동 해제",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "provider",
            in: "path",
            required: true,
            schema: {
              type: "string",
              enum: ["google", "naver", "kakao"],
            },
            description: "소셜 로그인 제공자",
          },
        ],
        responses: {
          "200": {
            description: "소셜 계정 연동 해제 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "소셜 계정 연동이 해제되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Dashboard additional APIs
    "/dashboard/veterinarian/bookmarks": {
      get: {
        tags: ["Dashboard"],
        summary: "수의사 북마크 목록",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "북마크 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        bookmarks: {
                          type: "array",
                          items: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/applicants": {
      get: {
        tags: ["Dashboard"],
        summary: "병원 지원자 목록",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "지원자 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "지원자 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        applicants: {
                          type: "array",
                          items: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/my-jobs": {
      get: {
        tags: ["Dashboard"],
        summary: "병원 채용공고 목록",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "채용공고 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "채용공고 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        jobs: {
                          type: "array",
                          items: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/dashboard/hospital/applicants/{id}": {
      get: {
        tags: ["Dashboard"],
        summary: "지원자 상세 정보",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "지원자 ID",
          },
        ],
        responses: {
          "200": {
            description: "지원자 상세 정보 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "지원자 정보 조회 성공",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Forum detailed APIs
    "/forums/{id}": {
      get: {
        tags: ["Forums"],
        summary: "포럼 게시글 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "게시글 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "게시글 조회 성공" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Forums"],
        summary: "포럼 게시글 수정",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "게시글 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "수정된 게시글 제목" },
                  content: { type: "string", example: "수정된 게시글 내용" },
                  category: { type: "string", example: "일반" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "게시글 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "게시글이 수정되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Forums"],
        summary: "포럼 게시글 삭제",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "게시글 삭제 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "게시글이 삭제되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Home API
    "/home": {
      get: {
        tags: ["Home"],
        summary: "홈페이지 데이터",
        description: "메인 페이지에 표시할 데이터 조회",
        responses: {
          "200": {
            description: "홈페이지 데이터 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "홈페이지 데이터 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        featuredJobs: {
                          type: "array",
                          items: { type: "object" },
                          description: "추천 채용공고",
                        },
                        recentLectures: {
                          type: "array",
                          items: { type: "object" },
                          description: "최신 강의",
                        },
                        statistics: {
                          type: "object",
                          description: "통계 정보",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Hospital Evaluation APIs
    "/hospitals/{id}/evaluation": {
      get: {
        tags: ["Evaluations"],
        summary: "병원 평가 목록 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
        ],
        responses: {
          "200": {
            description: "병원 평가 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "병원 평가 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        evaluations: {
                          type: "array",
                          items: { type: "object" },
                        },
                        totalCount: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Evaluations"],
        summary: "병원 평가 작성",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "content"],
                properties: {
                  rating: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 4,
                    description: "평점 (1-5점)",
                  },
                  content: {
                    type: "string",
                    example: "좋은 병원입니다.",
                    description: "평가 내용",
                  },
                  isAnonymous: {
                    type: "boolean",
                    default: false,
                    description: "익명 여부",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "병원 평가 작성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 등록되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/hospitals/{id}/evaluation/{evaluationId}": {
      get: {
        tags: ["Evaluations"],
        summary: "병원 평가 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        responses: {
          "200": {
            description: "병원 평가 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "평가 조회 성공" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Evaluations"],
        summary: "병원 평가 수정",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  content: { type: "string" },
                  isAnonymous: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "병원 평가 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 수정되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Evaluations"],
        summary: "병원 평가 삭제",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "병원 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        responses: {
          "200": {
            description: "병원 평가 삭제 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 삭제되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Resume Evaluation APIs
    "/resumes/{id}/evaluation": {
      get: {
        tags: ["Evaluations"],
        summary: "인재 평가 목록 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "페이지당 항목 수",
          },
        ],
        responses: {
          "200": {
            description: "인재 평가 목록 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "인재 평가 목록 조회 성공",
                    },
                    data: {
                      type: "object",
                      properties: {
                        evaluations: {
                          type: "array",
                          items: { type: "object" },
                        },
                        totalCount: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Evaluations"],
        summary: "인재 평가 작성",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "content"],
                properties: {
                  rating: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 4,
                    description: "평점 (1-5점)",
                  },
                  content: {
                    type: "string",
                    example: "우수한 수의사입니다.",
                    description: "평가 내용",
                  },
                  isAnonymous: {
                    type: "boolean",
                    default: false,
                    description: "익명 여부",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "인재 평가 작성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 등록되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/resumes/{id}/evaluation/{evaluationId}": {
      get: {
        tags: ["Evaluations"],
        summary: "인재 평가 상세 조회",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        responses: {
          "200": {
            description: "인재 평가 상세 조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "평가 조회 성공" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Evaluations"],
        summary: "인재 평가 수정",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  content: { type: "string" },
                  isAnonymous: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "인재 평가 수정 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 수정되었습니다",
                    },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Evaluations"],
        summary: "인재 평가 삭제",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "수의사 ID",
          },
          {
            name: "evaluationId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "평가 ID",
          },
        ],
        responses: {
          "200": {
            description: "인재 평가 삭제 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "평가가 삭제되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    // Transfer Bookmark API
    "/transfers/{id}/bookmark": {
      post: {
        tags: ["Bookmarks"],
        summary: "양도양수 북마크 추가",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "양도양수 게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 추가 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 추가되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Bookmarks"],
        summary: "양도양수 북마크 제거",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "양도양수 게시글 ID",
          },
        ],
        responses: {
          "200": {
            description: "북마크 제거 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "북마크가 제거되었습니다",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    // 회원 탈퇴 API
    "/auth/withdraw": {
      post: {
        tags: ["Authentication"],
        summary: "회원 탈퇴",
        description:
          "계정을 soft delete 처리합니다. 계정은 3개월간 보관되며, 같은 휴대폰번호로 재가입 시 복구할 수 있습니다.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  reason: {
                    type: "string",
                    example: "서비스 이용 불만족",
                    description: "탈퇴 사유 (선택사항)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "탈퇴 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "회원 탈퇴가 완료되었습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        deletedAt: { type: "string", format: "date-time" },
                        message: {
                          type: "string",
                          example:
                            "계정은 3개월간 보관되며, 같은 휴대폰번호로 재가입 시 복구할 수 있습니다",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    // 계정 복구 API
    "/auth/recover": {
      get: {
        tags: ["Authentication"],
        summary: "복구 가능한 계정 조회",
        description: "휴대폰번호로 복구 가능한 탈퇴 계정이 있는지 확인합니다.",
        parameters: [
          {
            name: "phone",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "010-1234-5678",
            description: "휴대폰번호",
          },
        ],
        responses: {
          "200": {
            description: "계정 조회 완료",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "계정 정보 조회 완료" },
                    data: {
                      type: "object",
                      properties: {
                        hasRecoverableAccount: { type: "boolean" },
                        accountInfo: {
                          type: "object",
                          nullable: true,
                          properties: {
                            email: {
                              type: "string",
                              example: "te***@example.com",
                            },
                            userType: {
                              type: "string",
                              enum: ["veterinarian", "hospital"],
                            },
                            provider: {
                              type: "string",
                              enum: ["normal", "google", "kakao", "naver"],
                            },
                            deletedAt: { type: "string", format: "date-time" },
                            daysUntilExpiry: { type: "integer", example: 45 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Authentication"],
        summary: "계정 복구",
        description:
          "탈퇴한 계정을 복구합니다. 소셜 로그인 계정의 경우 비밀번호가 필요하지 않습니다.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone"],
                properties: {
                  phone: {
                    type: "string",
                    example: "010-1234-5678",
                    description: "휴대폰번호",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                    description: "비밀번호 (일반 계정의 경우 필수)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "계정 복구 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "계정이 성공적으로 복구되었습니다",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            username: { type: "string" },
                            email: { type: "string" },
                            userType: {
                              type: "string",
                              enum: ["veterinarian", "hospital"],
                            },
                            provider: {
                              type: "string",
                              enum: ["normal", "google", "kakao", "naver"],
                            },
                          },
                        },
                        tokens: {
                          type: "object",
                          properties: {
                            accessToken: { type: "string" },
                            refreshToken: { type: "string" },
                            expiresIn: { type: "integer" },
                          },
                        },
                        restoredAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": {
            description: "복구 가능한 계정이 없음",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "error" },
                    message: {
                      type: "string",
                      example: "복구 가능한 계정이 없습니다",
                    },
                  },
                },
              },
            },
          },
          "410": {
            description: "계정 보관 기간 만료",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "error" },
                    message: {
                      type: "string",
                      example: "계정 보관 기간이 만료되어 복구할 수 없습니다",
                    },
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT 토큰을 Authorization 헤더에 'Bearer {token}' 형식으로 전송",
      },
    },
    responses: {
      ...COMMON_RESPONSES,
      BadRequest: {
        description: "잘못된 요청",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: { type: "string", example: "잘못된 요청입니다" },
                error: { type: "string" },
              },
            },
          },
        },
      },
      Unauthorized: {
        description: "인증 실패",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: { type: "string", example: "인증에 실패했습니다" },
              },
            },
          },
        },
      },
      Forbidden: {
        description: "권한 없음",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: { type: "string", example: "접근 권한이 없습니다" },
              },
            },
          },
        },
      },
      NotFound: {
        description: "리소스를 찾을 수 없음",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: {
                  type: "string",
                  example: "요청한 리소스를 찾을 수 없습니다",
                },
              },
            },
          },
        },
      },
      Conflict: {
        description: "중복된 리소스",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: {
                  type: "string",
                  example: "이미 존재하는 리소스입니다",
                },
              },
            },
          },
        },
      },
      InternalError: {
        description: "서버 내부 오류",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string", example: "error" },
                message: {
                  type: "string",
                  example: "서버 내부 오류가 발생했습니다",
                },
              },
            },
          },
        },
      },
    },
    schemas: {
      ...API_SCHEMAS,
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "user123" },
          username: { type: "string", example: "veterinarian123" },
          nickname: { type: "string", example: "김수의" },
          email: {
            type: "string",
            format: "email",
            example: "vet@example.com",
          },
          profileImage: {
            type: "string",
            example: "https://cdn.example.com/profile.jpg",
          },
          userType: {
            type: "string",
            enum: ["veterinarian", "hospital"],
            example: "veterinarian",
          },
          provider: {
            type: "string",
            enum: ["normal", "naver", "kakao", "google"],
            example: "normal",
          },
          socialAccounts: {
            type: "array",
            items: { type: "object" },
            example: [],
          },
        },
      },
      AuthTokens: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          refreshToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      JobListItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "job123" },
          title: { type: "string", example: "소동물 임상수의사 모집" },
          hospitalName: { type: "string", example: "행복동물병원" },
          deadline: { type: "string", format: "date", example: "2024-12-31" },
          isDeadlineUnlimited: { type: "boolean", example: false },
          position: { type: "string", example: "임상수의사" },
          workType: { type: "string", example: "정규직" },
          hospitalLocation: { type: "string", example: "서울특별시 강남구" },
          salary: { type: "string", example: "협의" },
          hashtags: {
            type: "array",
            items: { type: "string" },
            example: ["소동물", "내과", "신입가능"],
          },
          isPublic: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      JobDetail: {
        allOf: [
          { $ref: "#/components/schemas/JobListItem" },
          {
            type: "object",
            properties: {
              description: {
                type: "string",
                example: "경험 많은 임상수의사를 모집합니다...",
              },
              recruitCount: { type: "integer", example: 2 },
              workConditions: {
                type: "object",
                properties: {
                  workDays: {
                    type: "array",
                    items: { type: "string" },
                    example: ["월", "화", "수", "목", "금"],
                  },
                  workHours: { type: "string", example: "09:00 - 18:00" },
                  benefits: {
                    type: "string",
                    example: "4대보험, 퇴직금, 연차",
                  },
                },
              },
              requirements: {
                type: "object",
                properties: {
                  education: {
                    type: "array",
                    items: { type: "string" },
                    example: ["수의과대학 졸업"],
                  },
                  licenses: {
                    type: "array",
                    items: { type: "string" },
                    example: ["수의사 면허"],
                  },
                  experience: { type: "string", example: "1년 이상" },
                },
              },
              hospital: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  hospitalName: { type: "string" },
                  address: { type: "string" },
                  logoImage: { type: "string" },
                },
              },
            },
          },
        ],
      },
      JobPostingCreateRequest: {
        type: "object",
        required: ["title", "description", "workType", "position"],
        properties: {
          title: {
            type: "string",
            maxLength: 200,
            example: "소동물 임상수의사 모집",
          },
          description: {
            type: "string",
            example: "경험 많은 임상수의사를 모집합니다...",
          },
          workType: { type: "string", example: "정규직" },
          position: { type: "string", example: "임상수의사" },
          salary: { type: "string", example: "연봉 4000만원" },
          deadline: { type: "string", format: "date", example: "2024-12-31" },
          isDeadlineUnlimited: { type: "boolean", example: false },
          recruitCount: { type: "integer", minimum: 1, example: 2 },
          isDraft: { type: "boolean", example: false },
          isPublic: { type: "boolean", example: true },
        },
      },
      ResumeListItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "vet123" },
          nickname: { type: "string", example: "김수의" },
          profileImage: {
            type: "string",
            example: "https://cdn.example.com/profile.jpg",
          },
          introduction: {
            type: "string",
            example: "5년 경력의 소동물 임상수의사입니다",
          },
          experience: { type: "string", example: "5년" },
          workType: { type: "string", example: "정규직" },
          region: { type: "string", example: "서울" },
          hashtags: {
            type: "array",
            items: { type: "string" },
            example: ["소동물", "내과", "수술"],
          },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResumeDetail: {
        allOf: [
          { $ref: "#/components/schemas/ResumeListItem" },
          {
            type: "object",
            properties: {
              education: {
                type: "array",
                items: { type: "string" },
                example: ["서울대학교 수의과대학 졸업"],
              },
              licenses: {
                type: "array",
                items: { type: "string" },
                example: ["수의사 면허", "소동물 전문의"],
              },
              skills: {
                type: "array",
                items: { type: "string" },
                example: ["내과진료", "외과수술", "영상진단"],
              },
              isPublic: { type: "boolean", example: true },
            },
          },
        ],
      },
      LectureListItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "lecture123" },
          title: { type: "string", example: "소동물 심장질환 진단법" },
          description: {
            type: "string",
            example: "심장질환의 기본적인 진단 방법을 배웁니다",
          },
          thumbnailImage: {
            type: "string",
            example: "https://cdn.example.com/thumb.jpg",
          },
          duration: { type: "integer", example: 1800 },
          difficulty: { type: "string", example: "초급" },
          medicalField: { type: "string", example: "내과" },
          animal: { type: "string", example: "소동물" },
          instructor: { type: "string", example: "홍길동 교수" },
          viewCount: { type: "integer", example: 150 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      LectureDetail: {
        allOf: [
          { $ref: "#/components/schemas/LectureListItem" },
          {
            type: "object",
            properties: {
              videoUrl: {
                type: "string",
                example: "https://cdn.example.com/video.mp4",
              },
              materials: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    url: { type: "string" },
                  },
                },
              },
              isPublic: { type: "boolean", example: true },
            },
          },
        ],
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string" },
          content: { type: "string" },
          author: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      VeterinarianDashboard: {
        type: "object",
        properties: {
          myResume: {
            type: "object",
            properties: {
              profileImage: { type: "string" },
              nickname: { type: "string" },
              introduction: { type: "string" },
              hashtags: {
                type: "array",
                items: { type: "string" },
              },
              isPublic: { type: "boolean" },
            },
          },
          applicationStatus: {
            type: "object",
            properties: {
              totalApplications: { type: "integer" },
              finalPassed: { type: "integer" },
              documentPassed: { type: "integer" },
              documentFailed: { type: "integer" },
              documentPending: { type: "integer" },
            },
          },
          bookmarkedJobs: {
            type: "array",
            items: { $ref: "#/components/schemas/JobListItem" },
          },
          notifications: {
            type: "array",
            items: { $ref: "#/components/schemas/Notification" },
          },
          advertisements: {
            type: "array",
            items: { $ref: "#/components/schemas/Advertisement" },
          },
          recentApplications: {
            type: "array",
            items: { $ref: "#/components/schemas/Application" },
          },
        },
      },
      HospitalDashboard: {
        type: "object",
        properties: {
          hospitalProfile: {
            type: "object",
            properties: {
              hospitalName: { type: "string" },
              logoImage: { type: "string" },
              address: { type: "string" },
              phone: { type: "string" },
            },
          },
          recruitmentStatus: {
            type: "object",
            properties: {
              activeJobs: { type: "integer" },
              totalApplications: { type: "integer" },
              pendingApplications: { type: "integer" },
              acceptedApplications: { type: "integer" },
            },
          },
          activeJobs: {
            type: "array",
            items: { $ref: "#/components/schemas/JobListItem" },
          },
          notifications: {
            type: "array",
            items: { $ref: "#/components/schemas/Notification" },
          },
          advertisements: {
            type: "array",
            items: { $ref: "#/components/schemas/Advertisement" },
          },
          recentApplicants: {
            type: "array",
            items: { $ref: "#/components/schemas/Application" },
          },
        },
      },
      VeterinarianProfile: {
        type: "object",
        properties: {
          nickname: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          birthDate: { type: "string", format: "date" },
          profileImage: { type: "string" },
          licenseImage: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Application: {
        type: "object",
        properties: {
          id: { type: "string" },
          jobId: { type: "string" },
          jobTitle: { type: "string" },
          hospitalName: { type: "string" },
          status: {
            type: "string",
            enum: [
              "PENDING",
              "REVIEWING",
              "ACCEPTED",
              "REJECTED",
            ],
          },
          appliedAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          type: { type: "string" },
          isRead: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Advertisement: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          image: { type: "string" },
          link: { type: "string" },
          position: { type: "string" },
        },
      },
      CommentCreateRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: {
            type: "string",
            maxLength: 1000,
            example: "강의 내용이 정말 유익했습니다!",
          },
          parentCommentId: {
            type: "string",
            description: "대댓글인 경우 상위 댓글 ID",
            example: "comment123",
          },
        },
      },
      CommentUpdateRequest: {
        type: "object",
        required: ["content"],
        properties: {
          content: {
            type: "string",
            maxLength: 1000,
            example: "수정된 댓글 내용입니다.",
          },
        },
      },
      CommentResponse: {
        type: "object",
        properties: {
          commentId: { type: "string", example: "comment123" },
          lectureId: { type: "string", example: "lecture123" },
          userId: { type: "string", example: "user123" },
          content: {
            type: "string",
            example: "강의 내용이 정말 유익했습니다!",
          },
          parentCommentId: {
            type: "string",
            example: "comment456",
            description: "대댓글인 경우 상위 댓글 ID",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T10:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T11:00:00Z",
          },
          author: {
            type: "object",
            properties: {
              username: { type: "string", example: "veterinarian123" },
              nickname: { type: "string", example: "김수의" },
              profileImage: {
                type: "string",
                example: "https://cdn.example.com/profile.jpg",
              },
            },
          },
          repliesCount: { type: "integer", example: 3 },
          likesCount: { type: "integer", example: 12 },
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
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 20 },
              total: { type: "integer", example: 45 },
              totalPages: { type: "integer", example: 3 },
            },
          },
        },
      },
      PasswordChangeRequest: {
        type: "object",
        required: ["newPassword"],
        properties: {
          currentPassword: {
            type: "string",
            description: "현재 비밀번호 (선택사항, 추가 보안을 위해)",
            example: "current123",
          },
          newPassword: {
            type: "string",
            minLength: 6,
            example: "newpassword123",
            description: "새 비밀번호 (최소 6자 이상)",
          },
        },
      },
    },
  },
};

export async function GET(request: NextRequest) {
  // 배포환경에 맞는 서버 URL 동적 설정
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : request.nextUrl.origin;

  // 동적으로 서버 URL 업데이트
  const dynamicOpenApiSpec = {
    ...openApiSpec,
    servers: [
      {
        url: `${baseUrl}/api`,
        description: "API Server",
      },
    ],
  };

  return NextResponse.json(dynamicOpenApiSpec, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
