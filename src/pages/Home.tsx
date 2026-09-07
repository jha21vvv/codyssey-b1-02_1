import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        앱 개발자를 위한 테스터 모집 플랫폼
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        초기 앱의 버그를 잡고 실제 유저 피드백을 빠르게 확보하세요.
      </p>
      <Link
        to="/recruits"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        모집 공고 보러가기
      </Link>
    </div>
  );
} 