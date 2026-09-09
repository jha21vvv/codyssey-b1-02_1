export default function Select({ label, options = [], error = "", className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <select className={`border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}