import { Check, CreditCard, Info, Smartphone, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { apiUrl, getErrorMessage, getFieldErrors } from '../api/client'
import { organizationApi } from '../api/resources'
import ImageUploader from '../components/ImageUploader'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { PAYMENT_METHOD, PLAN, formatCurrency, formatDate } from '../utils/format'

const PRO_FEATURES = ['Projets illimités', 'Membres illimités', 'Toutes les fonctionnalités', 'Support prioritaire']

function CompanyForm({ organization, demo, onSaved }) {
  const [name, setName] = useState(organization.name)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      onSaved(await organizationApi.rename(name), "Le nom de l'entreprise a été mis à jour.")
    } catch (err) {
      setError(getFieldErrors(err).name ?? getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">Entreprise</h2>
      <div className="mt-5">
        <ImageUploader
          preview={
            organization.logoUrl ? (
              <img src={apiUrl(organization.logoUrl)} alt="Logo de l'entreprise" className="size-24 rounded-2xl object-cover ring-1 ring-slate-200" />
            ) : (
              <span className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold text-on-accent">
                {organization.name[0]?.toUpperCase()}
              </span>
            )
          }
          label="Logo de l'entreprise"
          hint="Il remplace l'initiale dans le menu de tous les membres. Format carré conseillé."
          hasImage={Boolean(organization.logoUrl)}
          disabledReason={demo ? 'Le logo ne peut pas être modifié dans le compte de démonstration.' : undefined}
          onUpload={async (dataUrl) => onSaved(await organizationApi.updateLogo(dataUrl), 'Le logo a été mis à jour.')}
          onRemove={async () => onSaved(await organizationApi.removeLogo(), 'Le logo a été supprimé.')}
        />
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex border-t border-slate-100 pt-6 flex-col gap-4 sm:flex-row sm:items-start" noValidate>
        <Input
          label="Nom de l'entreprise"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={error}
          className="flex-1"
          required
        />
        <Button type="submit" loading={saving} disabled={name.trim() === organization.name} className="sm:mt-7">
          Enregistrer
        </Button>
      </form>
    </Card>
  )
}

function UsageMeter({ label, used, max }) {
  const percent = max ? Math.min(100, Math.round((used / max) * 100)) : 0
  const full = max !== null && used >= max
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className={`font-medium tabular-nums ${full ? 'text-red-700' : 'text-slate-900'}`}>
          {used} {max === null ? '(illimité)' : `/ ${max}`}
        </span>
      </div>
      {max !== null && (
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-100"
          role="meter"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div className={`h-full rounded-full ${full ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }} />
        </div>
      )}
      {full && <p className="mt-1 text-xs font-medium text-red-700">Limite atteinte</p>}
    </div>
  )
}

// Paiement simule : aucune coordonnee bancaire ni numero de telephone n'est demande
function CheckoutModal({ price, onClose, onPaid }) {
  const [method, setMethod] = useState('MOBILE_MONEY')
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  const pay = async () => {
    setError('')
    setPaying(true)
    try {
      onPaid(await organizationApi.subscribe(method))
    } catch (err) {
      setError(getErrorMessage(err))
      setPaying(false)
    }
  }

  const methods = [
    { value: 'MOBILE_MONEY', label: 'Mobile Money', hint: 'Orange Money, MTN MoMo', Icon: Smartphone },
    { value: 'CARD', label: 'Carte bancaire', hint: 'Visa, Mastercard', Icon: CreditCard },
  ]

  return (
    <Modal open title="Passer à l'offre Pro" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-200 ring-inset">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <strong>Mode démonstration</strong> : aucun paiement réel n'est effectué et aucune coordonnée bancaire n'est
            demandée.
          </p>
        </div>
        <Alert>{error}</Alert>

        <div className="flex items-baseline justify-between rounded-lg bg-slate-50 p-4">
          <span className="text-sm text-slate-600">Offre Pro, 1 mois</span>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(price)}</span>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Moyen de paiement</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {methods.map(({ value, label, hint, Icon }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3.5 ring-1 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 ${
                  method === value ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'ring-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                  className="sr-only"
                />
                <Icon className="size-5 text-indigo-600" aria-hidden />
                <span>
                  <span className="block text-sm font-medium text-slate-900">{label}</span>
                  <span className="block text-xs text-slate-500">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button loading={paying} onClick={pay}>
            Payer {formatCurrency(price)}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Page reservee aux administrateurs : entreprise, offre, utilisation et paiements
export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const { data: organization, loading, error, setData } = useFetch(useCallback(() => organizationApi.get(), []))
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [feedback, setFeedback] = useState({ type: 'success', text: '' })

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const isPro = organization.plan === 'PRO'
  const { usage } = organization

  // Mise a jour de la page et de l'utilisateur (nom d'entreprise et badge Pro dans le menu)
  const applyUpdate = (updated, message) => {
    setData(updated)
    setFeedback({ type: 'success', text: message })
    refreshUser()
  }

  const cancel = async () => {
    try {
      applyUpdate(await organizationApi.cancel(), "Vous êtes revenu à l'offre Gratuite. Vos données sont conservées.")
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setCancelOpen(false)
    }
  }

  return (
    <>
      <PageHeader title="Entreprise et abonnement" description="Gérez les informations et l'offre de votre entreprise." />

      {feedback.text && (
        <div className="mb-6">
          <Alert type={feedback.type}>{feedback.text}</Alert>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CompanyForm organization={organization} demo={user.demo} onSaved={applyUpdate} />

          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-900">Offre actuelle</h2>
                <Badge
                  className={
                    isPro ? 'bg-indigo-600 text-on-accent ring-indigo-600' : 'bg-slate-100 text-slate-700 ring-slate-200'
                  }
                >
                  {PLAN[organization.plan].label}
                </Badge>
              </div>
              {isPro && organization.currentPeriodEnd && (
                <p className="text-sm text-slate-500">Prochain renouvellement le {formatDate(organization.currentPeriodEnd)}</p>
              )}
            </div>
            <div className="mt-6 space-y-5">
              <UsageMeter label="Projets" used={usage.projects} max={usage.maxProjects ?? null} />
              <UsageMeter label="Membres (invitations en attente comprises)" used={usage.members} max={usage.maxMembers ?? null} />
            </div>
            {isPro && (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Button variant="secondary" onClick={() => setCheckoutOpen(true)}>
                  Prolonger d'un mois
                </Button>
                <Button variant="ghost" onClick={() => setCancelOpen(true)}>
                  Revenir à l'offre Gratuite
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="border-b border-slate-200 px-6 py-4 font-semibold text-slate-900">Historique des paiements</h2>
            {organization.payments.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-500">Aucun paiement pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-medium text-slate-500 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Référence</th>
                      <th scope="col" className="px-6 py-3">Moyen</th>
                      <th scope="col" className="px-6 py-3 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {organization.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-3.5 whitespace-nowrap text-slate-600">{formatDate(payment.createdAt)}</td>
                        <td className="px-6 py-3.5 font-mono text-xs text-slate-700">{payment.reference}</td>
                        <td className="px-6 py-3.5 text-slate-600">{PAYMENT_METHOD[payment.method]}</td>
                        <td className="px-6 py-3.5 text-right font-medium whitespace-nowrap text-slate-900 tabular-nums">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Card className={`h-fit p-6 ${isPro ? '' : 'ring-2 ring-indigo-500'}`}>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-indigo-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">Offre Pro</h2>
          </div>
          <p className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{formatCurrency(organization.proMonthlyPrice)}</span>
            <span className="text-sm text-slate-500"> / mois</span>
          </p>
          <ul className="mt-5 space-y-2.5">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="size-4 text-indigo-600" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          {!isPro && (
            <Button className="mt-6 w-full" onClick={() => setCheckoutOpen(true)}>
              Passer à l'offre Pro
            </Button>
          )}
        </Card>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          price={organization.proMonthlyPrice}
          onClose={() => setCheckoutOpen(false)}
          onPaid={(updated) => {
            setCheckoutOpen(false)
            applyUpdate(updated, `Paiement confirmé : votre offre Pro est active jusqu'au ${formatDate(updated.currentPeriodEnd)}.`)
          }}
        />
      )}
      <ConfirmDialog
        open={cancelOpen}
        title="Revenir à l'offre Gratuite ?"
        message="Vos projets et vos membres sont conservés, mais vous ne pourrez plus en ajouter au-delà des limites de l'offre Gratuite."
        confirmLabel="Revenir à l'offre Gratuite"
        onConfirm={cancel}
        onClose={() => setCancelOpen(false)}
      />
    </>
  )
}
