import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecruits } from "../hooks/useRecruits";
import { useFilter } from "../context/FilterContext";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import Input from "../components/Input";

export default function RecruitList() {
  const { data: recruits, loading, error, refetch } = useRecruits();  // 딴데서 익스포트 된 useRecruits()를 가져와서 data, loading, error, refetch를 구조분해 할당 
  const { platformFilter, setPlatformFilter, searchTerm, setSearchTerm } = useFilter(); // 콘텍스트에 있는 useFilter()를 가져와서 platformFilter, setPlatformFilter, searchTerm, setSearchTerm를 구조분해 할당
  const navigate = useNavigate();

  const filteredRecruits = useMemo(() => {
    return (recruits || []).filter((item) => {
      const matchesPlatform = platformFilter === "All" || item.platform === platformFilter;  // 올이나, 특정 플렛폼을 누른 상황이면 matchesPlatform은 트루가 되는 구조
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || //서치 텀에서 전부 소문자로 바꿔서 해다 ㅇ내용있는지 확인하고, 내용이 없으면 false를 반환
                            item.content?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [recruits, platformFilter, searchTerm]);

  if (loading) return <Loading message="테스터 모집 공고를 불러오는 중입니다..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const platforms = [
    { label: "전체", value: "All" },
    { label: "Android", value: "Android" },
    { label: "iOS", value: "iOS" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">테스터 모집 공고</h1>
          <p className="text-sm text-gray-500">필터를 통해 원하는 플랫폼의 공고를 빠르게 찾아보세요.</p>
        </div>
        <Link
          to="/recruits/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
        >
          공고 등록하기
        </Link>
      </div>

      {/* 검색 및 필터 UI */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2">
          {platforms.map((p) => (
            <button
              key={p.value}
              onClick={() => setPlatformFilter(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                platformFilter === p.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="제목이나 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  //글자 입력시 이벤트로 그  입력값을 이벤트 타겟벨류로 데려온 상황. 이걸로 바로 검색하는 실시간 방식
          />
        </div>
      </div>

      {/* 목록 리스트 */}
      {filteredRecruits.length === 0 ? (
        <EmptyState
          message="조건에 맞는 공고가 없습니다."
          actionLabel="공고 등록하러 가기"
          onAction={() => navigate("/recruits/new")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRecruits.map((item) => (
            <Link
              key={item.id}
              to={`/recruits/${item.id}`}
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start mb-2">
                <Badge color={item.platform === "iOS" ? "purple" : "green"}>
                  {item.platform || "전체"}
                </Badge>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()} 
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.content}</p>
              <div className="text-xs font-semibold text-blue-600">
                보상: {item.reward || "무료 참여"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
//toLocaleDateString은 그냥 날짜 이쁘게 바꿔주는 역할
/*
[ 외부 데이터 및 상태 소스 ]
  ├── useRecruits()    ──▶ recruits (전체 목록), loading, error, refetch
  └── useFilter()       ──▶ platformFilter ("All" | "Android" | "iOS"), searchTerm ("검색어")
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ [1단계: 사전 방어선 (Early Return 분기)]                      │
│                                                             │
│   ├── loading === true  ──▶  <Loading />                    │
│   └── error !== null    ──▶  <ErrorState onRetry={refetch}/>│
└──────────────────────────┬──────────────────────────────────┘
                           │ (정상 로딩 완료 시 통과)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ [2단계: 실시간 필터링 연산 파이프라인]                         │
│                                                             │
│   useMemo (원본 recruits)                                   │
│     ├── 1. 플랫폼 일치 여부 (item.platform === platformFilter)│
│     └── 2. 키워드 포함 여부 (item.title / content.includes) │
│            │                                                │
│            ▼                                                │
│     = filteredRecruits (실제 보여줄 정제된 배열)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ [3단계: 메인 레이아웃 렌더링]                                 │
│                                                             │
│   ├── [Header] 제목 + [공고 등록하기] 버튼 (/recruits/new)  │
│   ├── [Control Bar] 플랫폼 탭 버튼들 + 검색창 (<Input />)   │
│   │                                                         │
│   └── [Content Area] (조건부 렌더링)                        │
│         ├── filteredRecruits.length === 0                   │
│         │     └──▶ <EmptyState /> ("조건에 맞는 공고 없음") │
│         │                                                   │
│         └── filteredRecruits.length > 0                     │
│               └──▶ Grid (2열 카드 리스트)                   │
│                      ├── <Badge /> (플랫폼 색상 구분)        │
│                      ├── 날짜 / 제목 / 내용 요약            │
│                      └── 보상 (reward) 표시                 │
└─────────────────────────────────────────────────────────────┘

1.단계: 배송 트럭 부르기 (loading)

매장 문을 엽니다. 아직 빵이 없습니다.

기사님(useRecruits)이 창고로 빵을 가지러 출발합니다.

트럭이 올 때까지 매장 문앞에 "지금 신선한 빵을 가져오는 중입니다..."라는 안내판(Loading)을 걸어둡니다.

2단계: 빵 도착 혹은 배달 사고 (error & refetch)

만약 배달 사고가 났다면? (error)

손님에게 "배달 중 문제가 생겼습니다" 안내판(ErrorState)을 보여줍니다.

이때 안내판 옆에 [다시 배송 요청] 버튼(onRetry={refetch})을 둡니다. 이 버튼을 누르면 기사님에게 무전을 쳐서 다시 트럭을 출발시킵니다.

무사히 도착했다면?

트럭에서 빵 상자(recruits)를 내려 매장 안으로 들여옵니다.

3단계: 손님 취향에 맞게 선별하기 (useMemo)

트럭에서 내린 상자 안에는 온갖 빵(전체 공고)이 섞여 있습니다.

손님이 말합니다.

"저는 'Android' 맛 빵만 보고 싶고요, 이름에 '베타'라고 적힌 빵만 찾아요!" (platformFilter, searchTerm)

점장님은 트럭을 다시 본사로 보낼 필요가 전혀 없습니다.

이미 받아둔 상자(recruits)를 그 자리에서 뒤적여서, 손님이 말한 조건에 맞는 빵만 쟁반에 착착 골라냅니다.

이것이 바로 useMemo입니다!

손님이 조건을 바꿀 때마다 본사에 다시 전화할 필요 없이, 가게 안에서 순식간에 빵을 골라내어 시간과 체력을 아끼는 것입니다.

4단계: 진열대에 올리기 (화면 렌더링)

골라낸 빵이 하나도 없다면? (length === 0)

"손님, 찾으시는 맛의 빵이 다 떨어졌네요! 직접 빵을 구워보시겠어요?"라는 팻말(EmptyState)을 보여줍니다.

골라낸 빵이 있다면?

예쁜 2열 진열대(grid-cols-2)에 빵 카드들을 촥 펼쳐놓습니다.

어떤 플랫폼인지 맛 스티커(Badge)도 붙이고, 가격표(보상: ...)도 붙여서 손님이 구경할 수 있게 합니다.

💡 한 줄로 요약하면?

**"본사 창고에서 트럭으로 빵을 통째로 싣고 온 뒤(useRecruits), 손님이 원하는 맛 버튼을 누를 때마다 점장님이 매장 안에서 즉석으로 골라내서(useMemo) 진열대에 올려주는 구조"**입니다!
*/