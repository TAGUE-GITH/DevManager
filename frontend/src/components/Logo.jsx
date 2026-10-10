import { Link } from 'react-router-dom'

export default function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="DevManager, accueil">
      <img src="/favicon.svg" alt="" className="size-8" />
      <span className={`text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        DevManager
      </span>
    </Link>
  )
}
