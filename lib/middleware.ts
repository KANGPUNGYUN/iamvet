// src/lib/middleware.ts - API 미들웨어
import { NextRequest, NextResponse } from "next/server";
import type { BaseResponse } from "./types";
import { createApiResponse, createErrorResponse } from "./types";

export const withAuth = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const authorization = request.headers.get("authorization");

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return NextResponse.json(createErrorResponse("인증이 필요합니다"), {
          status: 401,
        });
      }

      const token = authorization.slice(7);
      const payload = verifyToken(token);

      if (!payload) {
        return NextResponse.json(
          createErrorResponse("유효하지 않은 토큰입니다"),
          { status: 401 }
        );
      }

      // 요청 객체에 사용자 정보 추가
      (request as any).user = payload;

      return handler(request, ...args);
    } catch (error) {
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
