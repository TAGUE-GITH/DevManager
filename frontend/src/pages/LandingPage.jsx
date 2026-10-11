import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FolderKanban,
  LifeBuoy,
  Lock,
  Menu,
  MessageSquare,
  Moon,
  ShieldCheck,
  Smartphone,
  UserCog,
  Video,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DemoButton from '../components/DemoButton'
import LanguageSwitcher from '../components/LanguageSwitcher'
import VideoButton from '../components/landing/VideoButton'
import Logo from '../components/Logo'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../context/useAuth'
import { formatCurrency } from '../utils/format'
import { useTranslation } from 'react-i18next'

// Application Android : derniere version publiee dans les Releases GitHub (lien permanent)
const ANDROID_APK_URL = 'https://github.com/TAGUE-GITH/DevManager/releases/latest/download/DevManager.apk'

const NAV_LINKS = [
  { href: '#fonctionnalites', key: 'landing.nav.features' },
  { href: '#securite', key: 'landing.nav.security' },
  { href: '#tarifs', key: 'landing.nav.pricing' },
]

const HIGHLIGHTS = [
  { Icon: Building2, key: 'landing.highlights.isolated' },
  { Icon: Smartphone, key: 'landing.highlights.mobile' },
  { Icon: Moon, key: 'landing.highlights.dark' },
  { Icon: Wallet, key: 'landing.highlights.currency' },
]

// Sections illustrees par de vraies captures de l'application (textes : landing.showcases.<id>)
const SHOWCASES = [
  { id: 'kanban', image: '/screens/03-kanban.webp' },
  { id: 'dashboard', image: '/screens/tableau-de-bord-sombre.webp' },
  { id: 'messages', image: '/screens/messagerie.webp' },
]

// Textes : landing.features.<id>.title et .text
const FEATURES = [
  { Icon: FolderKanban, id: 'kanban' },
  { Icon: Wallet, id: 'budgets' },
  { Icon: BarChart3, id: 'charts' },
  { Icon: MessageSquare, id: 'messages' },
  { Icon: Video, id: 'meetings' },
  { Icon: UserCog, id: 'roles' },
]

const STEPS = ['create', 'invite', 'manage']

const SECURITY = ['landing.security.item1', 'landing.security.item2', 'landing.security.item3', 'landing.security.item4']

// Textes : landing.pricing.plans.<id>
const PLANS = [
  { id: 'free', price: 0 },
  { id: 'pro', price: 15000, highlighted: true },
]

// Capture d'ecran dans un cadre de fenetre de navigateur
function BrowserFrame({ src, alt, className = '', eager = false }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#f87171]" />
        <span className="size-2.5 rounded-full bg-[#fbbf24]" />
        <span className="size-2.5 rounded-full bg-[#34d399]" />
        <span className="ml-3 hidden rounded-md bg-white px-3 py-0.5 text-[11px] text-slate-400 ring-1 ring-slate-200 sm:block">
          devmanager-five.vercel.app
        </span>
      </div>
      <img src={src} alt={alt} className="block w-full" loading={eager ? 'eager' : 'lazy'} width="1440" height="900" />
    </div>
  )
}

