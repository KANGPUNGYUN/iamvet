import React from "react";
import { FilterBox } from "@/components/ui/FilterBox";
import { SelectBox } from "@/components/ui/SelectBox";
import { Button } from "@/components/ui/Button";

interface JobsFiltersProps {
  filters: {
    workType: string[];
    experience: string[];
    region: string;
  };
  onFilterChange: (type: keyof JobsFiltersProps["filters"], value: any) => void;
  onFilterApply: () => void;
  onFilterReset: () => void;
  className?: string;
}

const JobsFilters: React.FC<JobsFiltersProps> = ({
  filters,
  onFilterChange,
  onFilterApply,
  onFilterReset,
  className = "",
}) => {
  const regionOptions = [
    { value: "all", label: "전체" },
    { value: "seoul", label: "서울" },
    { value: "busan", label: "부산" },
    { value: "daegu", label: "대구" },
    { value: "incheon", label: "인천" },
    { value: "gwangju", label: "광주" },
    { value: "daejeon", label: "대전" },
    { value: "ulsan", label: "울산" },
    { value: "gyeonggi", label: "경기" },
    { value: "gangwon", label: "강원" },
    { value: "chungbuk", label: "충북" },
    { value: "chungnam", label: "충남" },
    { value: "jeonbuk", label: "전북" },
    { value: "jeonnam", label: "전남" },
    { value: "gyeongbuk", label: "경북" },
    { value: "gyeongnam", label: "경남" },
    { value: "jeju", label: "제주" },
  ];

  return (
    <div className={className}>
      {/* 근무 형태 */}
      <div>
        <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">근무 형태</h3>
        <FilterBox.Group
          value={filters.workType}
          onChange={(value) => onFilterChange("workType", value)}
        >
          <FilterBox value="fulltime">정규직</FilterBox>
          <FilterBox value="parttime">파트타임</FilterBox>
          <FilterBox value="contract">계약직</FilterBox>
        </FilterBox.Group>
      </div>

      {/* 경력 */}
      <div>
        <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">경력</h3>
        <FilterBox.Group
          value={filters.experience}
          onChange={(value) => onFilterChange("experience", value)}
        >
          <FilterBox value="new">신입</FilterBox>
          <FilterBox value="junior">1~3년</FilterBox>
          <FilterBox value="mid">3~5년</FilterBox>
          <FilterBox value="senior">5년 이상</FilterBox>
        </FilterBox.Group>
      </div>

      {/* 지역 */}
      <div>
        <h3 className="text-[18px] font-bold text-[#3B394D] mb-4">지역</h3>
        <SelectBox
          value={filters.region}
          onChange={(value) => onFilterChange("region", value)}
          placeholder="지역 선택"
          options={regionOptions}
        />
      </div>

      {/* 필터 적용/초기화 버튼 */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="medium"
          fullWidth
          onClick={onFilterApply}
        >
          필터 적용
        </Button>
        <Button variant="text" size="small" onClick={onFilterReset}>
          필터 초기화
        </Button>
      </div>
    </div>
  );
};

export default JobsFilters;