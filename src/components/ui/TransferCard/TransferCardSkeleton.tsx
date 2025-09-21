export const TransferCardSkeleton = () => {
  return (
    <div className="w-full bg-white hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer rounded-[16px] animate-pulse">
      {/* 이미지 스켈레톤 - TransferCard와 동일한 h-48 */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {/* 카테고리 태그 위치 */}
        <div className="absolute top-4 left-4">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* 좋아요 버튼 위치 */}
        <div className="absolute top-[12px] right-[12px] w-[28px] h-[28px] rounded-full bg-gray-300"></div>
      </div>

      {/* 콘텐츠 스켈레톤 - TransferCard와 동일한 p-[12px] */}
      <div className="p-[12px] space-y-3">
        {/* 제목 - TransferCard와 동일한 높이 (text-[18px]) */}
        <div className="h-[27px] bg-gray-200 rounded w-3/4"></div>
        
        {/* 병원 정보 (위치와 평수) */}
        <div className="mb-3">
          <div className="h-[20px] bg-gray-200 rounded w-1/2 mb-1"></div>
        </div>
        
        {/* 가격 - 오른쪽 정렬, TransferCard와 동일한 높이 (text-[20px]) */}
        <div className="mb-2 text-end">
          <div className="h-[30px] bg-gray-200 rounded w-24 ml-auto"></div>
        </div>
        
        {/* 등록일과 조회수 */}
        <div className="flex items-center justify-between">
          <div className="h-[20px] bg-gray-200 rounded w-16"></div>
          <div className="h-[20px] bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

