export default function MarketingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          마케팅 정보 수신 동의
        </h1>
        <div className="text-gray-600">
          <span>시행일자: 2025.09.22</span>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">목차</h2>
        <ol className="space-y-2">
          <li>
            <a href="#purpose" className="text-[#FF8796] hover:underline">
              1. 수집 목적
            </a>
          </li>
          <li>
            <a href="#items" className="text-[#FF8796] hover:underline">
              2. 수집 항목
            </a>
          </li>
          <li>
            <a href="#period" className="text-[#FF8796] hover:underline">
              3. 보유 및 이용 기간
            </a>
          </li>
          <li>
            <a href="#methods" className="text-[#FF8796] hover:underline">
              4. 마케팅 정보 제공 방법
            </a>
          </li>
          <li>
            <a href="#rights" className="text-[#FF8796] hover:underline">
              5. 동의 철회 권리
            </a>
          </li>
          <li>
            <a href="#consequences" className="text-[#FF8796] hover:underline">
              6. 동의 거부시 불이익
            </a>
          </li>
          <li>
            <a href="#contact" className="text-[#FF8796] hover:underline">
              7. 문의처
            </a>
          </li>
        </ol>
      </div>

      <div className="space-y-8">
        <section>
          <p className="text-gray-700 mb-6">
            IAMVET는 개인정보보호법 제22조 제4항에 의해 귀하의 동의를 받아
            마케팅 목적으로 개인정보를 처리하고 있습니다. 다음의 내용을 자세히
            읽어보신 후 동의 여부를 결정해 주시기 바랍니다.
          </p>
        </section>

        <section id="purpose">
          <h3 className="text-xl font-semibold mb-4">1. 수집 목적</h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 다음의 목적을 위하여 개인정보를 수집·이용합니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>신규 서비스 및 이벤트 정보 제공</li>
            <li>맞춤형 광고 및 마케팅 정보 제공</li>
            <li>서비스 개선을 위한 설문조사 참여 요청</li>
            <li>프로모션 및 할인 혜택 안내</li>
            <li>뉴스레터 및 정기 소식 발송</li>
            <li>수의학 관련 전문 정보 및 트렌드 제공</li>
          </ul>
        </section>

        <section id="items">
          <h3 className="text-xl font-semibold mb-4">2. 수집 항목</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">개인식별정보</h4>
            <ul className="list-disc ml-6 space-y-1 text-gray-700 mb-4">
              <li>이름, 이메일 주소, 휴대폰 번호</li>
              <li>회원 유형 (수의사, 병원, 수의대생)</li>
              <li>관심 분야 및 전문 영역</li>
            </ul>

            <h4 className="font-semibold mb-2">서비스 이용 정보</h4>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>서비스 이용 기록 및 패턴</li>
              <li>관심 컨텐츠 및 검색 기록</li>
              <li>구매 및 결제 이력</li>
              <li>이벤트 참여 이력</li>
            </ul>
          </div>
        </section>

        <section id="period">
          <h3 className="text-xl font-semibold mb-4">3. 보유 및 이용 기간</h3>
          <p className="text-gray-700 mb-4">
            마케팅 정보 수신 동의일로부터 동의 철회 시 또는 회원 탈퇴 시까지
            보유·이용됩니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>동의 철회 요청 시: 즉시 삭제</li>
            <li>회원 탈퇴 시: 탈퇴와 동시에 삭제</li>
            <li>휴면계정 전환 시: 별도 분리 보관 후 3년 경과 시 삭제</li>
          </ul>
        </section>

        <section id="methods">
          <h3 className="text-xl font-semibold mb-4">
            4. 마케팅 정보 제공 방법
          </h3>
          <p className="text-gray-700 mb-4">
            다음의 방법을 통해 마케팅 정보를 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">이메일</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 뉴스레터 발송</li>
                <li>• 이벤트 및 프로모션 안내</li>
                <li>• 신규 서비스 알림</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">SMS/MMS</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 긴급 이벤트 알림</li>
                <li>• 할인 쿠폰 발송</li>
                <li>• 중요 공지사항</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-800">앱 푸시</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 실시간 알림</li>
                <li>• 맞춤 정보 제공</li>
                <li>• 이벤트 참여 알림</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-800">전화</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• 중요 서비스 안내</li>
                <li>• 설문조사 참여 요청</li>
                <li>• 고객 만족도 조사</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="rights">
          <h3 className="text-xl font-semibold mb-4">5. 동의 철회 권리</h3>
          <p className="text-gray-700 mb-4">
            귀하는 언제든지 마케팅 정보 수신 동의를 철회할 수 있습니다.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold mb-2">철회 방법</h4>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>
                웹사이트: 마이페이지 &gt; 개인정보 설정 &gt; 마케팅 수신 동의
                해제
              </li>
              <li>
                이메일: 수신 거부 링크 클릭 또는 contact@iamvet.co.kr로 요청
              </li>
              <li>SMS: 수신 거부 번호로 답장 또는 080-0000-0000으로 전화</li>
              <li>고객센터: 1588-0000 (평일 09:00-18:00)</li>
            </ul>
          </div>
        </section>

        <section id="consequences">
          <h3 className="text-xl font-semibold mb-4">6. 동의 거부시 불이익</h3>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-800 font-semibold mb-2">
              동의 거부에 따른 제한 사항
            </p>
            <ul className="list-disc ml-6 space-y-1 text-red-700">
              <li>신규 서비스 및 이벤트 정보를 받아보실 수 없습니다</li>
              <li>할인 혜택 및 프로모션 정보를 놓치실 수 있습니다</li>
              <li>맞춤형 콘텐츠 추천 서비스가 제한됩니다</li>
            </ul>
            <p className="text-red-700 mt-3 text-sm">
              ※ 단, IAMVET의 기본 서비스 이용에는 제한이 없습니다.
            </p>
          </div>
        </section>

        <section id="contact">
          <h3 className="text-xl font-semibold mb-4">7. 문의처</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              마케팅 정보 수신 동의와 관련하여 문의사항이 있으시면 아래로 연락해
              주시기 바랍니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">개인정보 보호책임자</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>성명: 개인정보보호팀</li>
                  <li>이메일: privacy@iamvet.co.kr</li>
                  <li>전화: 1588-0000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">고객센터</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>이메일: contact@iamvet.co.kr</li>
                  <li>전화: 1588-0000</li>
                  <li>운영시간: 평일 09:00-18:00</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">
            중요 안내
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>
              • 마케팅 정보 수신 동의는 선택사항이며, 동의하지 않으셔도 서비스
              이용이 가능합니다.
            </li>
            <li>
              • 동의 후에도 언제든지 철회하실 수 있으며, 철회 시 즉시
              처리됩니다.
            </li>
            <li>• 개인정보는 수집 목적 달성 후 지체없이 파기됩니다.</li>
            <li>
              • 보다 자세한 개인정보 처리방침은{" "}
              <a href="/privacy" className="underline hover:text-blue-900">
                개인정보처리방침
              </a>
              에서 확인하실 수 있습니다.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
