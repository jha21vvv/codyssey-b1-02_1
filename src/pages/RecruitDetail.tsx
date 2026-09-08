import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import Badge from "../components/Badge";
import Button from "../components/Button";

export default function RecruitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("recruits")
        .select("*")
        .eq("id", id)
        .single();  //해당 id에 해당하는 단일 레코드만 가져오도록 single()을 사용

      if (err) throw err;
      setRecruit(data);
    } catch (err) {
      setError(err.message || "공고 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 공고를 삭제하시겠습니까?")) return;
    const { error: delErr } = await supabase.from("recruits").delete().eq("id", id);
    if (delErr) {
      alert("삭제 실패: " + delErr.message);
    } else {
      alert("삭제되었습니다.");
      navigate("/recruits");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) return <Loading message="공고 상세 내용을 불러오는 중입니다..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!recruit) return <ErrorState message="존재하지 않는 공고입니다." />;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Badge color={recruit.platform === "iOS" ? "purple" : "green"}>
          {recruit.platform}
        </Badge>
        <span className="text-xs text-gray-400">
          {new Date(recruit.created_at).toLocaleDateString()}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">{recruit.title}</h1>

      <div className="p-4 bg-gray-50 rounded-md border border-gray-100 mb-6">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">참여 보상</span>
        <p className="text-base font-medium text-gray-800 mt-1">{recruit.reward || "별도 리워드 없음"}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">테스트 안내 및 요청사항</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recruit.content}</p>
      </div>

      <div className="flex justify-between border-t pt-4">
        <Button variant="secondary" onClick={() => navigate("/recruits")}>
          목록으로
        </Button>
        <div className="flex gap-2">
          <Link to={`/recruits/${id}/edit`}>
            <Button variant="secondary">수정</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}