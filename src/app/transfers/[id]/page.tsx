"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  LocationIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
} from "public/icons";
import { Tag } from "@/components/ui/Tag";
import { allTransferData } from "@/data/transfersData";
import transfer1Img from "@/assets/images/transfer/transfer1.jpg";
import transfer2Img from "@/assets/images/transfer/transfer2.jpg";
import transfer3Img from "@/assets/images/transfer/transfer3.jpg";
import transfer4Img from "@/assets/images/transfer/transfer4.jpg";
import transfer5Img from "@/assets/images/transfer/transfer5.jpg";
import transfer6Img from "@/assets/images/transfer/transfer6.jpg";
import transfer7Img from "@/assets/images/transfer/transfer7.jpg";
import transfer8Img from "@/assets/images/transfer/transfer8.jpg";
import profileImg from "@/assets/images/profile.png";
import { Footer, Header } from "@/components";
import NaverMap from "@/components/NaverMap";
import TransferCard from "@/components/ui/TransferCard/TransferCard";

// 이미지 슬라이더 컴포넌트
const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full">
      {/* 메인 이미지 */}
      <div className="relative w-full h-full max-w-[970px] lg:h-[646px] min-h-[310px] rounded-[8px] bg-gray-100 overflow-hidden mb-4">
        <Image
          src={images[currentIndex]}
          alt={`슬라이드 ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* 썸네일 목록과 네비게이션 */}
      <div className="flex items-center gap-3 justify-center">
        {/* 이전 버튼 */}
        <button
          onClick={goToPrevious}
          className="hover:bg-gray-100 rounded-full transition-colors"
          disabled={images.length <= 1}
        >
          <ChevronLeftIcon size="32" currentColor="#CACAD2" />
        </button>

        {/* 썸네일 목록 */}
        <div className="flex gap-2 overflow-x-auto justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 lg:w-[133px] lg:h-[133px] w-[80px] h-[80px] rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? "border-[#ff8796]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`썸네일 ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={goToNext}
          className="hover:bg-gray-100 rounded-full transition-colors"
          disabled={images.length <= 1}
        >
          <ChevronRightIcon size="32" currentColor="#CACAD2" />
        </button>
      </div>
    </div>
  );
};

