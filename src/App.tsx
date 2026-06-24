import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import type { WorkshopStep, WorkingAgreement, TeamCharter, SavedCharter } from './types'
import { SYMBOLS, VALUE_CARDS, AGREEMENT_PROMPTS } from './data/symbols'
import { SCRUM_VALUES, SCRUM_VALUE_MAP } from './data/scrum-values-map'

const STORAGE_KEY = 'team-identity-charter'
const DRAFT_KEY = 'team-identity:draft'
const FACILITATOR_KEY = 'team-identity:facilitatorMode'
const CHARTERS_KEY = 'team-identity:charters'
const LIBRARY_CAP = 20
const STEPS: WorkshopStep[] = ['intro', 'name', 'symbol', 'values', 'agreements', 'charter']

function readWpParticipants(): string[] | null {
  try {
    const raw = localStorage.getItem('work-profiles-data')
    if (!raw) return null
    const profiles = JSON.parse(raw) as Array<{ name?: string; archived?: boolean }>
    if (!Array.isArray(profiles) || profiles.length === 0) return null
    const names = profiles
      .filter(p => !p.archived && p.name)
      .map(p => p.name as string)
    return names.length > 0 ? names : null
  } catch {
    return null
  }
}

function readMmTopMotivators(): string[] | null {
  try {
    const raw = localStorage.getItem('moving-motivators:lastSession')
    if (!raw) return null
    const session = JSON.parse(raw) as { ranked?: string[] }
    if (!Array.isArray(session.ranked) || session.ranked.length === 0) return null
    return session.ranked.slice(0, 3).map(id => id.charAt(0).toUpperCase() + id.slice(1))
  } catch {
    return null
  }
}

function loadCharter(): TeamCharter | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

function loadDraft(): { charter: TeamCharter; step: WorkshopStep; savedAt: number } | null {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') } catch { return null }
}

