import { useId } from 'react'

export default function Textarea({ label, error, className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={Boolean(error)}
        className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-xs outline-none focus:ring-4 ${
          error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
