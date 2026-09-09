// 컴포넌트의 모든 코드가 사실상 css설정들임. 그냥 RecruitFormPage.tsx에서 Input이나 이런식으로 대놓고 사용함.

export default function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700"
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color] || colors.blue}`}>{children}</span>;
}