const VARIANTS = {
  primary: 'bg-indigo-600 text-on-accent shadow-sm shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
  danger: 'bg-red-600 text-on-accent hover:bg-red-500 focus-visible:outline-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

// Classes reutilisables, par exemple pour un <Link> qui doit ressembler a un bouton
export function buttonClasses(variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold
    transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed
    disabled:opacity-60 ${VARIANTS[variant]} ${className}`
}
