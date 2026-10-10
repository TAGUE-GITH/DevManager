import { PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/useAuth'
import Button from './ui/Button'
import { useTranslation } from 'react-i18next'

// Connexion en un clic a l'entreprise de demonstration
export default function DemoButton({ variant = 'secondary', className = '', children }) {
  const { t } = useTranslation()
  const { loginDemo } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const start = async () => {
    setError('')
    setLoading(true)
    try {
      await loginDemo()
      navigate('/app')
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button variant={variant} loading={loading} onClick={start} className="w-full">
        {!loading && <PlayCircle className="size-4" aria-hidden />}
        {loading ? t('demo.preparing') : (children ?? t('demo.try'))}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
