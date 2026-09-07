export default function EmptyState({ message = "등록된 공고가 없습니다.", actionLabel, onAction }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg p-6">
      <p className="text-gray-500 mb-4">{message}</p>
      {actionLabel && (
        <button onClick={onAction} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
          {actionLabel}
        </button>
      )}
    </div>
  );
}