import { useTranslation } from 'react-i18next'
import type { TeamCharter } from '../../types'
import { ArrowRightIcon } from '../icons'

interface NameStepProps {
  charter: TeamCharter
  onPatch: (partial: Partial<TeamCharter>) => void
  onBack: () => void
  onNext: () => void
  canNext: boolean
}

export default function NameStep({ charter, onPatch, onBack, onNext, canNext }: NameStepProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t('name.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('name.subtitle')}</p>
      <input
        autoFocus
        className="input text-2xl font-semibold py-4 mb-3"
        placeholder={t('name.placeholder')}
        value={charter.teamName}
        onChange={e => onPatch({ teamName: e.target.value })}
      />
      <p className="text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-2 mb-6">{t('name.tip')}</p>
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">{t('common.back')}</button>
        <button onClick={onNext} disabled={!canNext} className="btn-primary inline-flex items-center gap-1">{t('common.next')} <ArrowRightIcon className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}
