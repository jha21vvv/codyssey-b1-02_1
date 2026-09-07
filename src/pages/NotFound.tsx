import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-black text-gray-300 mb-4">404</h1>
      <p className="text-xl font-medium text-gray-700 mb-6">
        존재하지 않는 페이지입니다.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
