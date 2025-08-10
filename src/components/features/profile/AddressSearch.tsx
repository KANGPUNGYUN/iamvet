"use client";

import React, { useState } from "react";
import { InputBox } from "@/components/ui/Input/InputBox";

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressSearchProps {
  address?: string;
  detailAddress?: string;
  onAddressChange?: (address: string) => void;
  onDetailAddressChange?: (detailAddress: string) => void;
  disabled?: boolean;
  className?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  address = "",
  detailAddress = "",
  onAddressChange,
  onDetailAddressChange,
  disabled = false,
  className = "",
}) => {
  // Daum Postcode API 스크립트 로드
  const loadDaumPostcodeScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.daum && window.daum.Postcode) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error("Daum postcode script loading failed");
        resolve(false);
      };
      document.head.appendChild(script);
    });
  };

  const handleAddressSearch = async () => {
    if (disabled) return;

    const scriptLoaded = await loadDaumPostcodeScript();
    if (!scriptLoaded) {
      alert("주소 검색 서비스를 불러올 수 없습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let addr = ""; // 주소 변수
        let extraAddr = ""; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        const fullAddress = addr + extraAddr;
        onAddressChange?.(fullAddress);
      },
      width: "100%",
      height: "100%",
    }).open({
      popupTitle: "주소 검색",
      popupKey: "addressSearch",
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 주소 검색 */}
      <div>
        <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
          주소
        </label>
        <InputBox
          value={address}
          onChange={onAddressChange || (() => {})}
          placeholder="주소를 검색해주세요"
          readOnly
          clearable={false}
          duplicateCheck={{
            buttonText: "주소 찾기",
            onCheck: handleAddressSearch,
            isChecking: false,
            isValid: false,
          }}
        />
      </div>

      {/* 상세 주소 */}
      <div>
        <label className="block text-[20px] font-medium text-[#3B394D] mb-3">
          상세 주소
        </label>
        <InputBox
          value={detailAddress}
          onChange={onDetailAddressChange || (() => {})}
          placeholder="상세 주소를 입력해주세요"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
