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
  const { data: recruits, loading, error, refetch } = useRecruits();
  const { platformFilter, setPlatformFilter, searchTerm, setSearchTerm } = useFilter();
  const navigate = useNavigate();

  const filteredRecruits = useMemo(() => {
    return (recruits || []).filter((item) => {
      const matchesPlatform = platformFilter === "All" || item.platform === platformFilter;
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            onChange={(e) => setSearchTerm(e.target.value)}
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