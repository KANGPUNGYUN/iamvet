"use client";

import React from 'react';

interface FormattedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type: 'birthDate' | 'phone';
  maxLength?: number;
  disabled?: boolean;
}

export function FormattedInput({
  value,
  onChange,
  placeholder,
  className = '',
  type,
  maxLength,
  disabled = false,
}: FormattedInputProps) {
  const formatBirthDate = (input: string): string => {
    // 숫자만 추출
    const numbers = input.replace(/\D/g, '');
    
    // 최대 8자리까지만 허용 (YYYYMMDD)
    const truncated = numbers.slice(0, 8);
    
    // 기본 검증을 하면서 형식에 맞게 변환
    if (truncated.length <= 4) {
      return truncated;
    } else if (truncated.length <= 6) {
      const year = truncated.slice(0, 4);
      const month = truncated.slice(4, 6);
      
      // 월 입력 시 기본 검증 (13 이상 입력 방지)
      if (month.length === 2 && parseInt(month) > 12) {
        return `${year}-12`;
      }
      
      return `${year}-${month}`;
    } else {
      const year = truncated.slice(0, 4);
      const month = truncated.slice(4, 6);
      const day = truncated.slice(6, 8);
      
      // 월 검증
      let validMonth = month;
      if (parseInt(month) > 12) {
        validMonth = '12';
      } else if (parseInt(month) === 0) {
        validMonth = '01';
      }
      
      // 일 검증 (기본적으로 31 이상 입력 방지)
      let validDay = day;
      if (day.length === 2 && parseInt(day) > 31) {
        validDay = '31';
      } else if (day.length === 2 && parseInt(day) === 0) {
        validDay = '01';
      }
      
      return `${year}-${validMonth}-${validDay}`;
    }
  };

  const formatPhone = (input: string): string => {
    // 숫자만 추출
    const numbers = input.replace(/\D/g, '');
    
    // 최대 11자리까지만 허용
    const truncated = numbers.slice(0, 11);
    
    // 형식에 맞게 변환
    if (truncated.length <= 3) {
      return truncated;
    } else if (truncated.length <= 7) {
      return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
    } else {
      return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let formattedValue = '';

    if (type === 'birthDate') {
      formattedValue = formatBirthDate(inputValue);
    } else if (type === 'phone') {
      formattedValue = formatPhone(inputValue);
    }

    onChange(formattedValue);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (type === 'birthDate') return 'YYYY-MM-DD';
    if (type === 'phone') return '010-0000-0000';
    return '';
  };

  const getMaxLength = () => {
    if (maxLength) return maxLength;
    if (type === 'birthDate') return 10; // YYYY-MM-DD
    if (type === 'phone') return 13; // 010-0000-0000
    return undefined;
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={getPlaceholder()}
      className={`w-full px-4 py-3 border border-[#EFEFF0] rounded-[12px] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FF8796] focus:border-transparent ${
        disabled ? 'bg-[#F9F9F9] text-[#666666] cursor-not-allowed' : 'bg-white'
      } ${className}`}
      maxLength={getMaxLength()}
      disabled={disabled}
    />
  );
}

// 생년월일 전용 컴포넌트
export function BirthDateInput({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: Omit<FormattedInputProps, 'type'>) {
  return (
    <FormattedInput
      type="birthDate"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}

// 연락처 전용 컴포넌트
export function PhoneInput({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: Omit<FormattedInputProps, 'type'>) {
  return (
    <FormattedInput
      type="phone"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}