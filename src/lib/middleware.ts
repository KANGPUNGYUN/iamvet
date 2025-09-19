// src/lib/middleware.ts - API 미들웨어
import { NextRequest, NextResponse } from "next/server";
import type { BaseResponse } from "./types";
import { createApiResponse, createErrorResponse, validateEmail } from "./types";
import { verifyToken } from "./auth";

export const withAuth = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    console.log(`=== withAuth: ${request.method} ${request.url} ===`);
    try {
      let token: string | null = null;
      let payload: any = null;

      // 1. Authorization 헤더에서 토큰 확인 (기존 방식)
      const authorization = request.headers.get("authorization");
      if (authorization && authorization.startsWith("Bearer ")) {
        token = authorization.slice(7);
        payload = verifyToken(token);
      }

      // 2. 쿠키에서 토큰 확인 (새로운 방식)
      if (!payload) {
        const cookieToken = request.cookies.get("auth-token")?.value;
        if (cookieToken) {
          payload = verifyToken(cookieToken);
        }
      }

      if (!payload) {
        console.log('withAuth: 인증 실패 - 토큰이나 페이로드가 없음');
        return NextResponse.json(createErrorResponse("인증이 필요합니다"), {
          status: 401,
        });
      }

      // 디버깅 로그
      console.log('withAuth: 인증 성공', {
        userId: payload.userId,
        userType: payload.userType,
        hasToken: !!token
      });

      // 요청 객체에 사용자 정보 추가
      (request as any).user = payload;

      return handler(request, ...args);
    } catch (error) {
      console.error("withAuth middleware error:", error);
      return NextResponse.json(
        createErrorResponse("인증 처리 중 오류가 발생했습니다"),
        { status: 500 }
      );
    }
  };
};

export const withValidation = (schema: any) => {
  return (handler: Function) => {
    return async (request: NextRequest, ...args: any[]) => {
      try {
        const body = await request.json();

        // 간단한 검증 (실제로는 Zod, Joi 등 사용 권장)
        const errors = validateSchema(body, schema);
        if (errors.length > 0) {
          return NextResponse.json(
            createErrorResponse("입력값이 올바르지 않습니다", { errors }),
            { status: 400 }
          );
        }

        return handler(request, ...args);
      } catch (error) {
        return NextResponse.json(
          createErrorResponse("요청 처리 중 오류가 발생했습니다"),
          { status: 400 }
        );
      }
    };
  };
};

const validateSchema = (data: any, schema: any): string[] => {
  const errors: string[] = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    const ruleList = rules as any;

    if (
      ruleList.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${key}은(는) 필수 항목입니다`);
    }

    if (value && ruleList.type === "email" && !validateEmail(value)) {
      errors.push(`${key}은(는) 올바른 이메일 형식이어야 합니다`);
    }

    if (value && ruleList.minLength && value.length < ruleList.minLength) {
      errors.push(
        `${key}은(는) 최소 ${ruleList.minLength}자 이상이어야 합니다`
      );
    }
  }

  return errors;
};
