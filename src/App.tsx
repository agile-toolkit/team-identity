import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { WorkshopStep, TeamCharter, SavedCharter, HistoryEntry } from './types'
import AppHeader from './components/AppHeader'
import ThemeToggle from './components/ThemeToggle'
import IntroScreen from './components/screens/IntroScreen'
import NameStep from './components/screens/NameStep'
import SymbolStep from './components/screens/SymbolStep'
import ValuesStep from './components/screens/ValuesStep'
import AgreementsStep from './components/screens/AgreementsStep'
import CharterScreen from './components/screens/CharterScreen'
import MyTeamsScreen from './components/screens/MyTeamsScreen'
import LearnScreen from './components/screens/LearnScreen'
import { writeActiveTeam } from './activeTeam'
import {
  STORAGE_KEY,
  DRAFT_KEY,
  FACILITATOR_KEY,
  LIBRARY_CAP,
  HISTORY_CAP,
  STEPS,
  readWpParticipants,
  readMmTopMotivators,
  loadCharter,
  loadDraft,
  loadCharters,
  persistCharters,
  loadHistory,
  persistHistory,
  defaultCharter,
  encodeCharterHash,
  decodeCharterHash,
  mergeIntoLibrary,
  isSavedCharterShape,
} from './charterLogic'

export {
  readWpParticipants,
  readMmTopMotivators,
  loadCharters,
  loadHistory,
  defaultCharter,
  scrumValuesCovered,
  encodeCharterHash,
  decodeCharterHash,
  mergeIntoLibrary,
  diffCharterFields,
} from './charterLogic'

function ProjectorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1" y="3" width="14" height="9" rx="1"/>
      <path d="M8 12v2M5 14h6"/>
      <circle cx="8" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

