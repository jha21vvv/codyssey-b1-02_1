// {error ? "border-red-500" : "border-gray-300"} 에러시 테두리 생 변화
//{error && <span className="text-xs text-red-500">{error}</span>}
//논리곱 연산자 &&(AND)는 양쪽이 모두 참이어야 참이 됩니다.
///자바스크립트의 &&는 true/false만 내뱉는 게 아니라, 자기가 마지막으로 확인한 알맹이(값)를 그대로 손에 쥐고 던져주는 성질
//"사과" && "바나나" ➔ 결과: "바나나" (true가 아니라 글자 '바나나' 자체가 나옴), 그래서 에러 문구가 들어간 스팬값을 주는 방식이됨.
export default function Input({ label = "", error = "", className = "", ...props }: any) {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${className}`} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}