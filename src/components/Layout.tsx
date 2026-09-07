import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            DevTester
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              홈
            </Link>
            <Link
              to="/recruits"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              공고 목록
            </Link>
            <Link
              to="/recruits/new"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              공고 등록
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © 2026 DevTester. All rights reserved.
      </footer>
    </div>
  );
}
