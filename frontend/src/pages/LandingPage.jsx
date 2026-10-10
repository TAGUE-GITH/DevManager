import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FolderKanban,
  KeyRound,
  LifeBuoy,
  Lock,
  Menu,
  MessageSquare,
  Moon,
  ShieldCheck,
  Smartphone,
  UserCog,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DemoButton from '../components/DemoButton'
import VideoButton from '../components/landing/VideoButton'
import Logo from '../components/Logo'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../context/useAuth'
import { formatCurrency } from '../utils/format'

const NAV_LINKS = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#securite', label: 'Sécurité' },
  { href: '#tarifs', label: 'Tarifs' },
]

const HIGHLIGHTS = [
  { Icon: Building2, label: 'Un espace isolé par entreprise' },
  { Icon: Smartphone, label: 'Pensé pour mobile' },
  { Icon: Moon, label: 'Mode sombre' },
  { Icon: Wallet, label: 'Montants en FCFA' },
]

// Sections illustrees par de vraies captures de l'application
const SHOWCASES = [
  {
    eyebrow: 'Projets et tâches',
    title: 'Organisez le travail de toute l’équipe',
    text: 'Chaque projet a son tableau Kanban. Créez des tâches, assignez-les, fixez des échéances, puis faites-les glisser d’une colonne à l’autre.',
    points: ['Glisser-déposer à la souris, au doigt ou au clavier', 'Tâches en retard signalées', 'Page « Mes tâches » pour chacun'],
    image: '/screens/03-kanban.webp',
    alt: 'Tableau Kanban d’un projet avec des tâches dans les colonnes À faire, En cours, En revue et Terminé',
  },
  {
    eyebrow: 'Tableau de bord',
    title: 'Pilotez avec des chiffres clairs',
    text: 'Budgets prévus et dépensés, évolution mois par mois, répartition par catégorie et avancement des tâches : tout est visible en un coup d’œil, de jour comme de nuit.',
    points: ['Alerte en cas de dépassement de budget', 'Valeurs exactes au survol ou en tableau', 'Mode sombre intégré'],
    image: '/screens/tableau-de-bord-sombre.webp',
    alt: 'Tableau de bord en mode sombre avec des graphiques de budgets et de dépenses',
  },
  {
    eyebrow: 'Messagerie',
    title: 'Échangez sans quitter l’application',
    text: 'Fini les emails perdus : la messagerie interne garde toutes les discussions de l’entreprise au même endroit, avec les messages non lus mis en évidence.',
    points: ['Boîte de réception et messages envoyés', 'Réponse rapide', 'Compteur de messages non lus'],
    image: '/screens/messagerie.webp',
    alt: 'Messagerie interne avec la liste des messages reçus et un message ouvert',
  },
]

const FEATURES = [
  { Icon: FolderKanban, title: 'Kanban', text: 'Tâches, priorités, échéances et assignations.' },
  { Icon: Wallet, title: 'Budgets', text: 'Dépenses par catégorie et reste à dépenser.' },
  { Icon: BarChart3, title: 'Graphiques', text: 'Tableau de bord visuel et accessible.' },
  { Icon: MessageSquare, title: 'Messagerie', text: 'Discussions internes centralisées.' },
  { Icon: UserCog, title: 'Rôles', text: 'Administrateur, manager et employé.' },
  { Icon: KeyRound, title: 'Invitations', text: 'Votre équipe rejoint l’espace par email.' },
]

const STEPS = [
  { title: 'Créez l’espace de votre entreprise', text: 'Inscription gratuite en moins d’une minute : vous en devenez l’administrateur.' },
  { title: 'Invitez votre équipe', text: 'Une invitation par email à chaque collègue, avec le rôle de votre choix.' },
  { title: 'Pilotez votre activité', text: 'Projets, tâches, budgets et échanges suivis depuis un seul tableau de bord.' },
]

const SECURITY = [
  'Mots de passe chiffrés avec BCrypt',
  'Authentification par jeton JWT',
  'Données isolées entre entreprises',
  'Droits vérifiés sur chaque action',
]

const PLANS = [
  {
    name: 'Gratuit',
    price: 0,
    description: 'Pour découvrir DevManager avec une petite équipe.',
    features: ['3 projets', '5 membres', 'Tâches Kanban et tableau de bord', 'Messagerie interne'],
  },
  {
    name: 'Pro',
    price: 15000,
    description: 'Pour les entreprises qui grandissent, sans limite.',
    features: ['Projets illimités', 'Membres illimités', 'Toutes les fonctionnalités', 'Support prioritaire'],
    highlighted: true,
  },
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
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const actions = isAuthenticated ? (
    <Link to="/app" className={buttonClasses('primary')}>
      Ouvrir l’application
    </Link>
  ) : (
    <>
      <Link to="/login" className={buttonClasses('ghost')}>
        Se connecter
      </Link>
      <Link to="/register" className={buttonClasses('primary')}>
        Commencer
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {label}
            </a>
          ))}
          <Link to="/aide" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Aide
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">{actions}</div>
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {label}
            </a>
          ))}
          <Link to="/aide" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Aide
          </Link>
          <div className="flex flex-col gap-2 pt-3">{actions}</div>
        </div>
      )}
    </header>
  )
}

