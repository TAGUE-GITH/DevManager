import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FolderKanban,
  KeyRound,
  Lock,
  Menu,
  MessageSquare,
  ShieldCheck,
  UserCog,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPreview from '../components/landing/AppPreview'
import Logo from '../components/Logo'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../context/useAuth'
import { formatCurrency } from '../utils/format'

const NAV_LINKS = [
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#fonctionnement', label: 'Comment ça marche' },
  { href: '#securite', label: 'Sécurité' },
  { href: '#tarifs', label: 'Tarifs' },
]

const FEATURES = [
  {
    Icon: FolderKanban,
    title: 'Projets et tâches Kanban',
    text: 'Répartissez le travail en tâches sur un tableau Kanban : glissez-déposez, assignez, suivez les échéances.',
  },
  {
    Icon: Wallet,
    title: 'Suivi budgétaire',
    text: 'Enregistrez chaque dépense par catégorie et voyez en direct le budget restant.',
  },
  {
    Icon: MessageSquare,
    title: 'Messagerie interne',
    text: 'Échangez avec vos collègues sans quitter l’application, avec suivi des messages non lus.',
  },
  {
    Icon: BarChart3,
    title: 'Tableau de bord visuel',
    text: 'Graphiques des budgets, des dépenses par mois et par catégorie, et de l’avancement des tâches.',
  },
  {
    Icon: UserCog,
    title: 'Rôles et permissions',
    text: 'Administrateurs, managers et employés : chacun accède uniquement à ce qui le concerne.',
  },
  {
    Icon: KeyRound,
    title: 'Accès sécurisé',
    text: 'Connexion protégée et réinitialisation du mot de passe par email en toute sécurité.',
  },
]

const STEPS = [
  { title: 'Créez l’espace de votre entreprise', text: 'Inscription gratuite en moins d’une minute : vous devenez l’administrateur de votre espace.' },
  { title: 'Invitez votre équipe', text: 'Envoyez une invitation par email à chaque collègue, avec le rôle de votre choix.' },
  { title: 'Pilotez votre activité', text: 'Suivez l’avancement, les dépenses et les échanges depuis un seul tableau de bord.' },
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

const SECURITY = [
  'Mots de passe chiffrés avec BCrypt',
  'Authentification par jeton JWT',
  'Droits vérifiés sur chaque action',
  'Connexion HTTPS de bout en bout',
]

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
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {label}
            </a>
          ))}
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
          <div className="flex flex-col gap-2 pt-3">{actions}</div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-to-b from-indigo-50 to-transparent" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-24 lg:pb-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
            <span className="size-1.5 rounded-full bg-indigo-600" />
            Gestion d’entreprise tout-en-un
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            Pilotez vos projets, vos budgets et votre équipe{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              au même endroit
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            DevManager remplace les tableurs éparpillés et les emails perdus : suivez l’avancement de chaque projet,
            maîtrisez vos dépenses et échangez avec vos collègues dans une seule application.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={buttonClasses('primary', 'px-6 py-3 text-base')}>
              Commencer gratuitement
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link to="/login" className={buttonClasses('secondary', 'px-6 py-3 text-base')}>
              J’ai déjà un compte
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
            Gratuit, sans carte bancaire
          </p>
        </div>
        <AppPreview />
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Fonctionnalités</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tout ce qu’il faut pour gérer votre activité
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Trois outils réunis dans une interface simple, pensée pour les petites et moyennes entreprises.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl p-6 ring-1 ring-slate-200 transition hover:shadow-lg hover:ring-indigo-200">
              <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="fonctionnement" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Comment ça marche</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Opérationnel en trois étapes</h2>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map(({ title, text }, index) => (
            <li key={title} className="relative rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200">
              <span className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-700">
                {index + 1}
              </span>
              <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
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
    <section id="securite" className="scroll-mt-20 bg-slate-900 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Vos données sont protégées</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Chaque utilisateur ne voit que ce que son rôle autorise. Les accès sont contrôlés côté serveur, sur
            chaque requête.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECURITY.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
              <Lock className="mt-0.5 size-5 shrink-0 text-indigo-300" aria-hidden />
              <span className="text-sm font-medium text-slate-200">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="tarifs" className="scroll-mt-20 bg-white py-20 sm:py-24">
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
              className={`flex flex-col rounded-2xl p-8 ${
                highlighted ? 'bg-slate-900 text-white ring-2 ring-indigo-500' : 'bg-white ring-1 ring-slate-200'
              }`}
            >
              <h3 className={`text-lg font-semibold ${highlighted ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
              <p className={`mt-2 text-sm ${highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight">{price === 0 ? 'Gratuit' : formatCurrency(price)}</span>
                {price > 0 && <span className={highlighted ? 'text-slate-300' : 'text-slate-500'}> / mois</span>}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      className={`size-5 shrink-0 ${highlighted ? 'text-indigo-300' : 'text-indigo-600'}`}
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
                {highlighted ? 'Essayer, puis passer en Pro' : 'Commencer gratuitement'}
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
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Prêt à simplifier votre gestion ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Chaque entreprise dispose de son propre espace, isolé et sécurisé. Créez le vôtre en quelques secondes.
          </p>
          <Link
            to="/register"
            className={buttonClasses('secondary', 'mt-8 px-6 py-3 text-base text-indigo-700 ring-0 hover:bg-indigo-50')}
          >
            Créer mon compte gratuit
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Logo />
        <p className="text-sm text-slate-500">© {YEAR} DevManager. Projet réalisé par TAGUE.</p>
        <a
          href="https://github.com/TAGUE-GITH/DevManager"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Code source sur GitHub
        </a>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-slate-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
