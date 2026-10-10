import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { helpCategories } from './helpArticles'

// Ignore majuscules et accents dans la recherche ("creer" trouve "créer")
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

function Article({ article }) {
  return (
    <details id={article.id} className="group rounded-xl bg-white ring-1 ring-slate-200 open:ring-indigo-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
        {article.question}
        <ChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-2 px-5 pb-5 text-sm leading-relaxed text-slate-600">
        {article.answer.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  )
}

// Centre d'aide : recherche et articles par categorie (utilise dans l'application et sur la page publique /aide)
export default function HelpCenter() {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const terms = normalize(query.trim())

  const categories = helpCategories(i18n.language).map((category) => ({
    ...category,
    articles: category.articles.filter((article) =>
      normalize([article.question, ...article.answer].join(' ')).includes(terms),
    ),
  })).filter((category) => category.articles.length > 0)

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('help.searchPlaceholder')}
          aria-label={t('help.searchLabel')}
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pr-4 pl-12 text-sm shadow-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {categories.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">{t('help.noMatch', { query })}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`aide-${category.id}`}>
              <h2 id={`aide-${category.id}`} className="mb-4 text-lg font-semibold text-slate-900">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.articles.map((article) => (
                  <Article key={article.id} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
