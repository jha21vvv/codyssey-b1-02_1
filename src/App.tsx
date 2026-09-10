import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
/*
일반적인 방식: 사용자가 첫 화면만 보려는데도 사이트에 존재하는 모든 페이지(등록폼, 상세페이지, 관리자페이지 등)의 대용량 자바스크립트 코드를 통째로 한 번에 다운로드합니다. 그래서 첫 흰 화면이 오래 멈춰 있습니다.
lazy 적용: 등록 페이지(RecruitFormPage) 코드는 서버에 남겨두고, 메인 페이지 코드만 초고속으로 다운받아 첫 화면을 즉시 띄웁니다.
Suspense 적용: 사용자가 메인 페이지에서 상단의 [공고 등록] 링크를 찰칵 클릭하는 순간, 비로소 등록 페이지 코드를 다운로드하기 시작합니다. 그 다운로드 시간(0.1초~0.5초) 동안 화면이 하얗게 멈추거나 튕기지 않도록
 <Loading message="페이지를 불러오는 중입니다..."/>라는 로딩 팻말을 잠깐 띄워주는 역할을 합니다.


1단계: 최소 껍데기만 먼저 다운로드
브라우저가 사이트에 접속하면 App.tsx와 Layout.tsx 같은 최소한의 뼈대 코드(공통 헤더, 푸터, 내비게이션 바)만 먼저 초고속으로 다운로드합니다.
이때 Home을 포함한 RecruitList, RecruitFormPage 등 5개 페이지 코드는 아직 하나도 다운받지 않고 서버에 그대로 남아 있습니다.
2단계: 주소 확인 후 Home 조각 다운로드 요청
브라우저가 주소창(/)을 확인하고 "첫 화면이 Home이네?"라고 인식합니다.
그 순간 lazy(() => import("./pages/Home"))가 실행되면서 서버에 Home 파일 조각만 따로 요청합니다.
*/