function Header() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const actions = isAuthenticated ? (
    <Link to="/app" className={buttonClasses('primary')}>
      {t('landing.openApp')}
    </Link>
  ) : (
    <>
      <Link to="/login" className={buttonClasses('ghost')}>
        {t('auth.login.submit')}
      </Link>
      <Link to="/register" className={buttonClasses('primary')}>
        {t('landing.start')}
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label={t('landing.nav.label')}>
          {NAV_LINKS.map(({ href, key }) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {t(key)}
            </a>
          ))}
          <Link to="/aide" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {t('nav.help')}
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher className="mr-2 w-24" />
          {actions}
        </div>
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {NAV_LINKS.map(({ href, key }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t(key)}
            </a>
          ))}
          <Link to="/aide" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {t('nav.help')}
          </Link>
          <LanguageSwitcher className="mt-2 w-24" />
          <div className="flex flex-col gap-2 pt-3">{actions}</div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  return (
    <section className="relative overflow-hidden">
      {/* Halo de couleur en arriere-plan */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[46rem]"
        style={{
          background:
            'radial-gradient(60rem 30rem at 50% -10%, rgba(99,102,241,.22), transparent 70%), radial-gradient(30rem 20rem at 85% 30%, rgba(139,92,246,.15), transparent 70%)',
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 lg:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs ring-1 ring-indigo-200">
          <span className="size-1.5 rounded-full bg-indigo-600" />
          {t('landing.hero.badge')}
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.05]">
          {t('landing.hero.title')}{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {t('landing.hero.highlight')}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t('landing.hero.text')}
        </p>
        <div className="mx-auto mt-9 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Link to="/app" className={buttonClasses('primary', 'px-6 py-3 text-base')}>
              {t('landing.openApp')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <>
              <DemoButton variant="primary" className="[&_button]:px-6 [&_button]:py-3 [&_button]:text-base">
                {t('demo.try')}
              </DemoButton>
              <Link to="/register" className={buttonClasses('secondary', 'px-6 py-3 text-base')}>
                {t('landing.hero.createFree')}
              </Link>
            </>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <VideoButton />
            <a
              href={ANDROID_APK_URL}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600"
            >
              <Smartphone className="size-5" aria-hidden />
              {t('landing.android.button')}
            </a>
          </div>
          <p className="text-sm text-slate-500">{t('landing.hero.note')}</p>
        </div>
      </div>

      {/* Captures reelles : ordinateur et mobile */}
      <div className="relative mx-auto mt-16 max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <BrowserFrame
          src="/screens/02-tableau-de-bord.webp"
          alt={t('auth.panel.screenshotAlt')}
          eager
        />
        <div className="absolute -right-2 bottom-8 hidden w-[19%] overflow-hidden rounded-[1.6rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl md:block lg:right-2">
          <img src="/screens/06-mobile.webp" alt={t('landing.hero.mobileAlt')} className="block w-full" loading="lazy" width="780" height="1688" />
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  const { t } = useTranslation()
  return (
    <section className="border-y border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {HIGHLIGHTS.map(({ Icon, key }) => (
          <li key={key} className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700">
            <Icon className="size-5 text-indigo-600" aria-hidden />
            {t(key)}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Showcases() {
  const { t } = useTranslation()
  return (
    <section id="fonctionnalites" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl space-y-24 px-4 sm:px-6 lg:space-y-32">
        {SHOWCASES.map(({ id, image }, index) => {
          const { eyebrow, title, text, points, alt } = t(`landing.showcases.${id}`, { returnObjects: true })
          return (
          <div key={id} className="grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
            <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <p className="text-sm font-semibold text-indigo-600">{eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{text}</p>
              <ul className="mt-6 space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="size-5 shrink-0 text-indigo-600" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <BrowserFrame src={image} alt={alt} />
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

function Features() {
  const { t } = useTranslation()
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('landing.features.title')}</h2>
          <p className="mt-4 text-lg text-slate-600">{t('landing.features.subtitle')}</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, id }) => (
            <div key={id} className="flex gap-4 rounded-2xl p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-200">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-on-accent shadow-md shadow-indigo-500/20">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{t(`landing.features.${id}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(`landing.features.${id}.text`)}</p>
              </div>
            </div>
          ))}
        </div>

        <ol className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((id, index) => (
            <li key={id} className="rounded-2xl bg-slate-50 p-6">
              <span className="text-sm font-bold text-indigo-600">{t('landing.steps.step', { number: index + 1 })}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{t(`landing.steps.${id}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`landing.steps.${id}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Security() {
  const { t } = useTranslation()
  return (
    <section
      id="securite"
      className="scroll-mt-20 bg-[#0b1020] py-20 sm:py-24"
      style={{ backgroundImage: 'radial-gradient(40rem 20rem at 0% 0%, rgba(79,70,229,.35), transparent 70%)' }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-[#a5b4fc]">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-on-accent sm:text-4xl">{t('landing.security.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#cbd5e1]">
            {t('landing.security.text')}
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECURITY.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
              <Lock className="mt-0.5 size-5 shrink-0 text-[#a5b4fc]" aria-hidden />
              <span className="text-sm font-medium text-[#e2e8f0]">{t(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pricing() {
  const { t } = useTranslation()
  return (
    <section id="tarifs" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">{t('landing.nav.pricing')}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('landing.pricing.title')}</h2>
          <p className="mt-4 text-lg text-slate-600">{t('landing.pricing.subtitle')}</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map(({ id, price, highlighted }) => {
            const { name, description, features } = t(`landing.pricing.plans.${id}`, { returnObjects: true })
            return (
            <div
              key={id}
              className={`relative flex flex-col rounded-2xl p-8 ${
                highlighted ? 'bg-[#0b1020] text-on-accent shadow-2xl ring-2 ring-indigo-500' : 'bg-white ring-1 ring-slate-200'
              }`}
            >
              {highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-semibold text-on-accent">
                  {t('landing.pricing.recommended')}
                </span>
              )}
              <h3 className={`text-lg font-semibold ${highlighted ? 'text-on-accent' : 'text-slate-900'}`}>{name}</h3>
              <p className={`mt-2 text-sm ${highlighted ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>{description}</p>
              <p className="mt-6">
                <span className="text-4xl font-extrabold tracking-tight">{price === 0 ? t('enums.plan.FREE') : formatCurrency(price)}</span>
                {price > 0 && <span className="text-[#cbd5e1]"> {t('settings.perMonth')}</span>}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      className={`size-5 shrink-0 ${highlighted ? 'text-[#a5b4fc]' : 'text-indigo-600'}`}
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={buttonClasses(highlighted ? 'primary' : 'secondary', 'mt-8 w-full py-3')}
              >
                {highlighted ? t('landing.pricing.ctaPro') : t('landing.pricing.ctaFree')}
              </Link>
            </div>
            )
          })}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          {t('landing.pricing.note')}
        </p>
      </div>
    </section>
  )
}

function CallToAction() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed 60%, #a21caf)' }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-on-accent sm:text-4xl">{t('landing.cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#e0e7ff]">
            {t('landing.cta.text')}
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link to="/app" className={buttonClasses('secondary', 'px-6 py-3 text-base')}>
                {t('landing.openApp')}
              </Link>
            ) : (
              <>
                <DemoButton className="[&_button]:px-6 [&_button]:py-3 [&_button]:text-base">{t('demo.try')}</DemoButton>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-on-accent ring-1 ring-white/40 hover:bg-white/10"
                >
                  {t('demo.createSpace')}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-500">© {YEAR} DevManager. {t('landing.footer.author')}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600" aria-label={t('landing.footer.links')}>
          <Link to="/aide" className="flex items-center gap-1.5 hover:text-slate-900">
            <LifeBuoy className="size-4" aria-hidden />
            {t('help.title')}
          </Link>
          <a href="https://github.com/TAGUE-GITH/DevManager" target="_blank" rel="noreferrer" className="hover:text-slate-900">
            {t('landing.footer.source')}
          </a>
          <a href={ANDROID_APK_URL} className="flex items-center gap-1.5 hover:text-slate-900">
            <Smartphone className="size-4" aria-hidden />
            {t('landing.android.footer')}
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Showcases />
        <Features />
        <Security />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
