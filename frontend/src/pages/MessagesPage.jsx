import { ArrowLeft, Inbox, PenSquare, Reply, Send } from 'lucide-react'
import { useCallback, useState } from 'react'
import { messagesApi } from '../api/resources'
import ComposeModal from '../components/messages/ComposeModal'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/States'
import { useFetch } from '../hooks/useFetch'
import { notifyMessagesChanged } from '../utils/events'
import { formatDateTime, fullName } from '../utils/format'

const FOLDERS = {
  inbox: { label: 'Reçus', Icon: Inbox, load: messagesApi.inbox },
  sent: { label: 'Envoyés', Icon: Send, load: messagesApi.sent },
}

function MessageDetail({ message, folder, onBack, onReply }) {
  const other = folder === 'inbox' ? message.sender : message.recipient
  return (
    <Card className="p-6">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 lg:hidden">
        <ArrowLeft className="size-4" aria-hidden />
        Retour
      </button>
      <h2 className="text-lg font-semibold text-slate-900">{message.subject}</h2>
      <div className="mt-4 flex items-center gap-3 border-b border-slate-100 pb-4">
        <Avatar user={other} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900">
            {folder === 'inbox' ? 'De' : 'À'} {fullName(other)}
          </p>
          <p className="text-xs text-slate-500">{formatDateTime(message.sentAt)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-slate-700">{message.content}</p>
      {folder === 'inbox' && (
        <Button variant="secondary" className="mt-6" onClick={onReply}>
          <Reply className="size-4" aria-hidden />
          Répondre
        </Button>
      )}
    </Card>
  )
}

export default function MessagesPage() {
  const [folder, setFolder] = useState('inbox')
  const { data: messages, loading, error, reload, setData } = useFetch(useCallback(() => FOLDERS[folder].load(), [folder]))
  const [selectedId, setSelectedId] = useState(null)
  const [compose, setCompose] = useState(null)

  const selected = messages?.find((message) => message.id === selectedId)

  const changeFolder = (next) => {
    setFolder(next)
    setSelectedId(null)
  }

  const openMessage = async (message) => {
    setSelectedId(message.id)
    // Ouvrir un message recu non lu le marque comme lu
    if (folder === 'inbox' && !message.read) {
      const updated = await messagesApi.markAsRead(message.id)
      setData(messages.map((m) => (m.id === updated.id ? updated : m)))
      notifyMessagesChanged()
    }
  }

  const reply = () =>
    setCompose({
      recipientId: selected.sender.id,
      subject: selected.subject.startsWith('RE :') ? selected.subject : `RE : ${selected.subject}`,
    })

  return (
    <>
      <PageHeader
        title="Messagerie"
        description="Échangez avec les membres de votre entreprise."
        actions={
          <Button onClick={() => setCompose({})}>
            <PenSquare className="size-4" aria-hidden />
            Nouveau message
          </Button>
        }
      />

      <div className="mb-6 flex w-fit gap-1 rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Dossiers">
        {Object.entries(FOLDERS).map(([key, { label, Icon }]) => (
          <button
            key={key}
            role="tab"
            aria-selected={folder === key}
            onClick={() => changeFolder(key)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              folder === key ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {loading && <PageLoader />}
      {error && <ErrorState message={error} />}

      {messages && messages.length === 0 && (
        <EmptyState
          icon={FOLDERS[folder].Icon}
          title={folder === 'inbox' ? 'Aucun message reçu' : 'Aucun message envoyé'}
        />
      )}

      {messages && messages.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className={`overflow-hidden lg:col-span-2 ${selected ? 'hidden lg:block' : ''}`}>
            <ul className="divide-y divide-slate-100">
              {messages.map((message) => {
                const other = folder === 'inbox' ? message.sender : message.recipient
                const unread = folder === 'inbox' && !message.read
                return (
                  <li key={message.id}>
                    <button
                      onClick={() => openMessage(message)}
                      className={`flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 ${
                        selectedId === message.id ? 'bg-indigo-50/60' : ''
                      }`}
                    >
                      <Avatar user={other} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={`truncate text-sm ${unread ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                            {fullName(other)}
                          </p>
                          <span className="shrink-0 text-xs text-slate-400">{formatDateTime(message.sentAt)}</span>
                        </div>
                        <p className={`truncate text-sm ${unread ? 'font-medium text-slate-900' : 'text-slate-500'}`}>
                          {unread && <span className="mr-1.5 inline-block size-2 rounded-full bg-indigo-600" aria-label="Non lu" />}
                          {message.subject}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>

          <div className={`lg:col-span-3 ${selected ? '' : 'hidden lg:block'}`}>
            {selected ? (
              <MessageDetail message={selected} folder={folder} onBack={() => setSelectedId(null)} onReply={reply} />
            ) : (
              <div className="flex h-full min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
                Sélectionnez un message pour le lire
              </div>
            )}
          </div>
        </div>
      )}

      {compose && (
        <ComposeModal
          initial={compose}
          onClose={() => setCompose(null)}
          onSent={() => {
            setCompose(null)
            if (folder === 'sent') reload()
            else changeFolder('sent')
          }}
        />
      )}
    </>
  )
}
