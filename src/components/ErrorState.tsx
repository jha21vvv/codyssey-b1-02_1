export default function ErrorState({ message = "문제가 발생했습니다.", onRetry = undefined }: any) {
  return (
    <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 p-6">
      <p className="text-red-700 font-medium mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition">
          다시 시도
        </button>
      )}
    </div>
  );
}