const Home = lazy(() => import("./pages/Home"));
const RecruitList = lazy(() => import("./pages/RecruitList"));
const RecruitDetail = lazy(() => import("./pages/RecruitDetail"));
const RecruitFormPage = lazy(() => import("./pages/RecruitFormPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

/*
1층: <FilterProvider> (전체 사내 방송망 연결)
가장 바깥에 있는 이유: 사이트 내의 모든 페이지(홈, 공고 목록, 검색창 등)가 이 검색/필터 방송을 들을 수 있어야 하기 때문입니다. 이 껍질 안에 들어있는 모든 컴포넌트는 "키워드 검색어"나 "플랫폼 선택값"을 공유받습니다.
사용자가 화면 상단의 검색창(<Input/>)에 "안드로이드"라고 입력하거나, 필터 드롭다운에서 "Android"를 선택합니다. 화면 안에는 검색창 컴포넌트, 공고 카드 리스트 컴포넌트, 검색 결과 개수를 표시하는 텍스트 컴포넌트가 각각 떨어져 있습니다.
Context API가 없다면: 검색창에서 입력한 "안드로이드"라는 글자를 부모로 올렸다가, 다시 리스트로 내리고, 또 개수 세는 컴포넌트로 내리는 번거로운 귓속말 전달(Props Drilling)을 해야 합니다.
이렇게 하면 장점: 페이지를 이동해도 검색 상태 유지, 상단 헤더(Layout)와의 검색창 연동, 홈 화면(Home)의 바로가기 버튼 연동(홈화면에서 "iOS 공고 모아보기"나 "Android 테스터 바로가기" 같은 퀵 링크 버튼을 클릭했을 때, 홈 컴포넌트가 필터 값을 바꿔놓고 목록 페이지로 이동시켜 해당 공고들만 즉시 보여주려)

2층: <BrowserRouter> (내비게이션 지도 켜기)
주소창의 URL(예: /recruits, /recruits/new)을 감시하고, 뒤로 가기나 링크 클릭 시 화면을 전환해 주는 라우팅 엔진을 켭니다.
이렇게 하면 장점: <BrowserRouter>: 브라우저의 기본 페이지 새로고침 동작을 차단하고, 주소창의 글자만 쓱 바꾼 뒤 필요한 본문 화면 부품만 갈아 끼웁니다. 모바일 앱처럼 0초 만에 화면이 전환, 
화면 상태를 실제 브라우저 주소와 1:1로 일치시켜 주므로, 사용자가 특정 주소를 복사해 단톡방에 공유하거나 북마크(즐겨찾기)에 등록할 수 있게 만듭
뒤로 가기를 눌렀을 때 사용자의 예상대로 직전 화면으로 돌아가게 만듭
그 자리 그대로 다시 로딩됩니다. 라우터가 없으면 무조건 첫 홈 화면으로 리셋
-- 그냥 구조자체가 현화면에서 컨토넌트만 바꾸는데 그러면 주소 이동이 없으니 생길수 있는 문제들을 해결하는 방편으로 보임.
--이게 검색 기능인데 전역 변수로 해둔 이유
검색 결과 목록에서 마음에 드는 3번 공고를 클릭해 상세 페이지(/recruits/3)로 넘어갑니다.
이 순간 리액트는 리스트 화면 컴포넌트를 컴퓨터 메모리에서 완전히 삭제(Unmount)해 버립니다.
상세 글을 다 읽고 브라우저의 [← 뒤로 가기]나 [목록으로] 버튼을 눌러 리스트로 돌아옵니다.
리스트 화면이 바닥부터 새로 만들어지면서 기존 검색어가 싹 날아가 검색창은 빈칸, 플랫폼은 전체(ALL)로 초기화됩니다. 사용자는 아까 보던 목록을 찾으려고 검색창에 또 "React"를 쳐야 합니다.

3층: <Suspense ... fallback="{<Loading"/>}> (대기실 진동벨 설치)
앞서 본 lazy로 인해 쪼개진 페이지 조각들을 서버에서 다운로드해 올 때, 네트워크 지연 시간 동안 빈 흰 화면이 뜨지 않도록 <Loading> 진동벨 화면을 보여주는 안전망입니다.
4층: <Routes>와 <Route element="{<Layout" path="/"/>}> (고정 뼈대 틀 짜기)
Layout은 상단 헤더(로고, 메뉴)와 하단 푸터처럼 모든 페이지에서 절대 바뀌지 않는 공통 껍데기입니다.
이 틀을 먼저 잡아두고, 가운데 알맹이 영역만 주소에 따라 바꿔 끼웁니다.
5층: 내부 알맹이 라우트들 (주소별 내용물 교체)
사용자가 이동하는 주소(URL)에 맞춰 알맹이 화면을 꽂아줍니다:
/ ➔ Home (메인 홈)
/recruits ➔ RecruitList (공고 목록 및 검색)
/recruits/123 ➔ RecruitDetail (123번 공고 상세 보기)
/recruits/new ➔ RecruitFormPage (새 공고 등록 폼)
/recruits/123/edit ➔ RecruitFormPage (123번 공고 수정 폼 - 등록 폼 컴포넌트 재사용)
그 외 이상한 주소(*) ➔ NotFound (404 에러 페이지)
export default로 둔 이유
리액트 프로젝트의 진입점 파일(main.tsx 또는 index.tsx)에서 이 앱 전체를 가져다 브라우저 화면(root 태그)에 처음 꽂아 넣을 때, "우리 웹사이트의 진짜 본체는 바로 이 App 컴포넌트 하나다"라고 단일 대표 규격으로 넘겨주기 위해 export default로 내보낸 것입니다.

리액트 사이트 (Single Page Application, SPA): 웹페이지 파일은 딱 하나(index.html)뿐입니다.이때 주소창에 /recruits라고 치거나 링크를 누르면, 
"어? 주소가 /recruits로 바뀌었네? 그럼 가운데에 RecruitList 부품을 꽂아라!" 하고 길을 연결해 주는 것이 바로 라우터(Router)입니다.
라우터 엔진 (<BrowserRouter>): 하는 일: 브라우저 주소창의 변화를 24시간 감시하는 '센서 엔진'입니다.
*/
export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading message="화면을 불러오는 중입니다..." />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="recruits" element={<RecruitList />} />
              <Route path="recruits/:id" element={<RecruitDetail />} />
              <Route path="recruits/new" element={<RecruitFormPage />} />
              <Route path="recruits/:id/edit" element={<RecruitFormPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </FilterProvider>
  );
}