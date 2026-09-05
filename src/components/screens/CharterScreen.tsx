import { useTranslation } from 'react-i18next'
import type { TeamCharter, SavedCharter, HistoryEntry } from '../../types'
import { SCRUM_VALUES, SCRUM_VALUE_MAP } from '../../data/scrum-values-map'
import { scrumValuesCovered, LIBRARY_CAP } from '../../charterLogic'
import { CheckIcon, ArrowLeftIcon } from '../icons'
import HistoryPanel from '../HistoryPanel'

interface CharterScreenProps {
  charter: TeamCharter
  saved: boolean
  onSaveCharter: () => void
  copying: boolean
  onCopyImage: () => void
  linkCopied: boolean
  onShareLink: () => void
  showScrumAlignment: boolean
  onToggleScrumAlignment: () => void
  history: HistoryEntry[]
  showHistory: boolean
  onToggleHistory: () => void
  compareId: string | null
  onSetCompareId: (id: string | null) => void
  onRestoreHistoryEntry: (entry: HistoryEntry) => void
  wpParticipants: string[] | null
  onImportWp: () => void
  library: SavedCharter[]
  showSaveToLibrary: boolean
  libraryName: string
  librarySaved: boolean
  onShowSaveToLibrary: () => void
  onLibraryNameChange: (v: string) => void
  onSaveToLibrary: () => void
  onCancelSaveToLibrary: () => void
  onOpenMyTeams: () => void
  onBack: () => void
  onRestart: () => void
  facilitatorMode: boolean
}

export default function CharterScreen({
  charter,
  saved,
  onSaveCharter,
  copying,
  onCopyImage,
  linkCopied,
  onShareLink,
  showScrumAlignment,
  onToggleScrumAlignment,
  history,
  showHistory,
  onToggleHistory,
  compareId,
  onSetCompareId,
  onRestoreHistoryEntry,
  wpParticipants,
  onImportWp,
  library,
  showSaveToLibrary,
  libraryName,
  librarySaved,
  onShowSaveToLibrary,
  onLibraryNameChange,
  onSaveToLibrary,
  onCancelSaveToLibrary,
  onOpenMyTeams,
  onBack,
  onRestart,
  facilitatorMode,
}: CharterScreenProps) {
  const { t } = useTranslation()
  const displaySymbol = charter.customSymbol || charter.symbol

  return (
    <div className="max-w-2xl mx-auto">
      <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{t('charter.title')}</h1>
        <div className="flex gap-2 flex-wrap">
          {wpParticipants && !charter.members && (
            <button onClick={onImportWp} className="btn-secondary text-sm">
              {t('charter.import_wp')}
            </button>
          )}
          <button onClick={onSaveCharter} className="btn-primary">{saved ? t('charter.saved') : t('charter.save')}</button>
          <button onClick={onCopyImage} disabled={copying} className="btn-secondary">{copying ? '…' : t('charter.share')}</button>
          <button onClick={onShareLink} className="btn-secondary">{linkCopied ? t('charter.share_copied') : t('charter.share_url')}</button>
          <button onClick={() => window.print()} className="btn-secondary">{t('charter.print')}</button>
          <button onClick={onToggleScrumAlignment} className={`btn-secondary text-sm ${showScrumAlignment ? 'ring-2 ring-brand-400' : ''}`}>{showScrumAlignment ? t('charter.scrum_toggle_hide') : t('charter.scrum_toggle_show')}</button>
          {history.length > 0 && (
            <button onClick={onToggleHistory} className={`btn-secondary text-sm ${showHistory ? 'ring-2 ring-brand-400' : ''}`}>
              {t('history.title')} ({history.length})
            </button>
          )}
          <button onClick={onRestart} className="btn-ghost">{t('charter.restart')}</button>
        </div>
      </div>

      {/* Save to Library */}
      <div className="no-print mb-4">
        {!showSaveToLibrary ? (
          <div className="flex items-center gap-2">
            {librarySaved ? (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t('teams.saved_to_library')}</span>
            ) : library.length >= LIBRARY_CAP ? (
              <span className="text-xs text-amber-600 dark:text-amber-400">{t('teams.cap_warning')}</span>
            ) : (
              <button onClick={onShowSaveToLibrary} className="btn-ghost text-sm">
                + {t('teams.save_to_library')}
              </button>
            )}
            {library.length > 0 && (
              <button onClick={onOpenMyTeams} className="btn-ghost text-sm">
                {t('teams.title')} ({library.length})
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              className="input flex-1 max-w-xs"
              placeholder={t('teams.save_name_placeholder')}
              value={libraryName}
              onChange={e => onLibraryNameChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && libraryName.trim()) onSaveToLibrary() }}
            />
            <button onClick={onSaveToLibrary} disabled={!libraryName.trim()} className="btn-primary text-sm">{t('teams.save_confirm')}</button>
            <button onClick={onCancelSaveToLibrary} className="btn-ghost text-sm">{t('teams.cancel')}</button>
          </div>
        )}
      </div>

      {/* Charter card */}
      <div
        className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-2xl mb-6"
        id="charter-card"
        role="region"
        aria-label={t('charter.title')}
      >
        <div className="text-center mb-6">
          <div className={`${facilitatorMode ? 'text-9xl' : 'text-7xl'} mb-3`}>{displaySymbol}</div>
          <h2 className="text-3xl font-bold">{charter.teamName || t('charter.team_name_fallback')}</h2>
          <p className="text-brand-200 text-sm mt-1">{t('charter.created')}: {new Date().toLocaleDateString()}</p>
        </div>

        {charter.members && charter.members.length > 0 && (
          <div className="mb-5">
            <h3 className="font-semibold text-brand-100 text-xs uppercase tracking-wider mb-2">{t('charter.members_title')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {charter.members.map(m => (
                <span key={m} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{m}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-brand-100 text-xs uppercase tracking-wider mb-2">{t('charter.values_title')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {charter.values.map(v => {
                const tags = SCRUM_VALUE_MAP[v] ?? []
                return (
                  <div key={v} className="flex flex-col items-start gap-0.5">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{v}</span>
                    {showScrumAlignment && tags.length > 0 && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-brand-200 ml-1">{tags.join(', ')}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-brand-100 text-xs uppercase tracking-wider mb-2">{t('charter.agreements_title')}</h3>
            <ul className="space-y-1">
              {charter.agreements.slice(0, 5).map(ag => (
                <li key={ag.id} className="text-xs text-brand-100 flex gap-1.5">
                  <span className="text-brand-300 mt-0.5"><CheckIcon className="w-3 h-3" /></span>
                  {ag.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {showScrumAlignment && (() => {
          const covered = scrumValuesCovered(charter.values)
          return (
            <div className="mt-5 pt-4 border-t border-white/20">
              <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider mb-2">{t('charter.scrum_coverage', { covered: covered.size })}</p>
              <div className="flex flex-wrap gap-1.5">
                {SCRUM_VALUES.map(sv => (
                  <span key={sv} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${covered.has(sv) ? 'bg-white/25 text-white' : 'bg-white/10 text-brand-300 line-through'}`}>{sv}</span>
                ))}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Charter History Panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          charter={charter}
          compareId={compareId}
          onSetCompareId={onSetCompareId}
          onRestore={onRestoreHistoryEntry}
        />
      )}

      <div className="no-print flex justify-start">
        <button onClick={onBack} className="btn-ghost inline-flex items-center gap-1"><ArrowLeftIcon className="w-3.5 h-3.5" /> {t('common.back')}</button>
      </div>
    </div>
  )
}
