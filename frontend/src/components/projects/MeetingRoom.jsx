import { Check, ExternalLink, Link2, Loader2, PhoneOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { apiUrl, getErrorMessage } from '../../api/client'
import { projectsApi } from '../../api/resources'
import { useAuth } from '../../context/useAuth'
import i18n from '../../i18n'
import { fullName } from '../../utils/format'
import { useTranslation } from 'react-i18next'

// Le script officiel de Jitsi n'est charge qu'a la premiere reunion
let jitsiScript
function loadJitsi(domain) {
  jitsiScript ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://${domain}/external_api.js`
    script.async = true
    script.onload = () => resolve(window.JitsiMeetExternalAPI)
    script.onerror = () => {
      jitsiScript = undefined
      reject(new Error(i18n.t('meeting.loadError')))
    }
    document.head.appendChild(script)
  })
  return jitsiScript
}

/**
 * Reunion video du projet en plein ecran (Jitsi Meet) : video, micro, partage d'ecran, discussion, plusieurs participants.
 * Le nom et la photo de l'utilisateur sont transmis automatiquement.
 */
export default function MeetingRoom({ projectId, onClose }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const container = useRef(null)
  const [meeting, setMeeting] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let api
    let cancelled = false
    projectsApi
      .meeting(projectId)
      .then(async (info) => {
        const JitsiMeetExternalAPI = await loadJitsi(info.domain)
        if (cancelled) return
        setMeeting(info)
        api = new JitsiMeetExternalAPI(info.domain, {
          roomName: info.roomName,
          parentNode: container.current,
          width: '100%',
          height: '100%',
          lang: i18n.language,
          userInfo: { displayName: fullName(user) },
          configOverwrite: {
            subject: t('meeting.subject', { name: info.projectName }),
            prejoinPageEnabled: true,
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            disableDeepLinking: true,
          },
        })
        // Photo de profil affichee aux autres participants
        if (user.avatarUrl) {
          api.executeCommand('avatarUrl', new URL(apiUrl(user.avatarUrl), window.location.href).href)
        }
        api.addListener('readyToClose', onClose)
      })
      .catch((err) => !cancelled && setError(err.response ? getErrorMessage(err) : err.message))

    return () => {
      cancelled = true
      api?.dispose()
    }
  }, [projectId, user, onClose, t])

  // Echap ferme la reunion, comme les autres fenetres de l'application
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meeting.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b1020]" role="dialog" aria-modal="true" aria-label={t('meeting.label')}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-[#94a3b8] uppercase">{t('meeting.title')}</p>
          <p className="truncate font-semibold text-on-accent">{meeting?.projectName ?? t('meeting.connecting')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {meeting && (
            <>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#e2e8f0] ring-1 ring-white/20 hover:bg-white/10"
              >
                {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
                {copied ? t('meeting.copied') : t('users.copyLink')}
              </button>
              <a
                href={meeting.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#e2e8f0] ring-1 ring-white/20 hover:bg-white/10"
              >
                <ExternalLink className="size-4" aria-hidden />
                {t('meeting.openTab')}
              </a>
            </>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-on-accent hover:bg-red-500"
          >
            <PhoneOff className="size-4" aria-hidden />
            {t('meeting.leave')}
          </button>
        </div>
      </header>

      <div className="relative flex-1">
        {!meeting && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#cbd5e1]">
            <Loader2 className="size-8 animate-spin" aria-hidden />
            {t('meeting.preparing')}
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[#fecaca]" role="alert">
            {error}
          </div>
        )}
        <div ref={container} className="absolute inset-0" />
      </div>
    </div>
  )
}
