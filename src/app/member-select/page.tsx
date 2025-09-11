"use client";

import Link from "next/link";
import Image from "next/image";
import hospitalImg from "@/assets/images/hospital.png";
import veterinarianImg from "@/assets/images/veterinarian.png";
import veterinaryStudentImg from "@/assets/images/veterinaryStudent.png";

export default function MemberSelectPage() {
  return (
    <>
      <main>
        <h2 className="font-title title-medium text-[32px] text-primary mt-[85px] flex justify-center">
          회원 유형 선택
        </h2>
        <div className="flex justify-center items-center gap-[20px] mt-[40px] mb-[136px] 2xl:grid 2xl:grid-cols-3 flex-col 2xl:gap-[20px] gap-[16px] 2xl:px-0 px-[16px] 2xl:max-w-[1120px] 2xl:mx-auto">
          <Link
            href="/login/veterinarian"
            className="2xl:w-[348px] 2xl:h-[380px] w-full max-w-[343px] h-[72px] border-[1px] border-solid border-[#cacad2] rounded-[16px] 2xl:pt-[40px] 2xl:px-[74px] 2xl:pb-[23px] p-[16px] flex 2xl:flex-col flex-row 2xl:items-center items-center 2xl:justify-between justify-between hover:border-keycolor1 hover:shadow-[0px_0px_12px_0px_rgba(255,135,150,0.25)] transition-all group overflow-hidden"
          >
            <h3 className="2xl:w-[172px] w-auto font-title title-light 2xl:text-[28px] text-[18px] text-subtext2 text-center font-normal group-hover:text-primary 2xl:group-hover:border-b-[3px] 2xl:group-hover:border-b-keycolor1 transition-all 2xl:pb-1 pb-0">
              수의사 회원
            </h3>
            <Image
              src={veterinarianImg}
              alt="수의사 회원"
              width={200}
              height={200}
              className="object-contain 2xl:w-[200px] 2xl:h-[200px] w-[77px] h-[77px] 2xl:mt-[0px] mt-[10px]"
            />
          </Link>
          <Link
            href="/login/veterinary-student"
            className="2xl:w-[348px] 2xl:h-[380px] max-w-[343px] w-full h-[72px] border-[1px] border-solid border-[#cacad2] rounded-[16px] 2xl:pt-[40px] 2xl:px-[74px] 2xl:pb-[23px] p-[16px] flex 2xl:flex-col flex-row 2xl:items-center items-center 2xl:justify-between justify-between hover:border-keycolor1 hover:shadow-[0px_0px_12px_0px_rgba(255,135,150,0.25)] transition-all group overflow-hidden"
          >
            <h3 className="2xl:w-[172px] w-auto font-title title-light 2xl:text-[28px] text-[18px] text-subtext2 text-center font-normal group-hover:text-primary 2xl:group-hover:border-b-[3px] 2xl:group-hover:border-b-keycolor1 transition-all 2xl:pb-1 pb-0">
              수의학과 학생
            </h3>
            <Image
              src={veterinaryStudentImg}
              alt="수의학과 학생"
              width={200}
              height={200}
              className="object-contain 2xl:w-[200px] 2xl:h-[200px] w-[77px] h-[77px] 2xl:mt-[0px] mt-[10px]"
            />
          </Link>
          <Link
            href="/login/hospital"
            className="2xl:w-[348px] 2xl:h-[380px] max-w-[343px] w-full h-[72px] border-[1px] border-solid border-[#cacad2] rounded-[16px] 2xl:pt-[40px] 2xl:px-[74px] 2xl:pb-[23px] p-[16px] flex 2xl:flex-col flex-row 2xl:items-center items-center 2xl:justify-between justify-between hover:border-keycolor1 hover:shadow-[0px_0px_12px_0px_rgba(255,135,150,0.25)] transition-all group overflow-hidden"
          >
            <h3 className="2xl:w-[172px] w-auto font-title title-light 2xl:text-[28px] text-[18px] text-subtext2 text-center font-normal group-hover:text-primary 2xl:group-hover:border-b-[3px] 2xl:group-hover:border-b-keycolor1 transition-all 2xl:pb-1 pb-0">
              병원 회원
            </h3>
            <Image
              src={hospitalImg}
              alt="병원 회원"
              width={200}
              height={200}
              className="object-contain 2xl:w-[200px] 2xl:h-[200px] w-[77px] h-[77px] 2xl:mt-[0px] mt-[24px]"
            />
          </Link>
        </div>
      </main>
    </>
  );
}
