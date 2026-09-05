import { useTranslation } from 'react-i18next'
import type { TeamCharter, HistoryEntry } from '../types'
import { diffCharterFields } from '../charterLogic'

interface HistoryPanelProps {
  history: HistoryEntry[]
  charter: TeamCharter
  compareId: string | null
  onSetCompareId: (id: string | null) => void
  onRestore: (entry: HistoryEntry) => void
}

export default function HistoryPanel({ history, charter, compareId, onSetCompareId, onRestore }: HistoryPanelProps) {
  const { t } = useTranslation()
  const base = compareId ? history.find(h => h.id === compareId) : undefined

  return (
    <div className="no-print mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{t('history.title')}</h2>
        {history.length >= 2 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('history.compare_hint')}</p>
        )}
      </div>

      {base && (() => {
        const { addedValues, removedValues, keptValues, addedAgreements, removedAgreements } =
          diffCharterFields(base, charter)

        return (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('history.comparing', { date: new Date(base.savedAt).toLocaleDateString() })}
              </p>
              <button onClick={() => onSetCompareId(null)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">{t('history.close_compare')}</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('history.values_diff')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {removedValues.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-full text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 line-through">{v}</span>
                  ))}
                  {keptValues.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{v}</span>
                  ))}
                  {addedValues.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded-full text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">{v}</span>
                  ))}
                </div>
                {addedValues.length === 0 && removedValues.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">{t('history.no_changes')}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('history.agreements_diff')}</p>
                <ul className="space-y-1">
                  {removedAgreements.map(a => (
                    <li key={a.id} className="text-xs text-red-500 dark:text-red-400 line-through">{a.text}</li>
                  ))}
                  {charter.agreements.filter(a => !addedAgreements.find(b => b.id === a.id)).map(a => (
                    <li key={a.id} className="text-xs text-gray-400 dark:text-gray-500">{a.text}</li>
                  ))}
                  {addedAgreements.map(a => (
                    <li key={a.id} className="text-xs text-green-600 dark:text-green-400">{a.text}</li>
                  ))}
                </ul>
                {addedAgreements.length === 0 && removedAgreements.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">{t('history.no_changes')}</p>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      <div className="space-y-2">
        {history.map((entry, i) => (
          <div
            key={entry.id}
            className={`bg-white dark:bg-gray-900 border rounded-xl px-4 py-3 flex items-center gap-3 ${compareId === entry.id ? 'border-brand-400 ring-1 ring-brand-300' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <span className="text-2xl">{entry.customSymbol || entry.symbol}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-50 truncate">{entry.teamName || t('charter.team_name_fallback')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {i === 0 ? t('history.latest') : new Date(entry.savedAt).toLocaleString()} · {entry.values.length} {t('values.selected')}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => onSetCompareId(compareId === entry.id ? null : entry.id)}
                className={`btn-secondary text-xs ${compareId === entry.id ? 'bg-brand-50 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400' : ''}`}
              >
                {compareId === entry.id ? t('history.comparing_active') : t('history.compare')}
              </button>
              <button
                onClick={() => onRestore(entry)}
                className="btn-ghost text-xs"
              >
                {t('history.restore')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
