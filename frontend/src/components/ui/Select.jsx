import { useId } from 'react'

export default function Select({ label, error, options, className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-xs outline-none focus:ring-4 ${
          error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
        {...props}
      >
        {options.map(({ value, label: optionLabel }) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
