import { BarChart3, Table2 } from 'lucide-react'
import { useState } from 'react'
import Card from '../ui/Card'

/**
 * Cadre commun des graphiques : titre, sous-titre et bascule Graphique / Tableau.
 * La vue tableau donne acces aux valeurs exactes (lecteurs d'ecran, impression, daltonisme).
 */
export default function ChartCard({ title, subtitle, table, className = '', children }) {
  const [view, setView] = useState('chart')

  return (
    <Card className={`flex flex-col p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {table && (
          <div className="flex shrink-0 rounded-lg bg-slate-100 p-0.5" role="group" aria-label={`Affichage : ${title}`}>
            {[
              { value: 'chart', label: 'Graphique', Icon: BarChart3 },
              { value: 'table', label: 'Tableau', Icon: Table2 },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setView(value)}
                aria-pressed={view === value}
                title={label}
                className={`rounded-md p-1.5 transition ${
                  view === value ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span className="sr-only">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1">{view === 'chart' || !table ? children : <DataTable {...table} />}</div>
    </Card>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs font-medium text-slate-500 uppercase">
          <tr className="border-b border-slate-200">
            {columns.map((column, index) => (
              <th key={column} scope="col" className={`py-2 ${index > 0 ? 'text-right' : ''}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={`py-2 ${index > 0 ? 'text-right text-slate-700 tabular-nums' : 'font-medium text-slate-900'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
