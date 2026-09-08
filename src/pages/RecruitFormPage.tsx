import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
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

  const [formData, setFormData] = useState({
    title: "",
    platform: "Android",
    reward: "",
    content: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(isEdit);

 // 기존 글을 가져오는 메커니즘.
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
    if (!formData.title.trim()) {
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

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
//isEdit이 false(새 글 모드)이므로 "새 테스터 모집 공고 등록"이라는 글자가 뜹니다.
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