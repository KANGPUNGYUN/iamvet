// Validation and formatting utilities for ResumePage

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/[^\d]/g, '');
  
  // Apply formatting based on length
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else {
    // Limit to 11 digits (standard Korean phone number)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

export const formatBirthDate = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/[^\d]/g, '');
  
  // Apply formatting: YYYY-MM-DD
  if (numbers.length <= 4) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
  } else {
    // Limit to 8 digits (YYYYMMDD)
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  }
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: false, message: '휴대폰 번호를 입력해주세요.' };
  }
  
  const numbers = phone.replace(/[^\d]/g, '');
  
  if (numbers.length < 10 || numbers.length > 11) {
    return { isValid: false, message: '올바른 휴대폰 번호를 입력해주세요. (10-11자리)' };
  }
  
  // Korean phone number pattern validation
  const phonePattern = /^(01[016789])-?[0-9]{3,4}-?[0-9]{4}$/;
  if (!phonePattern.test(numbers)) {
    return { isValid: false, message: '올바른 휴대폰 번호 형식이 아닙니다.' };
  }
  
  return { isValid: true };
};

export const validateBirthDate = (birthDate: string): { isValid: boolean; message?: string } => {
  if (!birthDate) {
    return { isValid: false, message: '생년월일을 입력해주세요.' };
  }
  
  const numbers = birthDate.replace(/[^\d]/g, '');
  
  if (numbers.length !== 8) {
    return { isValid: false, message: '생년월일을 8자리로 입력해주세요. (YYYYMMDD)' };
  }
  
  const year = parseInt(numbers.slice(0, 4));
  const month = parseInt(numbers.slice(4, 6));
  const day = parseInt(numbers.slice(6, 8));
  
  const currentYear = new Date().getFullYear();
  
  if (year < 1900 || year > currentYear) {
    return { isValid: false, message: '올바른 연도를 입력해주세요.' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, message: '올바른 월을 입력해주세요. (01-12)' };
  }
  
  if (day < 1 || day > 31) {
    return { isValid: false, message: '올바른 일을 입력해주세요. (01-31)' };
  }
  
  // Check if date is valid (handles February, leap years, etc.)
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { isValid: false, message: '존재하지 않는 날짜입니다.' };
  }
  
  // Check if birth date is not in the future
  if (date > new Date()) {
    return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }
  
  return { isValid: true };
};

// Number formatting utilities
export const formatNumberWithCommas = (value: string | number): string => {
  if (!value) return '';
  
  // Convert to string and remove all non-numeric characters except decimal point
  const str = String(value).replace(/[^\d.]/g, '');
  
  // Split by decimal point to handle decimal numbers
  const parts = str.split('.');
  
  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join back with decimal point if there was one
  return parts.join('.');
};

export const parseNumberFromCommaString = (value: string): number => {
  if (!value) return 0;
  
  // Remove commas and convert to number
  const cleanValue = value.replace(/,/g, '');
  return Number(cleanValue) || 0;
};

export const handleNumberInputChange = (
  value: string,
  onChange: (value: string) => void
): void => {
  // Remove commas, validate numeric input, reformat with commas
  const numericValue = value.replace(/[^0-9]/g, '');
  const formattedValue = formatNumberWithCommas(numericValue);
  onChange(formattedValue);
};