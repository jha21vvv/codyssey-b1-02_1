import React, { createContext, useContext, useState, useMemo } from "react";

// 1. [채널 생성] 전역 상태를 담아둘 빈 통(Context)을 생성합니다. 기본값은 null로 지정합니다.
const FilterContext = createContext(null);

// 2. [공급자 컴포넌트] 사이트 최상단에서 자식 컴포넌트들({children})을 감싸고, 데이터를 뿌려주는 방송국 본체 역할을 합니다.
export function FilterProvider({ children }) {
  // 플랫폼 필터 상태: "All", "iOS", "Android" 등 현재 선택된 플랫폼 값을 보관 (초기값: "All")
  const [platformFilter, setPlatformFilter] = useState("All");

  // 검색어 상태: 사용자가 검색창에 타이핑한 텍스트를 보관 (초기값: 빈 문자열)
  const [searchTerm, setSearchTerm] = useState("");

  // [성능 최적화] 하위 컴포넌트들에 넘겨줄 객체 묶음(value)을 메모이제이션합니다.
  // platformFilter나 searchTerm 둘 중 하나라도 실제로 바뀌었을 때만 새로운 객체를 생성하여 넘겨줍니다.
  // 객체 주소값이 불필요하게 바뀌어 하위 컴포넌트들이 헛돌며 리렌더링되는 현상을 방지합니다.
  // 발신기인셈.
  const value = useMemo(() => ({
    platformFilter,    // 읽기 전용: 현재 선택된 플랫폼
    setPlatformFilter, // 변경 스위치: 플랫폼 값을 바꾸는 함수
    searchTerm,        // 읽기 전용: 현재 입력된 검색어
    setSearchTerm      // 변경 스위치: 검색어를 바꾸는 함수
  }), [platformFilter, searchTerm]); //의존성 배열 바뀌면 바로 새로 만들라고 명령하는 문법

  // 하위 자식 컴포넌트들({children})에게 value 객체 보따리를 방송(제공)합니다.
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

// 3. [커스텀 훅] 컴포넌트들이 매번 useContext(FilterContext)를 길게 치지 않고 데이터/함수를 바로 꺼내 쓸 수 있도록 돕는 도우미입니다.
// 수신기고
export function useFilter() {
  // 관리사무소 방송 채널에 주파수를 맞춰 현재 들어있는 value 값을 읽어옵니다.
  const context = useContext(FilterContext);

  // [안전장치] 만약 FilterProvider로 감싸지 않은 엉뚱한 곳에서 useFilter를 호출하면 
  // context가 비어있으므로 에러를 던져 개발자에게 구조적 실수를 즉시 알려줍니다.
  if (!context) throw new Error("useFilter must be used within a FilterProvider");

  // 플랫폼 값, 검색어, 그리고 이를 수정하는 변경 함수들이 묶인 객체를 반환합니다.
  return context;
}