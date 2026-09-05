import { useTranslation } from 'react-i18next'
import type { TeamCharter } from '../../types'
import { IdentityCardIcon } from '../icons'

interface IntroScreenProps {
  showDraftBanner: boolean
  onResumeDraft: () => void
  onDiscardDraft: () => void
  onStart: () => void
  savedCharter: TeamCharter | null
  onLoadSaved: (charter: TeamCharter) => void
  libraryCount: number
  onOpenMyTeams: () => void
}

export default function IntroScreen({
  showDraftBanner,
  onResumeDraft,
  onDiscardDraft,
  onStart,
  savedCharter,
  onLoadSaved,
  libraryCount,
  onOpenMyTeams,
}: IntroScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="flex justify-center mb-4">
        <IdentityCardIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
      </div>
      <h1 className="text-3xl font-bold mb-3">{t('intro.headline')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{t('intro.body')}</p>

      {/* Draft resume banner */}
      {showDraftBanner && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-6 gap-3 text-left">
          <p className="text-sm text-blue-800 dark:text-blue-300 flex-1">{t('draft.resume_prompt')}</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={onResumeDraft} className="text-sm font-medium text-blue-900 dark:text-blue-100 bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">
              {t('draft.resume')}
            </button>
            <button onClick={onDiscardDraft} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 px-2 py-1 rounded-lg transition-colors">
              {t('draft.discard')}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={onStart} className="btn-primary text-base px-8 py-3">{t('intro.start')}</button>
        {savedCharter && (
          <button onClick={() => onLoadSaved(savedCharter)} className="btn-secondary">
            {t('intro.load')}
          </button>
        )}
        {libraryCount > 0 && (
          <button onClick={onOpenMyTeams} className="btn-secondary">
            {t('teams.title')} ({libraryCount})
          </button>
        )}
      </div>
    </div>
  )
}