function Hero() {
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
          Gestion d’entreprise tout-en-un
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.05]">
          Projets, budgets et équipe,{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            au même endroit
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          DevManager remplace les tableurs éparpillés et les emails perdus : suivez chaque projet en Kanban, maîtrisez vos
          dépenses et échangez avec votre équipe dans une seule application.
        </p>
        <div className="mx-auto mt-9 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Link to="/app" className={buttonClasses('primary', 'px-6 py-3 text-base')}>
              Ouvrir l’application
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <>
              <DemoButton variant="primary" className="[&_button]:px-6 [&_button]:py-3 [&_button]:text-base">
                Essayer la démo
              </DemoButton>
              <Link to="/register" className={buttonClasses('secondary', 'px-6 py-3 text-base')}>
                Créer mon espace gratuit
              </Link>
            </>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center gap-3">
          <VideoButton />
          <p className="text-sm text-slate-500">Démo instantanée, sans inscription · Gratuit, sans carte bancaire</p>
        </div>
      </div>

      {/* Captures reelles : ordinateur et mobile */}
      <div className="relative mx-auto mt-16 max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <BrowserFrame
          src="/screens/02-tableau-de-bord.webp"
          alt="Tableau de bord de DevManager avec les chiffres clés, les budgets par projet et l’avancement des tâches"
          eager
        />
        <div className="absolute -right-2 bottom-8 hidden w-[19%] overflow-hidden rounded-[1.6rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl md:block lg:right-2">
          <img src="/screens/06-mobile.webp" alt="DevManager sur téléphone : tableau Kanban" className="block w-full" loading="lazy" width="780" height="1688" />
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {HIGHLIGHTS.map(({ Icon, label }) => (
          <li key={label} className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700">
            <Icon className="size-5 text-indigo-600" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Showcases() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl space-y-24 px-4 sm:px-6 lg:space-y-32">
        {SHOWCASES.map(({ eyebrow, title, text, points, image, alt }, index) => (
          <div key={title} className="grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
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
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Tout ce qu’il faut, rien de superflu</h2>
          <p className="mt-4 text-lg text-slate-600">Une interface simple, pensée pour les petites et moyennes entreprises.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-200">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-on-accent shadow-md shadow-indigo-500/20">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <ol className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ title, text }, index) => (
            <li key={title} className="rounded-2xl bg-slate-50 p-6">
              <span className="text-sm font-bold text-indigo-600">Étape {index + 1}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Security() {
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
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-on-accent sm:text-4xl">Vos données sont protégées</h2>
          <p className="mt-4 text-lg leading-relaxed text-[#cbd5e1]">
            Chaque entreprise travaille dans un espace isolé, et chaque utilisateur ne voit que ce que son rôle autorise.
            Les accès sont contrôlés côté serveur, sur chaque requête.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECURITY.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
              <Lock className="mt-0.5 size-5 shrink-0 text-[#a5b4fc]" aria-hidden />
              <span className="text-sm font-medium text-[#e2e8f0]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="tarifs" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Tarifs</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Une offre simple, sans engagement</h2>
          <p className="mt-4 text-lg text-slate-600">Commencez gratuitement, passez à l’offre Pro quand votre équipe grandit.</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map(({ name, price, description, features, highlighted }) => (
            <div
              key={name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                highlighted ? 'bg-[#0b1020] text-on-accent shadow-2xl ring-2 ring-indigo-500' : 'bg-white ring-1 ring-slate-200'
              }`}
            >
              {highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-semibold text-on-accent">
                  Recommandé
                </span>
              )}
              <h3 className={`text-lg font-semibold ${highlighted ? 'text-on-accent' : 'text-slate-900'}`}>{name}</h3>
              <p className={`mt-2 text-sm ${highlighted ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>{description}</p>
              <p className="mt-6">
                <span className="text-4xl font-extrabold tracking-tight">{price === 0 ? 'Gratuit' : formatCurrency(price)}</span>
                {price > 0 && <span className="text-[#cbd5e1]"> / mois</span>}
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
                {highlighted ? 'Commencer, puis passer en Pro' : 'Commencer gratuitement'}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Projet de démonstration : le paiement de l’offre Pro est simulé, aucun montant n’est prélevé.
        </p>
      </div>
    </section>
  )
}

function CallToAction() {
  const { isAuthenticated } = useAuth()
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed 60%, #a21caf)' }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-on-accent sm:text-4xl">Voyez par vous-même</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#e0e7ff]">
            Explorez une entreprise fictive déjà remplie : projets, tâches, budgets et messages. Aucune inscription
            nécessaire.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link to="/app" className={buttonClasses('secondary', 'px-6 py-3 text-base')}>
                Ouvrir l’application
              </Link>
            ) : (
              <>
                <DemoButton className="[&_button]:px-6 [&_button]:py-3 [&_button]:text-base">Essayer la démo</DemoButton>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-on-accent ring-1 ring-white/40 hover:bg-white/10"
                >
                  Créer mon espace
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
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-500">© {YEAR} DevManager. Projet réalisé par TAGUE.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600" aria-label="Liens utiles">
          <Link to="/aide" className="flex items-center gap-1.5 hover:text-slate-900">
            <LifeBuoy className="size-4" aria-hidden />
            Centre d'aide
          </Link>
          <a href="https://github.com/TAGUE-GITH/DevManager" target="_blank" rel="noreferrer" className="hover:text-slate-900">
            Code source sur GitHub
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
