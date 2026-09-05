import { useTranslation } from 'react-i18next'
import type { TeamCharter } from '../../types'
import { VALUE_CARDS } from '../../data/symbols'
import { CloseIcon, ArrowRightIcon } from '../icons'

interface ValuesStepProps {
  charter: TeamCharter
  onToggleValue: (v: string) => void
  customValue: string
  onCustomValueChange: (v: string) => void
  mmMotivators: string[] | null
  mmDismissed: boolean
  mmImported: string[]
  onImportMmMotivators: () => void
  onDismissMm: () => void
  onBack: () => void
  onNext: () => void
  canNext: boolean
  facilitatorMode: boolean
}

export default function ValuesStep({
  charter,
  onToggleValue,
  customValue,
  onCustomValueChange,
  mmMotivators,
  mmDismissed,
  mmImported,
  onImportMmMotivators,
  onDismissMm,
  onBack,
  onNext,
  canNext,
  facilitatorMode,
}: ValuesStepProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t('values.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('values.subtitle')}</p>
      <p className="text-xs text-brand-600 dark:text-brand-400 mb-4">{charter.values.length} {t('values.selected')} — {t('values.min_note')}</p>

      {/* MM import banner */}
      {mmMotivators && !mmDismissed && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-4 gap-3">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">{t('values.import_mm_banner')}</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={onImportMmMotivators} className="text-sm font-medium text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 px-3 py-1 rounded-lg transition-colors">
              {t('values.import_mm_import')}
            </button>
            <button onClick={onDismissMm} className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 px-2 py-1 rounded-lg transition-colors">
              {t('values.import_mm_dismiss')}
            </button>
          </div>
        </div>
      )}

      <div
        role="group"
        aria-label={t('values.title')}
        className="flex flex-wrap gap-2 mb-6"
        onKeyDown={e => {
          const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
          const idx = btns.indexOf(e.target as HTMLButtonElement)
          if (idx === -1) return
          let next = -1
          if (e.key === 'ArrowRight') next = Math.min(idx + 1, btns.length - 1)
          else if (e.key === 'ArrowLeft') next = Math.max(idx - 1, 0)
          else if (e.key === 'Home') next = 0
          else if (e.key === 'End') next = btns.length - 1
          else return
          e.preventDefault()
          btns[next].focus()
        }}
      >
        {VALUE_CARDS.map(v => (
          <button
            key={v}
            aria-pressed={charter.values.includes(v)}
            onClick={() => onToggleValue(v)}
            className={`rounded-xl border font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              facilitatorMode ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
            } ${
              charter.values.includes(v)
                ? `bg-brand-600 text-white border-brand-600 ${facilitatorMode ? 'ring-2 ring-brand-300' : ''}`
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-400 dark:hover:border-brand-500'
            }`}
          >
            {v}
            {mmImported.includes(v) && (
              <span className="ml-1.5 text-[10px] bg-white/25 text-white px-1.5 py-0.5 rounded-full align-middle">
                {t('values.from_mm')}
              </span>
            )}
          </button>
        ))}
        {charter.values.filter(v => !VALUE_CARDS.includes(v)).map(v => (
          <button key={v} onClick={() => onToggleValue(v)}
            aria-pressed={true}
            className={`rounded-xl border font-medium bg-brand-600 text-white border-brand-600 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              facilitatorMode ? 'px-6 py-3 text-base ring-2 ring-brand-300' : 'px-4 py-2 text-sm'
            }`}>
            {v}
            {mmImported.includes(v) && (
              <span className="text-[10px] bg-white/25 text-white px-1.5 py-0.5 rounded-full">
                {t('values.from_mm')}
              </span>
            )}
            <CloseIcon className="w-3 h-3" />
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        <input
          id="custom-value-input"
          aria-label={t('values.custom_placeholder')}
          className="input flex-1"
          placeholder={t('values.custom_placeholder')}
          value={customValue}
          onChange={e => onCustomValueChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && customValue.trim()) { onToggleValue(customValue.trim()); onCustomValueChange('') } }}
        />
        <button onClick={() => { if (customValue.trim()) { onToggleValue(customValue.trim()); onCustomValueChange('') } }} className="btn-secondary">
          {t('values.custom_label')}
        </button>
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">{t('common.back')}</button>
        <button onClick={onNext} disabled={!canNext} className="btn-primary inline-flex items-center gap-1">{t('common.next')} <ArrowRightIcon className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}
