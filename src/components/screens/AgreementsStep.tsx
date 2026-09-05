import { useTranslation } from 'react-i18next'
import type { TeamCharter } from '../../types'
import { AGREEMENT_PROMPTS } from '../../data/symbols'
import { ThumbsUpIcon, ArrowRightIcon } from '../icons'

interface AgreementsStepProps {
  charter: TeamCharter
  onPatch: (partial: Partial<TeamCharter>) => void
  newAgreement: string
  onNewAgreementChange: (v: string) => void
  onAddAgreement: (text: string) => void
  onBack: () => void
  onNext: () => void
}

export default function AgreementsStep({
  charter,
  onPatch,
  newAgreement,
  onNewAgreementChange,
  onAddAgreement,
  onBack,
  onNext,
}: AgreementsStepProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t('agreements.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{t('agreements.subtitle')}</p>

      {/* Active agreements */}
      {charter.agreements.length > 0 && (
        <div className="space-y-2 mb-5">
          {charter.agreements.map(ag => (
            <div key={ag.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5">
              <button
                onClick={() => onPatch({ agreements: charter.agreements.map(a => a.id === ag.id ? { ...a, votes: a.votes + 1 } : a) })}
                aria-label={`${t('agreements.upvote')} — ${ag.text}`}
                title={t('agreements.upvote')}
                className="inline-flex items-center gap-1 text-sm"
              ><ThumbsUpIcon className="w-3.5 h-3.5" /> {ag.votes > 0 && <span className="text-xs text-gray-500 dark:text-gray-400">{ag.votes}</span>}</button>
              <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{ag.text}</span>
              <button
                onClick={() => onPatch({ agreements: charter.agreements.filter(a => a.id !== ag.id) })}
                aria-label={`${t('agreements.delete')} — ${ag.text}`}
                className="text-gray-200 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 text-xs"
              >{t('agreements.delete')}</button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom */}
      <div className="flex gap-2 mb-5">
        <input className="input flex-1" placeholder={t('agreements.custom_placeholder')} value={newAgreement} onChange={e => onNewAgreementChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newAgreement.trim()) { onAddAgreement(newAgreement); onNewAgreementChange('') } }} />
        <button onClick={() => { onAddAgreement(newAgreement); onNewAgreementChange('') }} disabled={!newAgreement.trim()} className="btn-primary text-sm">
          + {t('agreements.add_custom')}
        </button>
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{t('agreements.suggestions')}</p>
        <div className="space-y-1">
          {AGREEMENT_PROMPTS.filter(p => !charter.agreements.find(a => a.text === p)).map(prompt => (
            <button key={prompt} onClick={() => onAddAgreement(prompt)} className="w-full text-left text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl px-3 py-1.5 transition-colors">
              + {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">{t('common.back')}</button>
        <button onClick={onNext} className="btn-primary inline-flex items-center gap-1">{t('common.next')} <ArrowRightIcon className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}