export default function App() {
  const { t } = useTranslation()
  const [step, setStep] = useState<WorkshopStep>('intro')
  const [charter, setCharter] = useState<TeamCharter>(defaultCharter)
  const [customValue, setCustomValue] = useState('')
  const [newAgreement, setNewAgreement] = useState('')
  const [saved, setSaved] = useState(false)
  const [copying, setCopying] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showLearn, setShowLearn] = useState(false)
  const [mmMotivators, setMmMotivators] = useState<string[] | null>(null)
  const [mmDismissed, setMmDismissed] = useState(false)
  const [mmImported, setMmImported] = useState<string[]>([])
  const [wpParticipants, setWpParticipants] = useState<string[] | null>(null)
  const [showDraftBanner, setShowDraftBanner] = useState(false)
  const [facilitatorMode, setFacilitatorMode] = useState(() => sessionStorage.getItem(FACILITATOR_KEY) === '1')
  const [showMyTeams, setShowMyTeams] = useState(false)
  const [library, setLibrary] = useState<SavedCharter[]>(loadCharters)
  const [showSaveToLibrary, setShowSaveToLibrary] = useState(false)
  const [libraryName, setLibraryName] = useState('')
  const [librarySaved, setLibrarySaved] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [importResult, setImportResult] = useState<string | null>(null)
  const importFileRef = useRef<HTMLInputElement>(null)
  const [showScrumAlignment, setShowScrumAlignment] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const [compareId, setCompareId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('facilitator-mode', facilitatorMode)
  }, [facilitatorMode])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#charter=')) {
      const decoded = decodeCharterHash(hash.slice('#charter='.length))
      if (decoded) {
        setCharter(decoded)
        setStep('charter')
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
        return
      }
    }

    const draft = loadDraft()
    if (!draft) return
    const saved = loadCharter() as (TeamCharter & { savedAt?: number }) | null
    if (!saved || !saved.savedAt || draft.savedAt > saved.savedAt) {
      setShowDraftBanner(true)
    }
  }, [])

  useEffect(() => {
    if (step === 'values' && !mmDismissed && mmMotivators === null) {
      setMmMotivators(readMmTopMotivators())
    }
    if (step === 'charter' && wpParticipants === null) {
      setWpParticipants(readWpParticipants())
    }
  }, [step])

  useEffect(() => {
    const defaultTitle = 'Team Identity'
    if (step === 'charter') {
      const name = charter.teamName.trim() || t('charter.team_name_fallback')
      document.title = `${name} — Team Charter`
    } else {
      document.title = defaultTitle
    }
    return () => { document.title = defaultTitle }
  }, [step, charter.teamName, t])

  const patch = (partial: Partial<TeamCharter>) => setCharter(c => ({ ...c, ...partial }))

  const toggleFacilitator = () => {
    setFacilitatorMode(m => {
      const next = !m
      sessionStorage.setItem(FACILITATOR_KEY, next ? '1' : '0')
      return next
    })
  }

  const writeDraft = (c: TeamCharter, s: WorkshopStep) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ charter: c, step: s, savedAt: Date.now() }))
    } catch { /* quota exceeded — skip silently */ }
  }

  const resumeDraft = () => {
    const draft = loadDraft()
    if (!draft) return
    setCharter(draft.charter)
    setStep(draft.step)
    setShowDraftBanner(false)
  }

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setShowDraftBanner(false)
  }

  const saveToLibrary = (name: string) => {
    const charters = loadCharters()
    if (charters.length >= LIBRARY_CAP) return
    const entry: SavedCharter = { ...charter, id: crypto.randomUUID(), libraryName: name.trim(), savedAt: Date.now() }
    const updated = [entry, ...charters]
    persistCharters(updated)
    setLibrary(updated)
    setLibraryName('')
    setShowSaveToLibrary(false)
    setLibrarySaved(true)
    setTimeout(() => setLibrarySaved(false), 2000)
  }

  const loadFromLibrary = (saved: SavedCharter) => {
    const { id: _id, libraryName: _name, ...charterData } = saved
    setCharter(charterData)
    setStep('charter')
    setShowMyTeams(false)
  }

  const deleteFromLibrary = (id: string) => {
    if (!window.confirm(t('teams.delete_confirm'))) return
    const updated = library.filter(c => c.id !== id)
    persistCharters(updated)
    setLibrary(updated)
  }

  const renameInLibrary = (id: string, newName: string) => {
    const updated = library.map(c => c.id === id ? { ...c, libraryName: newName.trim() } : c)
    persistCharters(updated)
    setLibrary(updated)
    setRenamingId(null)
    setRenameValue('')
  }

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id)
    setRenameValue(currentName)
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameValue('')
  }

  const exportLibrary = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team-charters-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importLibrary = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result))
        const candidates = Array.isArray(parsed) ? parsed.filter(isSavedCharterShape) : []
        if (candidates.length === 0) {
          setImportResult(t('teams.import_invalid'))
          return
        }
        const { updated, added, duplicates, capSkipped } = mergeIntoLibrary(library, candidates, LIBRARY_CAP)
        persistCharters(updated)
        setLibrary(updated)
        const parts = [t('teams.import_success', { count: added })]
        if (duplicates > 0) parts.push(t('teams.import_duplicates', { count: duplicates }))
        if (capSkipped > 0) parts.push(t('teams.import_cap_skipped', { count: capSkipped }))
        setImportResult(parts.join(' '))
      } catch {
        setImportResult(t('teams.import_invalid'))
      }
    }
    reader.readAsText(file)
  }

  const stepIndex = STEPS.indexOf(step)
  const canNext = (() => {
    if (step === 'name') return charter.teamName.trim().length > 0
    if (step === 'symbol') return charter.symbol !== '' || charter.customSymbol !== ''
    if (step === 'values') return charter.values.length >= 3
    return true
  })()

  const next = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) {
      const nextStep = STEPS[idx + 1]
      setStep(nextStep)
      writeDraft(charter, nextStep)
    }
  }
  const back = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) {
      const prevStep = STEPS[idx - 1]
      setStep(prevStep)
      writeDraft(charter, prevStep)
    }
  }

  const toggleValue = (v: string) => {
    patch({
      values: charter.values.includes(v)
        ? charter.values.filter(x => x !== v)
        : [...charter.values, v],
    })
  }

  const importMmMotivators = () => {
    if (!mmMotivators) return
    const toAdd = mmMotivators.filter(v => !charter.values.includes(v))
    if (toAdd.length > 0) {
      patch({ values: [...charter.values, ...toAdd] })
      setMmImported(prev => [...new Set([...prev, ...toAdd])])
    }
    setMmDismissed(true)
  }

  const addAgreement = (text: string) => {
    if (!text.trim() || charter.agreements.find(a => a.text === text)) return
    patch({ agreements: [...charter.agreements, { id: crypto.randomUUID(), text: text.trim(), votes: 0 }] })
  }

  const saveCharter = () => {
    const now = Date.now()
    const toSave = { ...charter, savedAt: now }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    // Publish the suite-wide team object. This app produces it; every other
    // tool that currently asks for its own team name can read it instead.
    writeActiveTeam(charter.teamName, 'team-identity')
    localStorage.setItem('team-identity:lastSession', JSON.stringify({
      teamName: charter.teamName,
      symbol: charter.customSymbol || charter.symbol,
      valuesCount: charter.values.length,
      agreementsCount: charter.agreements.length,
      membersCount: (charter.members ?? []).length,
      savedAt: now,
    }))
    localStorage.removeItem(DRAFT_KEY)

    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      savedAt: now,
      teamName: charter.teamName,
      symbol: charter.symbol,
      customSymbol: charter.customSymbol,
      values: [...charter.values],
      agreements: [...charter.agreements],
    }
    const updated = [entry, ...history].slice(0, HISTORY_CAP)
    persistHistory(updated)
    setHistory(updated)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const restoreHistoryEntry = (entry: HistoryEntry) => {
    const { id: _id, savedAt: _savedAt, ...charterFields } = entry
    setCharter(c => ({ ...c, ...charterFields }))
    setShowHistory(false)
    setCompareId(null)
  }

  const copyImage = async () => {
    const el = document.getElementById('charter-card')
    if (!el) return
    setCopying(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(el, { useCORS: true, backgroundColor: null })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      } else if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${charter.teamName || 'team-charter'}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setCopying(false)
    }
  }

  const shareLink = async () => {
    const encoded = encodeCharterHash(charter)
    const url = `${window.location.origin}${window.location.pathname}#charter=${encoded}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const steps = t('intro.steps', { returnObjects: true }) as string[]

  const facilitatorBtn = (
    <button
      onClick={toggleFacilitator}
      aria-pressed={facilitatorMode}
      title={facilitatorMode ? t('facilitator.toggle_off') : t('facilitator.toggle_on')}
      className={`btn-ghost ${facilitatorMode ? 'text-brand-600 bg-brand-50 dark:bg-brand-700/20' : ''}`}
    >
      <ProjectorIcon className="w-4 h-4" />
    </button>
  )

  if (showMyTeams) {
    return (
      <MyTeamsScreen
        library={library}
        onClose={() => setShowMyTeams(false)}
        onExport={exportLibrary}
        onImport={importLibrary}
        importResult={importResult}
        importFileRef={importFileRef}
        onLoad={loadFromLibrary}
        onDelete={deleteFromLibrary}
        renamingId={renamingId}
        renameValue={renameValue}
        onStartRename={startRename}
        onRenameValueChange={setRenameValue}
        onConfirmRename={renameInLibrary}
        onCancelRename={cancelRename}
      />
    )
  }

  if (showLearn) {
    return (
      <LearnScreen
        onClose={() => setShowLearn(false)}
        facilitatorMode={facilitatorMode}
        facilitatorBtn={facilitatorBtn}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col" data-accent="amber">
      <AppHeader
        title={t('app.title')}
        onTitleClick={() => setStep('intro')}
        hideLanguagePicker={facilitatorMode}
        navItems={facilitatorMode ? [] : [{ key: 'learn', label: t('learn.title'), active: false, onClick: () => setShowLearn(true) }]}
      >
        <ThemeToggle />
        {facilitatorBtn}
      </AppHeader>

      {/* Progress bar — hidden in facilitator mode */}
      {step !== 'intro' && !facilitatorMode && (
        <div className="no-print bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2">
          <div className="max-w-3xl mx-auto flex gap-1.5 items-center">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < stepIndex - 1 ? 'bg-brand-600 text-white' :
                  i === stepIndex - 1 ? 'bg-brand-100 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400 border-2 border-brand-400' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}>{i + 1}</div>
                <span className={`text-xs hidden sm:inline ${i === stepIndex - 1 ? 'text-brand-700 dark:text-brand-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className="w-4 h-px bg-gray-200 dark:bg-gray-700" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {step === 'intro' && (
          <IntroScreen
            showDraftBanner={showDraftBanner}
            onResumeDraft={resumeDraft}
            onDiscardDraft={discardDraft}
            onStart={() => setStep('name')}
            savedCharter={loadCharter()}
            onLoadSaved={c => { setCharter(c); setStep('charter') }}
            libraryCount={library.length}
            onOpenMyTeams={() => setShowMyTeams(true)}
          />
        )}

        {step === 'name' && (
          <NameStep charter={charter} onPatch={patch} onBack={back} onNext={next} canNext={canNext} />
        )}

        {step === 'symbol' && (
          <SymbolStep charter={charter} onPatch={patch} onBack={back} onNext={next} canNext={canNext} facilitatorMode={facilitatorMode} />
        )}

        {step === 'values' && (
          <ValuesStep
            charter={charter}
            onToggleValue={toggleValue}
            customValue={customValue}
            onCustomValueChange={setCustomValue}
            mmMotivators={mmMotivators}
            mmDismissed={mmDismissed}
            mmImported={mmImported}
            onImportMmMotivators={importMmMotivators}
            onDismissMm={() => setMmDismissed(true)}
            onBack={back}
            onNext={next}
            canNext={canNext}
            facilitatorMode={facilitatorMode}
          />
        )}

        {step === 'agreements' && (
          <AgreementsStep
            charter={charter}
            onPatch={patch}
            newAgreement={newAgreement}
            onNewAgreementChange={setNewAgreement}
            onAddAgreement={addAgreement}
            onBack={back}
            onNext={next}
          />
        )}

        {step === 'charter' && (
          <CharterScreen
            charter={charter}
            saved={saved}
            onSaveCharter={saveCharter}
            copying={copying}
            onCopyImage={copyImage}
            linkCopied={linkCopied}
            onShareLink={shareLink}
            showScrumAlignment={showScrumAlignment}
            onToggleScrumAlignment={() => setShowScrumAlignment(v => !v)}
            history={history}
            showHistory={showHistory}
            onToggleHistory={() => { setShowHistory(v => !v); setCompareId(null) }}
            compareId={compareId}
            onSetCompareId={setCompareId}
            onRestoreHistoryEntry={restoreHistoryEntry}
            wpParticipants={wpParticipants}
            onImportWp={() => patch({ members: wpParticipants ?? undefined })}
            library={library}
            showSaveToLibrary={showSaveToLibrary}
            libraryName={libraryName}
            librarySaved={librarySaved}
            onShowSaveToLibrary={() => { setLibraryName(charter.teamName || ''); setShowSaveToLibrary(true) }}
            onLibraryNameChange={setLibraryName}
            onSaveToLibrary={() => saveToLibrary(libraryName)}
            onCancelSaveToLibrary={() => setShowSaveToLibrary(false)}
            onOpenMyTeams={() => setShowMyTeams(true)}
            onBack={back}
            onRestart={() => { setCharter(defaultCharter()); setStep('intro'); localStorage.removeItem(DRAFT_KEY) }}
            facilitatorMode={facilitatorMode}
          />
        )}
      </main>
    </div>
  )
}
