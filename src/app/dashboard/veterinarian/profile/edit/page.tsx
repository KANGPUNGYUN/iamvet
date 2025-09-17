"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "public/icons";
import { Button } from "@/components/ui/Button";
import { InputBox } from "@/components/ui/Input/InputBox";
import { PhoneInput, BirthDateInput } from "@/components/ui/FormattedInput";
import {
  ProfileImageUpload,
  LicenseImageUpload,
} from "@/components/features/profile";
import { useAuth } from "@/hooks/api/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/api/useAuth";

interface VeterinarianProfileEditData {
  profileImage?: string;
  userId: string;
  realName: string;
  nickname: string;
  phone: string;
  email: string;
  universityEmail?: string; // 수의학과 학생용
  birthDate: string;
  licenseImage?: string;
  password: string;
  passwordConfirm: string;
}

interface DuplicateCheckState {
  userId: {
    isChecking: boolean;
    isValid: boolean;
  };
  email: {
    isChecking: boolean;
    isValid: boolean;
  };
  universityEmail: {
    isChecking: boolean;
    isValid: boolean;
  };
}

export default function VeterinarianProfileEditPage() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("");
  const [isSocialUser, setIsSocialUser] = useState(false);
  
  // 인증 상태 관리
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckState>({
    userId: {
      isChecking: false,
      isValid: false,
    },
    email: {
      isChecking: false,
      isValid: false,
    },
    universityEmail: {
      isChecking: false,
      isValid: false,
    },
  });

  // 폼 상태 관리
  const [formData, setFormData] = useState<VeterinarianProfileEditData>({
    profileImage: undefined,
    userId: "",
    realName: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    licenseImage: undefined,
    password: "",
    passwordConfirm: "",
    universityEmail: "",
  });

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // API Route로 veterinarian 전용 데이터 가져오기 (localStorage 토큰 지원)
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('/api/dashboard/veterinarian/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        const apiResult = await response.json();
        const profileResult = {
          success: apiResult.status === 'success',
          profile: apiResult.data,
          error: apiResult.message
        };

        if (profileResult.success) {
          const profile = profileResult.profile;
          
          // SNS 사용자 확인 및 회원 유형 설정
          // API 응답에서 provider 정보로 SNS 사용자 확인
          console.log('Profile data:', profile);
          console.log('Provider from profile:', profile?.provider);
          console.log('User object:', user);
          
          const socialProviders = ['GOOGLE', 'KAKAO', 'NAVER'];
          // user 객체에서 직접 provider 정보 사용 (가장 신뢰할 수 있는 소스)
          const provider = (user as any)?.provider || profile?.provider;
          const socialUser = provider && socialProviders.includes(provider);
          const userMemberType = profile?.userType || 'veterinarian';
          
          console.log('Final provider:', provider);
          console.log('Is social user:', socialUser);
          console.log('Social providers check:', socialProviders.includes(provider || ''));
          
          setIsSocialUser(socialUser);
          setUserType(userMemberType);
          
          // profile이 null이어도 기본값으로 폼을 표시
          // user.phone과 user.birthDate가 없는 경우 profile에서 가져오기
          const finalPhone = user.phone || profile?.phone || '';
          const finalBirthDate = user.birthDate || 
            (profile?.birthDate ? 
              (typeof profile.birthDate === 'string' ? profile.birthDate : profile.birthDate?.toISOString().split('T')[0]) 
              : '');

          setFormData({
            profileImage: user.profileImage || undefined,
            userId: user.name || user.email,
            realName: user.realName || "",
            nickname: profile?.nickname || user.name || "",
            phone: finalPhone,
            email: user.email || "",
            universityEmail: profile?.universityEmail || "",
            birthDate: finalBirthDate,
            licenseImage: profile?.licenseImage || undefined,
            password: "",
            passwordConfirm: "",
          });
        } else {
          setError(profileResult.error || "프로필 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("프로필 로드 오류:", err);
        setError("프로필 정보 로드 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (user && !isLoading) {
      loadUserData();
    } else if (!isLoading && !user) {
      // 로그인하지 않은 경우 리다이렉트
      window.location.href = "/member-select";
    }
  }, [user, isLoading]);

  const handleInputChange =
    (field: keyof VeterinarianProfileEditData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleImageChange =
    (field: "profileImage" | "licenseImage") => (url: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: url }));
    };

  // 대학교 이메일 도메인 검증 (수의학과 학생용)
  const validateUniversityEmail = (email: string): boolean => {
    const veterinaryUniversityDomains = [
      "kangwon.ac.kr",    // 강원대
      "konkuk.ac.kr",     // 건국대
      "knu.ac.kr",        // 경북대
      "gnu.ac.kr",        // 경상국립대
      "snu.ac.kr",        // 서울대
      "jnu.ac.kr",        // 전남대
      "jbnu.ac.kr",       // 전북대
      "stu.jejunu.ac.kr", // 제주대
      "o.cnu.ac.kr",      // 충남대
      "chungbuk.ac.kr",   // 충북대
    ];

    const domain = email.split("@")[1]?.toLowerCase();
    return veterinaryUniversityDomains.includes(domain || "");
  };

  // 아이디 중복 확인
  const handleUserIdDuplicateCheck = async () => {
    if (!formData.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (formData.userId.length < 4) {
      alert("아이디는 4자 이상이어야 합니다.");
      return;
    }

    setDuplicateCheck((prev) => ({
      ...prev,
      userId: { ...prev.userId, isChecking: true },
    }));

    try {
      const response = await fetch("/api/auth/check-username-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.userId }),
      });

      const result = await response.json();

      if (result.success) {
        const isValid = !result.isDuplicate;
        setDuplicateCheck((prev) => ({
          ...prev,
          userId: { isChecking: false, isValid },
        }));
        alert(result.message);
      } else {
        setDuplicateCheck((prev) => ({
          ...prev,
          userId: { ...prev.userId, isChecking: false },
        }));
        alert(result.error || "아이디 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        userId: { ...prev.userId, isChecking: false },
      }));
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 이메일 중복 확인 (일반 수의사용)
  const handleEmailDuplicateCheck = async () => {
    if (!formData.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setDuplicateCheck((prev) => ({
      ...prev,
      email: { ...prev.email, isChecking: true },
    }));

    try {
      const response = await fetch("/api/auth/check-email-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (result.success) {
        const isValid = !result.isDuplicate;
        setDuplicateCheck((prev) => ({
          ...prev,
          email: { isChecking: false, isValid },
        }));
        alert(result.message);
      } else {
        setDuplicateCheck((prev) => ({
          ...prev,
          email: { ...prev.email, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        email: { ...prev.email, isChecking: false },
      }));
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 대학교 이메일 중복 확인 (수의학과 학생용)
  const handleUniversityEmailDuplicateCheck = async () => {
    if (!formData.universityEmail?.trim()) {
      alert("대학교 이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.universityEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!validateUniversityEmail(formData.universityEmail)) {
      alert("수의학과가 있는 대학교의 이메일을 입력해주세요.");
      return;
    }

    setDuplicateCheck((prev) => ({
      ...prev,
      universityEmail: { ...prev.universityEmail, isChecking: true },
    }));

    try {
      const response = await fetch("/api/auth/check-email-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.universityEmail }),
      });

      const result = await response.json();

      if (result.success) {
        const isValid = !result.isDuplicate;
        setDuplicateCheck((prev) => ({
          ...prev,
          universityEmail: { isChecking: false, isValid },
        }));
        alert(result.message);
      } else {
        setDuplicateCheck((prev) => ({
          ...prev,
          universityEmail: { ...prev.universityEmail, isChecking: false },
        }));
        alert(result.error || "이메일 중복 확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("대학교 이메일 중복 확인 오류:", error);
      setDuplicateCheck((prev) => ({
        ...prev,
        universityEmail: { ...prev.universityEmail, isChecking: false },
      }));
      alert("대학교 이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    // 비밀번호 확인
    if (formData.password && formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 필드 검증
    if (
      !formData.realName ||
      !formData.nickname ||
      !formData.phone ||
      !formData.email ||
      !formData.birthDate
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      console.log("프로필 수정 데이터:", formData);

      // FormData 생성
      const updateData = new FormData();
      updateData.append("realName", formData.realName);
      updateData.append("nickname", formData.nickname);
      updateData.append("phone", formData.phone);
      updateData.append("email", formData.email);
      updateData.append("birthDate", formData.birthDate);

      if (formData.profileImage) {
        updateData.append("profileImage", formData.profileImage);
      }
      if (formData.licenseImage) {
        updateData.append("licenseImage", formData.licenseImage);
      }
      if (formData.password) {
        updateData.append("password", formData.password);
      }

      // FormData 로깅
      console.log("FormData 내용:");
      console.log("realName:", updateData.get("realName"));
      console.log("nickname:", updateData.get("nickname"));
      console.log("phone:", updateData.get("phone"));
      console.log("email:", updateData.get("email"));
      console.log("birthDate:", updateData.get("birthDate"));
      console.log("profileImage:", updateData.get("profileImage"));
      console.log("licenseImage:", updateData.get("licenseImage"));
      console.log(
        "password:",
        updateData.get("password") ? "[SET]" : "[NOT SET]"
      );

      // API 호출
      console.log("API 호출 시작...");
      const response = await fetch("/api/dashboard/veterinarian/profile", {
        method: "PUT",
        body: updateData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // 응답을 텍스트로 먼저 읽어서 내용 확인
      const responseText = await response.text();
      console.log("Raw Response Text:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed API Response:", result);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response was not valid JSON:", responseText);
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      if (result.status === "success") {
        // React Query 캐시 무효화하여 실시간 업데이트
        await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });

        alert(result.message || "프로필이 수정되었습니다!");

        // 프로필 페이지로 이동
        window.location.href = "/dashboard/veterinarian/profile";
      } else {
        console.error("API Error Result:", result);
        alert(
          `프로필 수정 실패: ${
            result.message || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?")) {
      window.location.href = "/dashboard/veterinarian/profile";
    }
  };

  if (isLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#666666]">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="keycolor"
            size="medium"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-[20px] pb-[70px] px-[16px]">
      <div className="bg-white max-w-[1095px] w-full mx-auto px-[16px] lg:px-[20px] pt-[30px] pb-[156px] rounded-[16px] border border-[#EFEFF0]">
        {/* 메인 컨텐츠 */}
        <div className="max-w-md mx-auto w-full">
          {/* 페이지 제목 */}
          <h1 className="font-title text-[28px] font-light text-primary text-center mb-[60px]">
            프로필 수정
          </h1>

          <div className="flex flex-col gap-[60px]">
            {/* 프로필 사진 섹션 */}
            <section>
              <h2 className="text-[20px] font-medium text-[#3B394D] mb-6">
                프로필 사진
              </h2>
              <div className="flex justify-center">
                <ProfileImageUpload
                  value={formData.profileImage}
                  onChange={handleImageChange("profileImage")}
                  folder="profiles"
                />
              </div>
            </section>

            {/* 기본 정보 섹션 */}
            <section>
              <div className="space-y-8">
                {/* 아이디 - SNS 회원이 아닐 때만 표시 */}
                {!isSocialUser && (
                  <div>
                    <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                      아이디
                    </label>
                    <InputBox
                      value={formData.userId}
                      onChange={handleInputChange("userId")}
                      placeholder="아이디를 입력해주세요"
                      duplicateCheck={{
                        buttonText: "중복 확인",
                        onCheck: handleUserIdDuplicateCheck,
                        isChecking: duplicateCheck.userId.isChecking,
                        isValid: duplicateCheck.userId.isValid,
                      }}
                      success={duplicateCheck.userId.isValid}
                      guide={
                        duplicateCheck.userId.isValid
                          ? { text: "사용 가능한 아이디입니다", type: "success" }
                          : undefined
                      }
                    />
                  </div>
                )}

                {/* 실명 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    성함
                  </label>
                  <InputBox
                    value={formData.realName}
                    onChange={handleInputChange("realName")}
                    placeholder="실명을 입력해주세요"
                    guide={
                      isSocialUser 
                        ? { text: "SNS 계정 이름을 확인하고 실명을 정확히 입력해주세요", type: "info" }
                        : undefined
                    }
                  />
                </div>

                {/* 닉네임 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    닉네임
                  </label>
                  <InputBox
                    value={formData.nickname}
                    onChange={handleInputChange("nickname")}
                    placeholder="닉네임을 입력해주세요"
                  />
                </div>

                {/* 연락처 - FormattedInput 적용 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    연락처
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    placeholder="연락처를 입력해 주세요"
                  />
                </div>

                {/* 이메일 - 회원 유형에 따라 다르게 처리 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    이메일
                  </label>
                  <InputBox
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="이메일을 입력해 주세요"
                    type="email"
                    duplicateCheck={{
                      buttonText: "중복 확인",
                      onCheck: handleEmailDuplicateCheck,
                      isChecking: duplicateCheck.email.isChecking,
                      isValid: duplicateCheck.email.isValid,
                    }}
                    success={duplicateCheck.email.isValid}
                    guide={
                      duplicateCheck.email.isValid
                        ? { text: "사용 가능한 이메일입니다", type: "success" }
                        : undefined
                    }
                  />
                </div>

                {/* 대학교 이메일 - 수의학과 학생일 때만 표시 */}
                {userType === 'veterinary-student' && (
                  <div>
                    <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                      대학교 이메일
                    </label>
                    <InputBox
                      value={formData.universityEmail || ""}
                      onChange={handleInputChange("universityEmail")}
                      placeholder="대학교 이메일을 입력해주세요"
                      type="email"
                      duplicateCheck={{
                        buttonText: "인증 확인",
                        onCheck: handleUniversityEmailDuplicateCheck,
                        isChecking: duplicateCheck.universityEmail.isChecking,
                        isValid: duplicateCheck.universityEmail.isValid,
                      }}
                      success={duplicateCheck.universityEmail.isValid}
                      guide={
                        duplicateCheck.universityEmail.isValid
                          ? { text: "인증된 대학교 이메일입니다", type: "success" }
                          : { text: "수의학과가 있는 대학교의 이메일을 입력해주세요", type: "info" }
                      }
                    />
                  </div>
                )}

                {/* 생년월일 - FormattedInput 적용 */}
                <div>
                  <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                    생년월일
                  </label>
                  <BirthDateInput
                    value={formData.birthDate}
                    onChange={handleInputChange("birthDate")}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                {/* 비밀번호 변경 - SNS 회원이 아닐 때만 표시 */}
                {!isSocialUser && (
                  <>
                    <div>
                      <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                        비밀번호 변경
                      </label>
                      <InputBox
                        value={formData.password}
                        onChange={handleInputChange("password")}
                        placeholder="새 비밀번호를 입력해주세요 (변경 시에만)"
                        type="password"
                        guide={{
                          text: "비밀번호는 8자 이상 입력해주세요",
                          type: "info",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
                        비밀번호 변경 재입력
                      </label>
                      <InputBox
                        value={formData.passwordConfirm}
                        onChange={handleInputChange("passwordConfirm")}
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        type="password"
                        error={
                          !!(
                            formData.passwordConfirm &&
                            formData.password !== formData.passwordConfirm
                          )
                        }
                        guide={
                          formData.passwordConfirm &&
                          formData.password !== formData.passwordConfirm
                            ? {
                                text: "비밀번호가 일치하지 않습니다",
                                type: "error",
                              }
                            : undefined
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              {/* 수의사 면허증 */}
              <div className="mt-8">
                <label className="block text-[20px] font-medium text-[#3B394D] mb-6">
                  수의사 면허증
                  <span className="text-[14px] text-[#666666] block mt-1">수의학과 학생은 졸업 후 면허증을 등록할 수 있습니다.</span>
                </label>
                <div className="flex justify-center text-center">
                  <LicenseImageUpload
                    className="flex justify-center"
                    value={formData.licenseImage}
                    onChange={handleImageChange("licenseImage")}
                  />
                </div>
              </div>
            </section>

            {/* 버튼 영역 */}
            <div className="flex gap-4 w-full justify-center mt-[60px]">
              <Button
                variant="line"
                size="medium"
                onClick={handleCancel}
                className="px-[40px]"
              >
                취소
              </Button>
              <Button
                variant="keycolor"
                size="medium"
                onClick={handleSave}
                disabled={saving}
                className="px-[40px]"
              >
                {saving ? "저장 중..." : "수정하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
