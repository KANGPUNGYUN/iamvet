export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          개인정보 취급방침
        </h1>
        <div className="text-gray-600">
          <span>시행일자: 2025.09.22</span>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">목차</h2>
        <ol className="space-y-2">
          <li>
            <a href="#article1" className="text-[#FF8796] hover:underline">
              제 1조 (개인정보의 처리 목적)
            </a>
          </li>
          <li>
            <a href="#article2" className="text-[#FF8796] hover:underline">
              제 2조 (개인정보의 처리 및 보유 기간)
            </a>
          </li>
          <li>
            <a href="#article3" className="text-[#FF8796] hover:underline">
              제 3조 (개인정보의 제3자 제공)
            </a>
          </li>
          <li>
            <a href="#article4" className="text-[#FF8796] hover:underline">
              제 4조 (개인정보처리 위탁)
            </a>
          </li>
          <li>
            <a href="#article5" className="text-[#FF8796] hover:underline">
              제 5조 (정보주체의 권리·의무 및 행사방법)
            </a>
          </li>
          <li>
            <a href="#article6" className="text-[#FF8796] hover:underline">
              제 6조 (처리하는 개인정보의 항목)
            </a>
          </li>
          <li>
            <a href="#article7" className="text-[#FF8796] hover:underline">
              제 7조 (개인정보의 파기)
            </a>
          </li>
          <li>
            <a href="#article8" className="text-[#FF8796] hover:underline">
              제 8조 (개인정보의 안전성 확보조치)
            </a>
          </li>
          <li>
            <a href="#article9" className="text-[#FF8796] hover:underline">
              제 9조 (개인정보 보호책임자)
            </a>
          </li>
          <li>
            <a href="#article10" className="text-[#FF8796] hover:underline">
              제 10조 (권익침해 구제방법)
            </a>
          </li>
          <li>
            <a href="#article11" className="text-[#FF8796] hover:underline">
              제 11조 (개인정보 처리방침 변경)
            </a>
          </li>
        </ol>
      </div>

      <div className="space-y-8">
        <section>
          <p className="text-gray-700 mb-6">
            IAMVET는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을
            보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록
            다음과 같은 처리방침을 두고 있습니다.
          </p>
        </section>

        <section id="article1">
          <h3 className="text-xl font-semibold mb-4">
            제 1조 (개인정보의 처리 목적)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
            개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
            변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등
            필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>홈페이지 회원가입 및 관리</li>
            <li>재화 또는 서비스 제공</li>
            <li>마케팅 및 광고에의 활용</li>
            <li>민원사무 처리</li>
          </ul>
        </section>

        <section id="article2">
          <h3 className="text-xl font-semibold mb-4">
            제 2조 (개인정보의 처리 및 보유 기간)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
            개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
            개인정보를 처리·보유합니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>홈페이지 회원가입 및 관리: 사업자/단체 홈페이지 탈퇴 시까지</li>
            <li>
              재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산
              완료시까지
            </li>
            <li>민원사무 처리: 민원사무 처리 완료 시까지</li>
          </ul>
        </section>

        <section id="article3">
          <h3 className="text-xl font-semibold mb-4">
            제 3조 (개인정보의 제3자 제공)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법
            제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
            제공합니다.
          </p>
        </section>

        <section id="article4">
          <h3 className="text-xl font-semibold mb-4">
            제 4조 (개인정보처리 위탁)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
            처리업무를 위탁하고 있습니다.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">1. AWS (Amazon Web Services)</h4>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>위탁업무 내용: 클라우드 서비스 제공</li>
              <li>위탁기간: 회원탈퇴시 혹은 위탁계약 종료시까지</li>
            </ul>
          </div>
        </section>

        <section id="article5">
          <h3 className="text-xl font-semibold mb-4">
            제 5조 (정보주체의 권리·의무 및 행사방법)
          </h3>
          <p className="text-gray-700 mb-4">
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>개인정보 처리현황 통지요구</li>
            <li>개인정보 열람요구</li>
            <li>개인정보 정정·삭제요구</li>
            <li>개인정보 처리정지요구</li>
          </ul>
        </section>

        <section id="article6">
          <h3 className="text-xl font-semibold mb-4">
            제 6조 (처리하는 개인정보의 항목)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 다음의 개인정보 항목을 처리하고 있습니다.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">필수항목</h4>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>이메일, 전화번호</li>
              <li>성명, 생년월일</li>
              <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
            </ul>
            <h4 className="font-semibold mb-2 mt-4">선택항목</h4>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              <li>프로필 사진</li>
              <li>병원 정보 (병원 회원의 경우)</li>
              <li>수의사 면허 정보 (수의사 회원의 경우)</li>
            </ul>
          </div>
        </section>

        <section id="article7">
          <h3 className="text-xl font-semibold mb-4">
            제 7조 (개인정보의 파기)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
            불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져
              내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시
              파기됩니다.
            </li>
            <li>
              파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
              방법을 사용합니다.
            </li>
          </ul>
        </section>

        <section id="article8">
          <h3 className="text-xl font-semibold mb-4">
            제 8조 (개인정보의 안전성 확보조치)
          </h3>
          <p className="text-gray-700 mb-4">
            IAMVET는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에
            필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>개인정보 취급 직원의 최소화 및 교육</li>
            <li>개인정보에 대한 접근 제한</li>
            <li>개인정보의 암호화</li>
            <li>접속기록의 보관 및 위변조 방지</li>
            <li>개인정보에 대한 접근통제 시스템 설치</li>
          </ul>
        </section>

        <section id="article9">
          <h3 className="text-xl font-semibold mb-4">
            제 9조 (개인정보 보호책임자)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              IAMVET는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div>
              <h4 className="font-semibold mb-2">개인정보 보호책임자</h4>
              <ul className="space-y-1 text-gray-700">
                <li>성명: 개인정보보호팀</li>
                <li>연락처: contact@iamvet.co.kr</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="article10">
          <h3 className="text-xl font-semibold mb-4">
            제 10조 (권익침해 구제방법)
          </h3>
          <p className="text-gray-700 mb-4">
            정보주체는 개인정보침해로 인한 구제를 받기 위하여
            개인정보분쟁조정위원회, 개인정보침해신고센터 등에 분쟁해결이나 상담
            등을 신청할 수 있습니다.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>
              개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)
            </li>
            <li>개인정보침해신고센터: (국번없이) privacy.go.kr</li>
            <li>대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</li>
          </ul>
        </section>

        <section id="article11">
          <h3 className="text-xl font-semibold mb-4">
            제 11조 (개인정보 처리방침 변경)
          </h3>
          <p className="text-gray-700">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
            변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
            전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>
      </div>
    </main>
  );
}
