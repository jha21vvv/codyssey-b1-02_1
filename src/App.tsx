import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import Layout from "./components/Layout";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const RecruitList = lazy(() => import("./pages/RecruitList"));
const RecruitDetail = lazy(() => import("./pages/RecruitDetail"));
const RecruitFormPage = lazy(() => import("./pages/RecruitFormPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <FilterProvider>
      <BrowserRouter basename="/codyssey-b1-02_1">
        <Suspense fallback={<Loading message="화면을 불러오는 중입니다..." />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="recruits" element={<RecruitList />} />
              <Route path="recruits/:id" element={<RecruitDetail />} />
              <Route path="recruits/new" element={<RecruitFormPage />} />
              <Route path="recruits/:id/edit" element={<RecruitFormPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </FilterProvider>
  );
}