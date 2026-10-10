export default function Card({ className = '', children }) {
  return <div className={`rounded-xl bg-white shadow-xs ring-1 ring-slate-200 ${className}`}>{children}</div>
}
