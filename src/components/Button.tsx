export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-4 py-2 rounded-md font-medium transition text-sm disabled:opacity-50";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}