import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
//백엔드 서버를 1줄도 만들지 않습니다. Supabase 웹사이트에서 클릭 몇 번으로 recruits 표(Table)를 생성해 둡니다. 
// 그리고 프론트엔드 코드에서 supabase.from('recruits').insert(formData) 한 줄만 호출하면 바로 데이터가 클라우드 원격 DB에 영구 저장되고 불러와집니다.
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Loading from "../components/Loading";

export default function RecruitFormPage() {
  // react-router-dom에서 글번호를 받아오는게 이게 뉴냐? 번호냐임.useParams()는 브라우저 주소창(URL)에 적힌 정보를 읽어오는 도구임. 뉴면 숫자가 없으니 빈칸이 됨
  const { id } = useParams();
  const navigate = useNavigate();
  //번호면 트루로 수정, 빈칸은 폴스로 새글 등록
  const isEdit = Boolean(id);
//useState가 일종의 창구로 부모(이 페이지)가 자식(인풋)의 데이터를 실시간으로 볼수 있도록 창구를 열어서 여기서 변한걸 보는 상태
  const [formData, setFormData] = useState({
    title: "",
    platform: "Android",
    reward: "",
    content: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(isEdit);

 //기존 데이토 들고 오는 부분
  useEffect(() => {
     //폴스(새글)의 폴스이니. 아래 내용은 새글 등록인경우 자동으로 실행되지 않도록 막음. 트루(수정 등록)인 경우에만 아래 내용이 실행됨
    if (!isEdit) return;

    const fetchDetail = async () => {
      try {
        const { data, error } = await supabase
          .from("recruits")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title || "",
            platform: data.platform || "Android",
            reward: data.reward || "",
            content: data.content || "",
          });
        }
      } catch (err: any) {
        alert("공고 데이터를 불러오지 못했습니다: " + err.message);
        navigate("/recruits");
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs: any = {};
    if (!formData.title.trim()) { //trim()은 문자열의 앞뒤에 붙은 불필요한 공백(스페이스, 탭, 줄바꿈)을 싹 잘라내 주는 함수
      errs.title = "공고 제목을 반드시 입력해주세요.";
    } else if (formData.title.length < 5) {
      errs.title = "제목은 최소 5자 이상 입력해주세요.";
    }

    if (!formData.content.trim()) {
      errs.content = "테스트 내용 및 안내를 입력해주세요.";
    } else if (formData.content.length < 10) {
      errs.content = "내용은 10자 이상 구체적으로 작성해주세요.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
//폼데이터가 변할때마다 실행되는 함수. 인풋에서 입력한 값이 바뀌면 이 함수가 실행됨. e.target.name은 인풋의 name속성값, e.target.value는 인풋에 입력한 값임
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    /*
    1줄: const handleChange = (e: any) => {

handleChange라는 이름의 이벤트 처리 함수를 정의합니다.

매개변수 e는 사용자가 타자를 치거나 드롭다운을 변경했을 때 브라우저가 자동으로 넘겨주는 '이벤트 객체'입니다.

2줄: const { name, value } = e.target;

구조 분해 할당을 사용해 이벤트가 발생한 입력창(e.target)에서 두 가지 핵심 정보를 꺼내옵니다.

name: 어떤 입력창인지 식별하는 고유 이름입니다 (예: "title", "platform").

value: 사용자가 방금 입력하거나 선택한 실제 텍스트 값입니다 (예: "개발자 모집", "iOS").

3줄: setFormData((prev) => ({ ...prev, [name]: value }));

부모의 데이터 저장소(formData)를 갱신합니다.

(prev): 직전 상태의 장부 내용 전체를 뜻합니다.

...prev: 기존에 적혀 있던 다른 데이터들(예: 제목을 바꿀 때 기존의 보상, 플랫폼 데이터)이 날아가지 않도록 그대로 복사해 유지합니다.

[name]: value: 방금 변경된 항목 딱 하나만 새로운 값으로 덮어씁니다. (name이 "title"이면 title: value가 됨)
    */
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };
  /*
4줄: if (errors[name]) {

해당 입력창에 과거에 발생했던 '에러(유효성 검사 실패 메시지)'가 여전히 남아있는지 확인합니다.

예: 사용자가 제목을 비워둬서 "제목을 입력하세요"라는 빨간 경고 라벨(errors.title)이 떠 있던 상태인지 체크합니다.
상황 1: 실수로 필수 입력을 건너뛰고 [등록] 버튼을 누름

사용자가 제목(title)과 보상(reward)을 모두 빈칸으로 둔 채 [등록하기] 버튼을 누릅니다.

유효성 검사기(validate)가 돌면서 errors 장부에 빨간 딱지가 붙습니다:

JavaScript
errors = {
  title: "제목을 입력하세요",
  reward: "보상을 입력하세요"
};
화면의 제목 입력창과 보상 입력창 밑에 동시에 빨간 글씨 경고가 뜹니다.

상황 2: 사용자가 제목 창에 키보드로 글자 'A'를 입력함

제목 입력창에서 handleChange가 실행됩니다 (name = "title").

4줄 if (errors["title"]) 검사:

현재 errors["title"]에 "제목을 입력하세요"라는 글자가 들어있으므로 조건문이 true(참)가 됩니다.

5줄 setErrors(...) 실행:

...prev: 아직 안 고친 reward: "보상을 입력하세요"는 그대로 둡니다.

[name]: null: 방금 타자를 치기 시작한 title만 null로 바꿔버립니다.

JavaScript
// 갱신된 errors 결과
errors = {
  title: null, // 빨간 딱지 제거
  reward: "보상을 입력하세요" // 다른 에러는 그대로 유지
};
상황 3: 화면의 실시간 변화

사용자가 제목에 글자 하나를 치는 즉시, 제목 밑에 떠 있던 "제목을 입력하세요" 빨간 경고 문구만 싹 사라집니다.

아직 손대지 않은 보상 창의 "보상을 입력하세요" 경고는 그대로 남아있어, 사용자가 무엇을 마저 채워야 하는지 알려줍니다.
  */

//비동기 처리 (async/await): 브라우저는 화면이 멈추지 않게 유지하면서(버튼에 빙글빙글 로딩 표시만 띄움), 
// 백그라운드 네트워크 통로를 통해 서버로 데이터를 보냅니다. 그동안 사용자는 스크롤을 올리거나 다른 탭을 볼 수 있으며, 저장이 끝나면 부드럽게 목록 페이지로 화면을 이동(navigate('/'))시킵니다.
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return; // 검사 성공시 아무일 없이 지나감. 검사 실패시 올스톱후 서브밋자체 함수가 종료됨

    try {
      setSubmitting(true);

      if (isEdit) {
        const { error } = await supabase
          .from("recruits")
          .update({
            title: formData.title,
            platform: formData.platform,
            reward: formData.reward,
            content: formData.content,
          })
          .eq("id", id);

        if (error) throw error;
        alert("공고가 성공적으로 수정되었습니다.");
        navigate(`/recruits/${id}`);
      } else {
        const { error } = await supabase
          .from("recruits")
          .insert([
            {
              title: formData.title,
              platform: formData.platform,
              reward: formData.reward,
              content: formData.content,
            },
          ]);

        if (error) throw error;
        alert("공고가 성공적으로 등록되었습니다.");
        navigate("/recruits");
      }
    } catch (err: any) {
      alert("저장 실패: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDetail) return <Loading message="기존 공고 정보를 불러오는 중입니다..." />;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "테스터 모집 공고 수정" : "새 테스터 모집 공고 등록"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="공고 제목"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="예: 신규 금융 가계부 앱 베타 테스터를 모십니다"
          error={errors.title}
        />

        <Select
          label="대상 플랫폼"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          options={[
            { label: "Android", value: "Android" },
            { label: "iOS", value: "iOS" },
            { label: "전체 (Web/Cross)", value: "All" },
          ]}
        />

        <Input
          label="참여 보상 (선택)"
          name="reward"
          value={formData.reward}
          onChange={handleChange}
          placeholder="예: 스타벅스 기프티콘, 테스터 크레딧 지급 등"
        />

        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-sm font-semibold text-gray-700">
            상세 내용 및 요청사항
          </label>
          <textarea
            name="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            placeholder="앱 기능, 테스트 기간, 필수 미션 등을 적어주세요."
            className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.content && (
            <span className="text-xs text-red-500">{errors.content}</span>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "저장 중..." : isEdit ? "수정 완료" : "공고 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/*
[저장 버튼 클릭!]
       │
       ▼
[품질 검사관 검사: validate()]
  ├── 빵 이름이 비었거나 5글자 미만인가?  👉 "불합격! 빨간 딱지 부착"
  └── 레시피 설명이 10글자 미만인가?     👉 "불합격! 빨간 딱지 부착"
       │
   ┌───┴────────────────────────────┐
   │ 불합격                         │ 합격 (모든 기준 충족)
   ▼                                ▼
[if (!validate()) return;]     [본사 금고 통신 시작]
  "자격 미달! 작업 즉시 중단!"    setSubmitting(true)
  (금고 문도 안 열어주고 퇴짜)      (버튼 비활성화)
                                    │
                         ┌──────────┴──────────┐
                         │ 신규 메뉴           │ 기존 메뉴 수정
                         ▼                     ▼
                   [insert]              [update]
                   새 파일철 추가        기존 파일철 내용 덮어쓰기
*/
/*
사용자가 키보드로 글자 하나(예: '가')를 누르는 찰나에 실행되는 순서입니다.

1단계: 사용자의 타자 입력
사용자가 키보드로 '가'를 누르면 브라우저 화면의 <input> 요소가 이 입력을 감지합니다.

2단계: 자식 컴포넌트의 센서 발화 (onChange)
입력을 감지한 <input>의 onChange 이벤트 리스너가 작동하며, 브라우저는 발생한 이벤트 정보를 담은 객체(e)를 생성합니다.

3단계: 부모 담당 함수 호출 (handleChange)
<Input onChange="{handleChange}"/>로 연결되어 있던 부모의 handleChange(e) 함수가 즉시 호출됩니다.

4단계: 변경 내용 추출
함수 내부에서 어떤 입력창에서 무슨 글자가 들어왔는지 확인합니다:

e.target.name: 입력이 발생한 곳의 이름 (예: "title")

e.target.value: 방금 입력되어 만들어진 전체 글자 (예: "가")

5단계: 상태 갱신 함수 실행 (setFormData)
추출한 정보를 바탕으로 부모의 수정 함수를 호출합니다:

TypeScript
setFormData({
  ...formData,
  title: "가"
});
6단계: 리액트의 화면 다시 그리기 (리렌더링)
setFormData가 실행되는 즉시 리액트 엔진이 작동하여 부모 컴포넌트(RecruitFormPage)를 새로고침합니다. 이때 formData.title의 값은 빈 문자열에서 "가"로 교체됩니다.

7단계: 새 데이터가 자식 화면에 반영 (value)
새로 바뀐 formData.title("가") 값이 자식의 <Input value="{formData.title}"/> 프로퍼티로 내려꽂히면서, 사용자의 모니터 입력창 안에 최종적으로 글자 '가'가 유지되어 보이게 됩니다.
*/