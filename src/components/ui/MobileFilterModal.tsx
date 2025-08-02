"use client";

import React, { useState, useEffect } from "react";
import { CloseIcon, ArrowRightIcon } from "public/icons";
import { FilterBox } from "@/components/ui/FilterBox";
import { InputBox } from "@/components/ui/Input/InputBox";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Input/Checkbox";
import { regionOptions } from "@/data/regionOptions";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string[];
    regions: string[];
    minPrice: string;
    maxPrice: string;
    minArea: string;
    maxArea: string;
  };
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function MobileFilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: MobileFilterModalProps) {
  const [selectedSido, setSelectedSido] = useState<string[]>([]);
  const [activeSido, setActiveSido] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleFilterChange = (type: string, value: any) => {
    onFiltersChange({ ...filters, [type]: value });
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  const handleReset = () => {
    onReset();
    setSelectedSido([]);
    setActiveSido(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[16px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EFEFF0]">
          <div className="w-6" /> {/* Spacer */}
          <div className="w-12 h-1 bg-[#E5E5E5] rounded-full" />
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center"
          >
            <CloseIcon size="16" currentColor="#9098A4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* 지역 섹션 */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-text text-[18px] font-semibold text-[#3B394D]">
                지역
              </h3>
            </div>

            {/* 2-Column Layout: 시/도 (left) and 시군구 (right) */}
            <div className="flex h-[200px] border border-[#EFEFF0] rounded-[8px] overflow-hidden">
              {/* 시/도 선택 (왼쪽) */}
              <div className="w-1/2 bg-[#FFFFFF] border-r border-[#EFEFF0] overflow-y-auto">
                <div className="p-2 space-y-1">
                  {Object.keys(regionOptions).map((sido) => {
                    const isSelected = filters.regions.includes(sido);
                    const hasSelectedDistricts = filters.regions.some(
                      (region) => region.includes(`${sido}|`)
                    );
                    const showActive =
                      activeSido === sido || isSelected || hasSelectedDistricts;

                    return (
                      <button
                        key={sido}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] cursor-pointer transition-colors text-left ${
                          showActive
                            ? "bg-[#FFF5F5] text-[#FF6B6B]"
                            : "hover:bg-white"
                        }`}
                        onClick={() => {
                          setActiveSido(activeSido === sido ? null : sido);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-text text-[16px] font-medium">
                            {sido}
                          </span>
                          <span className="font-text text-[12px] opacity-60">
                            (
                            {
                              regionOptions[sido as keyof typeof regionOptions]
                                .length
                            }
                            )
                          </span>
                        </div>
                        <ArrowRightIcon size="14" currentColor="currentColor" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 시군구 선택 (오른쪽) */}
              <div className="w-1/2 bg-white overflow-y-auto">
                {activeSido ? (
                  <div className="p-3">
                    <div className="mb-3">
                      <h4 className="font-text text-[16px] font-semibold text-[#3B394D] border-b border-[#EFEFF0] pb-2">
                        {activeSido} 지역
                      </h4>
                    </div>

                    <div className="flex flex-col">
                      {/* 전체 선택 */}
                      <Checkbox
                        value={activeSido}
                        checked={filters.regions.includes(activeSido)}
                        onChange={(checked) => {
                          if (checked) {
                            const newRegions = filters.regions.includes(
                              activeSido
                            )
                              ? filters.regions
                              : [...filters.regions, activeSido];
                            handleFilterChange("regions", newRegions);
                          } else {
                            const districtsToRemove =
                              regionOptions[
                                activeSido as keyof typeof regionOptions
                              ];
                            const newRegions = filters.regions.filter(
                              (region) =>
                                region !== activeSido &&
                                !districtsToRemove.includes(region) &&
                                !region.startsWith(`${activeSido}|`)
                            );
                            handleFilterChange("regions", newRegions);
                          }
                        }}
                      >
                        <span className="text-[16px]">{activeSido}전체</span>
                      </Checkbox>

                      {/* 개별 시군구 */}
                      {regionOptions[
                        activeSido as keyof typeof regionOptions
                      ].map((district) => (
                        <Checkbox
                          key={district}
                          value={district}
                          checked={filters.regions.includes(
                            `${activeSido}|${district}`
                          )}
                          onChange={(checked) => {
                            const regionKey = `${activeSido}|${district}`;
                            const newRegions = checked
                              ? [...filters.regions, regionKey]
                              : filters.regions.filter((r) => r !== regionKey);
                            handleFilterChange("regions", newRegions);
                          }}
                        >
                          <span className="text-[16px]">{district}</span>
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <p className="font-text text-[13px] text-[#9098A4] mb-1">
                        지역을 선택해주세요
                      </p>
                      <p className="font-text text-[11px] text-[#CACAD2]">
                        왼쪽에서 시/도를 선택하시면 시군구를 선택할 수 있습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 카테고리 섹션 */}
          <div className="px-4 py-4 border-t border-[#EFEFF0]">
            <h3 className="font-text text-[18px] font-semibold text-[#3B394D] mb-4">
              카테고리
            </h3>

            <FilterBox.Group
              value={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
            >
              <FilterBox value="hospital">병원양도</FilterBox>
              <FilterBox value="machine">기계장치</FilterBox>
              <FilterBox value="device">의료장비</FilterBox>
              <FilterBox value="interior">인테리어</FilterBox>
            </FilterBox.Group>
          </div>

          {/* 금액 섹션 */}
          <div className="px-4 py-4 border-t border-[#EFEFF0]">
            <h3 className="font-text text-[18px] font-semibold text-[#3B394D] mb-4">
              금액
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <InputBox
                  value={filters.minPrice}
                  onChange={(value) => handleFilterChange("minPrice", value)}
                  placeholder="0"
                  suffix="만원"
                  type="number"
                  variant="default"
                />
              </div>
              <span className="text-[#9098A4] text-[16px]">-</span>
              <div className="flex-1">
                <InputBox
                  value={filters.maxPrice}
                  onChange={(value) => handleFilterChange("maxPrice", value)}
                  placeholder="0"
                  suffix="만원"
                  type="number"
                  variant="default"
                />
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-[#EFEFF0]">
            <h4 className="font-text text-[18px] font-semibold text-[#3B394D] mb-4">
              평수
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <InputBox
                  value={filters.minArea}
                  onChange={(value) => handleFilterChange("minArea", value)}
                  placeholder="0"
                  suffix="평"
                  type="number"
                  variant="default"
                />
              </div>
              <span className="text-[#9098A4] text-[16px]">-</span>
              <div className="flex-1">
                <InputBox
                  value={filters.maxArea}
                  onChange={(value) => handleFilterChange("maxArea", value)}
                  placeholder="0"
                  suffix="평"
                  type="number"
                  variant="default"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EFEFF0] bg-white">
          <Button
            variant="default"
            size="medium"
            onClick={handleApply}
            fullWidth={true}
            className="max-w-none"
          >
            필터 적용
          </Button>
          <button
            onClick={handleReset}
            className="font-text text-[16px] text-[#9098A4] underline mt-[26px] text-[16px] w-full text-left block"
          >
            필터 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
