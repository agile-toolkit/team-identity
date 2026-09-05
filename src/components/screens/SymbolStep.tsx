import { useTranslation } from 'react-i18next'
import type { TeamCharter } from '../../types'
import { SYMBOLS } from '../../data/symbols'
import { ArrowRightIcon } from '../icons'

interface SymbolStepProps {
  charter: TeamCharter
  onPatch: (partial: Partial<TeamCharter>) => void
  onBack: () => void
  onNext: () => void
  canNext: boolean
  facilitatorMode: boolean
}

export default function SymbolStep({ charter, onPatch, onBack, onNext, canNext, facilitatorMode }: SymbolStepProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t('symbol.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('symbol.subtitle')}</p>
      <div
        role="radiogroup"
        aria-label={t('symbol.title')}
        className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6"
        onKeyDown={e => {
          const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
          const idx = btns.indexOf(e.target as HTMLButtonElement)
          if (idx === -1) return
          const firstTop = btns[0].getBoundingClientRect().top
          const cols = btns.filter(b => Math.abs(b.getBoundingClientRect().top - firstTop) < 4).length || 8
          let next = -1
          if (e.key === 'ArrowRight') next = Math.min(idx + 1, btns.length - 1)
          else if (e.key === 'ArrowLeft') next = Math.max(idx - 1, 0)
          else if (e.key === 'ArrowDown') next = Math.min(idx + cols, btns.length - 1)
          else if (e.key === 'ArrowUp') next = Math.max(idx - cols, 0)
          else if (e.key === 'Home') next = 0
          else if (e.key === 'End') next = btns.length - 1
          else return
          e.preventDefault()
          btns[next].focus()
          const sym = SYMBOLS[next]
          if (sym) onPatch({ symbol: sym.emoji, customSymbol: '' })
        }}
      >
        {SYMBOLS.map((s, i) => {
          const isChecked = charter.symbol === s.emoji && !charter.customSymbol
          const noneSelected = !charter.symbol && !charter.customSymbol
          return (
            <button
              key={s.emoji}
              role="radio"
              aria-checked={isChecked}
              tabIndex={isChecked || (noneSelected && i === 0) ? 0 : -1}
              onClick={() => onPatch({ symbol: s.emoji, customSymbol: '' })}
              title={`${s.name}: ${s.meaning}`}
              className={`rounded-2xl transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none ${
                facilitatorMode ? 'p-4 text-5xl' : 'p-2 text-3xl'
              } ${
                isChecked
                  ? `bg-brand-100 dark:bg-brand-700/20 scale-110 ${facilitatorMode ? 'ring-4 ring-brand-500' : 'ring-2 ring-brand-400'}`
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500'
              }`}
            >
              {s.emoji}
            </button>
          )
        })}
      </div>
      {charter.symbol && !charter.customSymbol && (
        <p className="text-sm text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-2 mb-4">
          {SYMBOLS.find(s => s.emoji === charter.symbol)?.meaning}
        </p>
      )}
      <div className="mb-6">
        <label htmlFor="custom-symbol-input" className="label">{t('symbol.custom_label')}</label>
        <input
          id="custom-symbol-input"
          className="input max-w-xs text-2xl"
          placeholder={t('symbol.custom_placeholder')}
          value={charter.customSymbol}
          onChange={e => onPatch({ customSymbol: e.target.value, symbol: e.target.value ? '' : charter.symbol })}
        />
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">{t('common.back')}</button>
        <button onClick={onNext} disabled={!canNext} className="btn-primary inline-flex items-center gap-1">{t('common.next')} <ArrowRightIcon className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}
