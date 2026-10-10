import { Loader2 } from 'lucide-react'
import { buttonClasses } from './buttonStyles'

export default function Button({ variant = 'primary', loading = false, className = '', children, ...props }) {
  return (
    <button className={buttonClasses(variant, className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
