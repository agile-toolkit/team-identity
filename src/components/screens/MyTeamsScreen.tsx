import { useTranslation } from 'react-i18next'
import type { RefObject } from 'react'
import type { SavedCharter } from '../../types'
import AppHeader from '../AppHeader'
import ThemeToggle from '../ThemeToggle'

interface MyTeamsScreenProps {
  library: SavedCharter[]
  onClose: () => void
  onExport: () => void
  onImport: (file: File) => void
  importResult: string | null
  importFileRef: RefObject<HTMLInputElement>
  onLoad: (saved: SavedCharter) => void
  onDelete: (id: string) => void
  renamingId: string | null
  renameValue: string
  onStartRename: (id: string, currentName: string) => void
  onRenameValueChange: (v: string) => void
  onConfirmRename: (id: string, newName: string) => void
  onCancelRename: () => void
}

export default function MyTeamsScreen({
  library,
  onClose,
  onExport,
  onImport,
  importResult,
  importFileRef,
  onLoad,
  onDelete,
  renamingId,
  renameValue,
  onStartRename,
  onRenameValueChange,
  onConfirmRename,
  onCancelRename,
}: MyTeamsScreenProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col" data-accent="amber">
      <AppHeader title={t('app.title')} onTitleClick={onClose}>
        <ThemeToggle />
      </AppHeader>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">{t('teams.title')}</h1>
          <div className="flex items-center gap-2">
            {library.length > 0 && (
              <button onClick={onExport} className="btn-secondary text-sm">{t('teams.export')}</button>
            )}
            <button onClick={() => importFileRef.current?.click()} className="btn-secondary text-sm">{t('teams.import')}</button>
            <input
              ref={importFileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) onImport(file)
                e.target.value = ''
              }}
            />
            <button onClick={onClose} className="btn-ghost">{t('common.back')}</button>
          </div>
        </div>
        {importResult && (
          <p className="text-sm text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-2 mb-4">
            {importResult}
          </p>
        )}
        {library.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-16">{t('teams.empty')}</p>
        ) : (
          <div className="space-y-3">
            {library.map(saved => (
              <div key={saved.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-4">
                <span className="text-3xl">{saved.customSymbol || saved.symbol}</span>
                <div className="flex-1 min-w-0">
                  {renamingId === saved.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        autoFocus
                        className="input flex-1 text-sm"
                        value={renameValue}
                        onChange={e => onRenameValueChange(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && renameValue.trim()) onConfirmRename(saved.id, renameValue) }}
                      />
                      <button onClick={() => onConfirmRename(saved.id, renameValue)} disabled={!renameValue.trim()} className="btn-primary text-xs">{t('teams.rename_confirm')}</button>
                      <button onClick={onCancelRename} className="btn-ghost text-xs">{t('teams.cancel')}</button>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900 dark:text-gray-50 truncate">{saved.libraryName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{saved.teamName} · {saved.values.length} {t('values.selected')} · {new Date(saved.savedAt ?? 0).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
                {renamingId !== saved.id && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => onLoad(saved)}
                      className="btn-primary text-sm"
                    >{t('teams.load')}</button>
                    <button
                      onClick={() => onStartRename(saved.id, saved.libraryName)}
                      className="btn-secondary text-sm"
                    >{t('teams.rename')}</button>
                    <button
                      onClick={() => onDelete(saved.id)}
                      className="btn-ghost text-sm text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >{t('teams.delete')}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