export default function TransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { id } = use(params);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // 실제 데이터에서 ID로 찾기 (임시로 첫 번째 데이터 사용)
  const transferData =
    allTransferData.find((item) => item.id.toString() === id) ||
    allTransferData[0];

  // 임시 슬라이더 이미지들
  const sliderImages = [
    transfer1Img.src,
    transfer2Img.src,
    transfer3Img.src,
    transfer4Img.src,
    transfer5Img.src,
    transfer6Img.src,
  ];

  // 임시 작성자 정보
  const author = {
    name: "베디닥",
    profileImage: null, // null이면 기본 이미지 사용
  };

  // 추천 카드 데이터 (현재 아이템 제외)
  const recommendedTransfers = allTransferData.filter(
    (item) => item.id.toString() !== id
  );

  // 카드 슬라이드 관련 계산
  const cardsPerView = 3; // 한 번에 보이는 카드 개수
  const cardWidth = 320; // 카드 너비 (350px에서 여백 고려)
  const cardGap = 20; // 카드 간 간격
  const slideWidth = cardWidth + cardGap; // 슬라이드 당 이동 거리
  const maxSlides = Math.max(
    0,
    Math.ceil(recommendedTransfers.length / cardsPerView) - 1
  );

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(maxSlides, prev + 1));
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="min-h-screen bg-white">
        <div className="max-w-[1095px] mx-auto pt-[20px] pb-[140px]">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/transfers"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon currentColor="currentColor" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVerticalIcon size="28" currentColor="currentColor" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-[130px] bg-white border rounded-lg shadow-lg z-10">
                  <Link
                    href={`/transfers/${id}/edit`}
                    className="flex justify-center items-center px-[20px] py-[10px] text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <EditIcon size="24" currentColor="currentColor" />
                    <span className="ml-2">수정하기</span>
                  </Link>
                  <button className="flex justify-center items-center w-full px-[20px] py-[10px] text-sm text-[#ff8796] hover:bg-gray-50">
                    <TrashIcon currentColor="currentColor" />
                    <span className="ml-2">삭제하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <section className="p-[60px] border-[1px] border-[#EFEFF0] rounded-[20px]">
            {/* 카테고리 태그 */}
            <div className="flex justify-between">
              <Tag variant={1}>양수양도</Tag>

              <div
                className="flex items-center justify-end cursor-pointer w-[59px]"
                onClick={handleBookmarkClick}
              >
                <div className="flex items-center justify-center cursor-pointer">
                  {isBookmarked ? (
                    <BookmarkFilledIcon currentColor="var(--Keycolor1)" />
                  ) : (
                    <BookmarkIcon currentColor="var(--Subtext2)" />
                  )}
                </div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className="font-text text-[32px] text-bold text-primary mt-[10px]">
              {transferData.title}
            </h1>

            {/* 위치 */}
            <div className="flex items-center gap-4 mt-[10px] text-gray-600">
              <div className="flex items-center gap-1">
                <LocationIcon currentColor="currentColor" />
                <span className="text-[16px] font-text text-sub">
                  {transferData.location}
                </span>
              </div>
            </div>

            {/* 작성자 정보 */}
            <div className="flex items-center justify-between mt-[38px] mb-[66px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-full overflow-hidden">
                  <Image
                    src={author.profileImage || profileImg}
                    alt="프로필 이미지"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="font-medium text-gray-900">{author.name}</span>
              </div>
              <div className="flex items-center gap-[33px]">
                <div className="flex items-center gap-1">
                  <EyeIcon currentColor="currentColor" />
                  <span className="text-sm">{transferData.views}</span>
                </div>
                <span className="text-sm">{transferData.date}</span>
              </div>
            </div>

            {/* 이미지 슬라이더 */}
            <div className="mb-8">
              <ImageSlider images={sliderImages} />
            </div>

            {/* 가격 정보 */}
            <div className="mt-[50px] border-t-[1px] border-t-[#EFEFF0] pt-[50px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-title text-[20px] title-light text-primary">
                    가격
                  </span>
                  <p className="font-text text-[32px] text-bold text-key1">
                    {transferData.price}
                  </p>
                </div>
                <div>
                  <span className="font-title text-[20px] title-light text-primary">
                    평수
                  </span>
                  <p className="font-text text-[32px] text-nomal text-sub">
                    {transferData.area}m² (44평)
                  </p>
                </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="mt-[50px] flex flex-col gap-[20px]">
              <h2 className="font-title text-[20px] title-light text-primary">
                상세 설명
              </h2>
              <div className="prose max-w-none">
                <p className="font-text text-[16px] text-light text-sub">
                  강남구 역삼동에 위치한 병원을 양도합니다. 지하철 2호선
                  역삼역에서 도보 5분 거리에 위치하여 접근성이 매우 좋습니다.
                  2023년에 전체 리모델링을 완료하여 내부 시설이 매우 깨끗하고
                  현대적입니다. 총 3개의 진료실과 1개의 처치실이 있으며, X-ray
                  장비와 초음파 기기를 보유하고 있습니다. 현재 내과로 운영
                  중이나 다른 과로 변경하여 운영 가능합니다. 기존 환자
                  데이터베이스 인계 가능하며, 숙련된 간호사 2명이 계속 근무
                  가능합니다. 개인 사정으로 인해 빠른 양도를 원하며, 인테리어와
                  장비 모두 포함된 가격입니다. 관심 있으신 분들은 문의
                  부탁드립니다. 월 평균 환자 : 약 800명 월 평균 매출 : 약
                  5,000만원 운영 시간 : 평일 9:00 - 18:00 / 토요일 9:00 - 13:00
                  주변 환경 : 대형 오피스 빌딩 주거 단지 인접
                </p>
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="mt-[50px] border-t-[1px] border-t-[#EFEFF0] pt-[50px]">
              <h2 className="font-title text-[20px] title-light text-primary mb-[20px]">
                위치 정보
              </h2>
              <NaverMap location={transferData.location} height="265px" />
              <p className="font-text text-[16px] text-light mt-[20px] text-sub">
                서울 관악구 관악로 1 서울대학교 수의과대학 85동 401-1호
              </p>
            </div>
          </section>

          {/* 추천 양수양도 섹션 */}
          <section className="mt-[100px]">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              {/* 왼쪽 화살표 버튼 */}
              <button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                className={`transition-colors ${
                  currentSlide === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <ChevronLeftIcon size="48" currentColor="#9098A4" />
              </button>

              {/* 콘텐츠 영역 */}
              <div
                style={{
                  display: "flex",
                  width: "1000px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                {/* 제목 */}
                <h2 className="font-title text-[20px] title-light text-primary">
                  다른 매물 둘러보기
                </h2>

                {/* 추천 카드 리스트 */}
                <div className="w-full overflow-hidden">
                  <div
                    id="recommended-transfers"
                    className="flex gap-[20px] transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        currentSlide * cardsPerView * slideWidth
                      }px)`,
                      width: `${recommendedTransfers.length * slideWidth}px`,
                    }}
                  >
                    {recommendedTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex-shrink-0 w-[320px]"
                      >
                        <TransferCard
                          id={transfer.id}
                          title={transfer.title}
                          location={transfer.location}
                          hospitalType={transfer.hospitalType}
                          area={transfer.area}
                          price={transfer.price}
                          date={transfer.date}
                          views={transfer.views}
                          imageUrl={transfer.imageUrl}
                          categories={transfer.categories}
                          isAd={transfer.isAd}
                          isLiked={transfer.isLiked}
                          onLike={() => {
                            // 좋아요 기능 구현
                            console.log("좋아요:", transfer.id);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽 화살표 버튼 */}
              <button
                onClick={handleNextSlide}
                disabled={currentSlide >= maxSlides}
                className={`transition-colors ${
                  currentSlide >= maxSlides
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <ChevronRightIcon size="48" currentColor="#9098A4" />
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
