import { useEffect, useState } from "react";
// supabase가 서버 데이터랑 연결 된것
import { supabase } from "../lib/supabase";

export function useRecruits() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecruits = async () => {
    try {
      setLoading(true); //"지금 데이터를 가져오는 중이야"라고 표시
      setError(null);  // 이전 에러발생 상황에 대한 데이터 일단 지워서 백지에서 시작
      const { data: recruits, error: fetchErr } = await supabase
        .from("recruits")
        .select("*")
        .order("created_at", { ascending: false });
        //최신 공고가 위로 오도록 냉장고 내부를 먼저 정리한 뒤 가져
      if (fetchErr) throw fetchErr;
      // 데이터가 정상적으로 들어왔으면 setData로 상태를 업데이트하고 없으면 비워진 []을 넣으란 내용
      setData(recruits || []);
    } catch (err) {
      setError(err.message || "데이터를 불러오지 못했습니다.");
    } finally { //통신이 성공했든(try), 에러가 발생했든(catch) 상관없이 결과와 무관하게 무조건 마지막에 딱 한 번 실행되는 구문`
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruits();
  }, []);
//refetch가 없다면 사용자가 새 공고를 확인하고 싶을 때 F5(새로고침)를 눌러 웹페이지 전체를 다시 불러와야 합니다.브라우저 전체를 새로고침하지 않고, 채용 공고 목록 부분만 부드럽게 서버 최신 데이터로 교체됩니다.
//사용자가 화면에서 "공고 등록하기" 버튼을 누르고 내용을 입력한 뒤 [저장]을 눌렀다.글 작성이 성공한 직후, 코드 뒤편에서 refetch()를 살짝 호출해 줍니다. 그러면 사용자가 새로고침을 누르지 않아도, 방금 작성한 글이 목록에 바로 나타납니다.
  return { data, loading, error, refetch: fetchRecruits };
}

/*
[1. 함수 시작]
  ├── setLoading(true)  👉 "로딩 켜기"
  └── setError(null)    👉 "이전 에러 기록 지우기 (초기화)"
         │
         ▼
[2. Supabase 비동기 요청 (await)]
  ├── "recruits" 테이블 조회
  └── "created_at" 기준 내림차순 정렬
         │
    ┌────┴─────────────────────────┐
    │ 성공                         │ 실패 (에러 발생)
    ▼                              ▼
[3-A. try 블록]              [3-B. catch 블록]
  └── setData(recruits)        └── setError(에러 메시지)
    │                              │
    └──────────────┬───────────────┘
                   │
                   ▼
[4. finally 블록]
  └── setLoading(false) 👉 성공이든 실패든 "로딩 끄기"
*/