function loadCharters(): SavedCharter[] {
  try {
    const raw = localStorage.getItem(CHARTERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function persistCharters(charters: SavedCharter[]): void {
  try { localStorage.setItem(CHARTERS_KEY, JSON.stringify(charters)) } catch { /* quota exceeded */ }
}

const defaultCharter = (): TeamCharter => ({
  teamName: '',
  symbol: '',
  customSymbol: '',
  values: [],
  agreements: [],
})

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
  const { t, i18n } = useTranslation()
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
  const [showScrumAlignment, setShowScrumAlignment] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('facilitator-mode', facilitatorMode)
  }, [facilitatorMode])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#charter=')) {
      try {
        const encoded = hash.slice('#charter='.length)
        const json = atob(encoded)
        const parsed = JSON.parse(json) as TeamCharter
        if (parsed && typeof parsed === 'object' && parsed.teamName !== undefined) {
          setCharter(parsed)
          setStep('charter')
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
          return
        }
      } catch { /* invalid hash — ignore */ }
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
    const toSave = { ...charter, savedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    localStorage.setItem('team-identity:lastSession', JSON.stringify({
      teamName: charter.teamName,
      symbol: charter.customSymbol || charter.symbol,
      valuesCount: charter.values.length,
      agreementsCount: charter.agreements.length,
      membersCount: (charter.members ?? []).length,
      savedAt: Date.now(),
    }))
    localStorage.removeItem(DRAFT_KEY)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyImage = async () => {
    const el = document.getElementById('charter-card')
    if (!el) return
    setCopying(true)
    try {
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
    const encoded = btoa(JSON.stringify(charter))
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
  const displaySymbol = charter.customSymbol || charter.symbol

  const facilitatorBtn = (
    <button
      onClick={toggleFacilitator}
      aria-pressed={facilitatorMode}
      title={facilitatorMode ? t('facilitator.toggle_off') : t('facilitator.toggle_on')}
      className={`btn-ghost ${facilitatorMode ? 'text-brand-600 bg-brand-50' : ''}`}
    >
      <ProjectorIcon className="w-4 h-4" />
    </button>
  )

  if (showMyTeams) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="https://agile-toolkit.github.io/"
                title="Agile Toolkit"
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </a>
              <button onClick={() => setShowMyTeams(false)} className="font-semibold text-brand-600">{t('app.title')}</button>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{t('teams.title')}</h1>
            <button onClick={() => setShowMyTeams(false)} className="btn-ghost">{t('common.back')}</button>
          </div>
          {library.length === 0 ? (
            <p className="text-gray-400 text-center py-16">{t('teams.empty')}</p>
          ) : (
            <div className="space-y-3">
              {library.map(saved => (
                <div key={saved.id} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                  <span className="text-3xl">{saved.customSymbol || saved.symbol}</span>
                  <div className="flex-1 min-w-0">
                    {renamingId === saved.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          autoFocus
                          className="input flex-1 text-sm"
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && renameValue.trim()) renameInLibrary(saved.id, renameValue) }}
                        />
                        <button onClick={() => renameInLibrary(saved.id, renameValue)} disabled={!renameValue.trim()} className="btn-primary text-xs">{t('teams.rename_confirm')}</button>
                        <button onClick={() => setRenamingId(null)} className="btn-ghost text-xs">{t('teams.cancel')}</button>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900 truncate">{saved.libraryName}</p>
                        <p className="text-xs text-gray-400">{saved.teamName} · {saved.values.length} {t('values.selected')} · {new Date(saved.savedAt ?? 0).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                  {renamingId !== saved.id && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => loadFromLibrary(saved)}
                        className="btn-primary text-sm"
                      >{t('teams.load')}</button>
                      <button
                        onClick={() => { setRenamingId(saved.id); setRenameValue(saved.libraryName) }}
                        className="btn-secondary text-sm"
                      >{t('teams.rename')}</button>
                      <button
                        onClick={() => deleteFromLibrary(saved.id)}
                        className="btn-ghost text-sm text-red-400 hover:text-red-600"
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

  if (showLearn) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="https://agile-toolkit.github.io/"
                title="Agile Toolkit"
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </a>
              <button onClick={() => setShowLearn(false)} className="font-semibold text-brand-600">{t('app.title')}</button>
            </div>
            <div className="flex items-center gap-1">
              {facilitatorBtn}
              {!facilitatorMode && (
                <select
                  value={i18n.language.split('-')[0]}
                  onChange={e => i18n.changeLanguage(e.target.value)}
                  className="text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-100 bg-transparent border-none cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                  <option value="be">BE</option>
                  <option value="ru">RU</option>
                </select>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
          <h1 className="text-2xl font-bold">{t('learn.title')}</h1>
          <div className="card">
            <h2 className="font-semibold mb-2">{t('learn.why_title')}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{t('learn.why_body')}</p>
          </div>
          <div className="card">
            <h2 className="font-semibold mb-2">{t('learn.expo_title')}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{t('learn.expo_body')}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => setStep('intro')} className="font-semibold text-brand-600">{t('app.title')}</button>
          <div className="flex items-center gap-1">
            {!facilitatorMode && (
              <button onClick={() => setShowLearn(true)} className="btn-ghost">{t('learn.title')}</button>
            )}
            {facilitatorBtn}
            {!facilitatorMode && (
              <select
                value={i18n.language.split('-')[0]}
                onChange={e => i18n.changeLanguage(e.target.value)}
                className="ml-1 text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-100 bg-transparent border-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="be">BE</option>
                <option value="ru">RU</option>
              </select>
            )}
          </div>
        </div>
      </header>

      {/* Progress bar — hidden in facilitator mode */}
      {step !== 'intro' && !facilitatorMode && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="max-w-3xl mx-auto flex gap-1.5 items-center">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < stepIndex - 1 ? 'bg-brand-600 text-white' :
                  i === stepIndex - 1 ? 'bg-brand-100 text-brand-700 border-2 border-brand-400' :
                  'bg-gray-100 text-gray-400'
                }`}>{i + 1}</div>
                <span className={`text-xs hidden sm:inline ${i === stepIndex - 1 ? 'text-brand-700 font-medium' : 'text-gray-400'}`}>{s}</span>
                {i < steps.length - 1 && <div className="w-4 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">

        {/* INTRO */}
        {step === 'intro' && (
          <div className="max-w-lg mx-auto text-center">
            <div className="text-6xl mb-4">🤝</div>
            <h1 className="text-3xl font-bold mb-3">{t('intro.headline')}</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">{t('intro.body')}</p>

            {/* Draft resume banner */}
            {showDraftBanner && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 gap-3 text-left">
                <p className="text-sm text-blue-800 flex-1">{t('draft.resume_prompt')}</p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={resumeDraft} className="text-sm font-medium text-blue-900 bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-lg transition-colors">
                    {t('draft.resume')}
                  </button>
                  <button onClick={discardDraft} className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg transition-colors">
                    {t('draft.discard')}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => setStep('name')} className="btn-primary text-base px-8 py-3">{t('intro.start')}</button>
              {loadCharter() && (
                <button onClick={() => { const c = loadCharter(); if (c) { setCharter(c); setStep('charter') } }} className="btn-secondary">
                  {t('intro.load')}
                </button>
              )}
              {library.length > 0 && (
                <button onClick={() => setShowMyTeams(true)} className="btn-secondary">
                  {t('teams.title')} ({library.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* NAME */}
        {step === 'name' && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-2">{t('name.title')}</h2>
            <p className="text-gray-500 text-sm mb-6">{t('name.subtitle')}</p>
            <input
              autoFocus
              className="input text-2xl font-semibold py-4 mb-3"
              placeholder={t('name.placeholder')}
              value={charter.teamName}
              onChange={e => patch({ teamName: e.target.value })}
            />
            <p className="text-xs text-brand-600 bg-brand-50 rounded-xl px-4 py-2 mb-6">{t('name.tip')}</p>
            <div className="flex justify-between">
              <button onClick={back} className="btn-secondary">{t('common.back')}</button>
              <button onClick={next} disabled={!canNext} className="btn-primary">{t('common.next')} →</button>
            </div>
          </div>
        )}

        {/* SYMBOL */}
        {step === 'symbol' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{t('symbol.title')}</h2>
            <p className="text-gray-500 text-sm mb-6">{t('symbol.subtitle')}</p>
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
                if (sym) patch({ symbol: sym.emoji, customSymbol: '' })
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
                    onClick={() => patch({ symbol: s.emoji, customSymbol: '' })}
                    title={`${s.name}: ${s.meaning}`}
                    className={`rounded-2xl transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none ${
                      facilitatorMode ? 'p-4 text-5xl' : 'p-2 text-3xl'
                    } ${
                      isChecked
                        ? `bg-brand-100 scale-110 ${facilitatorMode ? 'ring-4 ring-brand-500' : 'ring-2 ring-brand-400'}`
                        : 'bg-white border border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    {s.emoji}
                  </button>
                )
              })}
            </div>
            {charter.symbol && !charter.customSymbol && (
              <p className="text-sm text-brand-700 bg-brand-50 rounded-xl px-4 py-2 mb-4">
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
                onChange={e => patch({ customSymbol: e.target.value, symbol: e.target.value ? '' : charter.symbol })}
              />
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="btn-secondary">{t('common.back')}</button>
              <button onClick={next} disabled={!canNext} className="btn-primary">{t('common.next')} →</button>
            </div>
          </div>
        )}

        {/* VALUES */}
        {step === 'values' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{t('values.title')}</h2>
            <p className="text-gray-500 text-sm mb-1">{t('values.subtitle')}</p>
            <p className="text-xs text-brand-600 mb-4">{charter.values.length} {t('values.selected')} — {t('values.min_note')}</p>

            {/* MM import banner */}
            {mmMotivators && !mmDismissed && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 gap-3">
                <p className="text-sm text-amber-800 flex-1">{t('values.import_mm_banner')}</p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={importMmMotivators} className="text-sm font-medium text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-lg transition-colors">
                    {t('values.import_mm_import')}
                  </button>
                  <button onClick={() => setMmDismissed(true)} className="text-sm text-amber-600 hover:text-amber-800 px-2 py-1 rounded-lg transition-colors">
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
                  onClick={() => toggleValue(v)}
                  className={`rounded-xl border font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    facilitatorMode ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
                  } ${
                    charter.values.includes(v)
                      ? `bg-brand-600 text-white border-brand-600 ${facilitatorMode ? 'ring-2 ring-brand-300' : ''}`
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-400'
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
                <button key={v} onClick={() => toggleValue(v)}
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
                  <span aria-hidden="true">✕</span>
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
                onChange={e => setCustomValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && customValue.trim()) { toggleValue(customValue.trim()); setCustomValue('') } }}
              />
              <button onClick={() => { if (customValue.trim()) { toggleValue(customValue.trim()); setCustomValue('') } }} className="btn-secondary">
                {t('values.custom_label')}
              </button>
            </div>
            <div className="flex justify-between">
              <button onClick={back} className="btn-secondary">{t('common.back')}</button>
              <button onClick={next} disabled={!canNext} className="btn-primary">{t('common.next')} →</button>
            </div>
          </div>
        )}

        {/* AGREEMENTS */}
        {step === 'agreements' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{t('agreements.title')}</h2>
            <p className="text-gray-500 text-sm mb-5">{t('agreements.subtitle')}</p>

            {/* Active agreements */}
            {charter.agreements.length > 0 && (
              <div className="space-y-2 mb-5">
                {charter.agreements.map(ag => (
                  <div key={ag.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                    <button
                      onClick={() => patch({ agreements: charter.agreements.map(a => a.id === ag.id ? { ...a, votes: a.votes + 1 } : a) })}
                      aria-label={`${t('agreements.upvote')} — ${ag.text}`}
                      className="text-sm"
                    >{t('agreements.upvote')} {ag.votes > 0 && <span className="text-xs text-gray-500">{ag.votes}</span>}</button>
                    <span className="flex-1 text-sm text-gray-800">{ag.text}</span>
                    <button
                      onClick={() => patch({ agreements: charter.agreements.filter(a => a.id !== ag.id) })}
                      aria-label={`${t('agreements.delete')} — ${ag.text}`}
                      className="text-gray-200 hover:text-red-400 text-xs"
                    >{t('agreements.delete')}</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add custom */}
            <div className="flex gap-2 mb-5">
              <input className="input flex-1" placeholder={t('agreements.custom_placeholder')} value={newAgreement} onChange={e => setNewAgreement(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newAgreement.trim()) { addAgreement(newAgreement); setNewAgreement('') } }} />
              <button onClick={() => { addAgreement(newAgreement); setNewAgreement('') }} disabled={!newAgreement.trim()} className="btn-primary text-sm">
                + {t('agreements.add_custom')}
              </button>
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{t('agreements.suggestions')}</p>
              <div className="space-y-1">
                {AGREEMENT_PROMPTS.filter(p => !charter.agreements.find(a => a.text === p)).map(prompt => (
                  <button key={prompt} onClick={() => addAgreement(prompt)} className="w-full text-left text-sm text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl px-3 py-1.5 transition-colors">
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={back} className="btn-secondary">{t('common.back')}</button>
              <button onClick={next} className="btn-primary">{t('common.next')} →</button>
            </div>
          </div>
        )}

        {/* CHARTER */}
        {step === 'charter' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h1 className="text-2xl font-bold">{t('charter.title')}</h1>
              <div className="flex gap-2 flex-wrap">
                {wpParticipants && !charter.members && (
                  <button
                    onClick={() => patch({ members: wpParticipants })}
                    className="btn-secondary text-sm"
                  >
                    {t('charter.import_wp')}
                  </button>
                )}
                <button onClick={saveCharter} className="btn-primary">{saved ? t('charter.saved') : t('charter.save')}</button>
                <button onClick={copyImage} disabled={copying} className="btn-secondary">{copying ? '…' : t('charter.share')}</button>
                <button onClick={shareLink} className="btn-secondary">{linkCopied ? t('charter.share_copied') : t('charter.share_url')}</button>
                <button onClick={() => window.print()} className="btn-secondary">{t('charter.print')}</button>
                <button onClick={() => setShowScrumAlignment(v => !v)} className={`btn-secondary text-sm ${showScrumAlignment ? 'ring-2 ring-brand-400' : ''}`}>{showScrumAlignment ? t('charter.scrum_toggle_hide') : t('charter.scrum_toggle_show')}</button>
                <button onClick={() => { setCharter(defaultCharter()); setStep('intro'); localStorage.removeItem(DRAFT_KEY) }} className="btn-ghost">{t('charter.restart')}</button>
              </div>
            </div>

            {/* Save to Library */}
            <div className="mb-4">
              {!showSaveToLibrary ? (
                <div className="flex items-center gap-2">
                  {librarySaved ? (
                    <span className="text-sm text-green-600 font-medium">{t('teams.saved_to_library')}</span>
                  ) : library.length >= LIBRARY_CAP ? (
                    <span className="text-xs text-amber-600">{t('teams.cap_warning')}</span>
                  ) : (
                    <button onClick={() => { setLibraryName(charter.teamName || ''); setShowSaveToLibrary(true) }} className="btn-ghost text-sm">
                      + {t('teams.save_to_library')}
                    </button>
                  )}
                  {library.length > 0 && (
                    <button onClick={() => setShowMyTeams(true)} className="btn-ghost text-sm">
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
                    onChange={e => setLibraryName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && libraryName.trim()) saveToLibrary(libraryName) }}
                  />
                  <button onClick={() => saveToLibrary(libraryName)} disabled={!libraryName.trim()} className="btn-primary text-sm">{t('teams.save_confirm')}</button>
                  <button onClick={() => setShowSaveToLibrary(false)} className="btn-ghost text-sm">{t('teams.cancel')}</button>
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
                        <span className="text-brand-300">✓</span>
                        {ag.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {showScrumAlignment && (() => {
                const covered = new Set(charter.values.flatMap(v => SCRUM_VALUE_MAP[v] ?? []))
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

            <div className="flex justify-start">
              <button onClick={back} className="btn-ghost">← {t('common.back')}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
