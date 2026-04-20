import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { WorkshopStep, WorkingAgreement, TeamCharter } from './types'
import { SYMBOLS, VALUE_CARDS, AGREEMENT_PROMPTS } from './data/symbols'

const STORAGE_KEY = 'team-identity-charter'
const STEPS: WorkshopStep[] = ['intro', 'name', 'symbol', 'values', 'agreements', 'charter']

function loadCharter(): TeamCharter | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

const defaultCharter = (): TeamCharter => ({
  teamName: '',
  symbol: '',
  customSymbol: '',
  values: [],
  agreements: [],
})

export default function App() {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState<WorkshopStep>('intro')
  const [charter, setCharter] = useState<TeamCharter>(defaultCharter)
  const [customValue, setCustomValue] = useState('')
  const [newAgreement, setNewAgreement] = useState('')
  const [saved, setSaved] = useState(false)
  const [showLearn, setShowLearn] = useState(false)

  const patch = (partial: Partial<TeamCharter>) => setCharter(c => ({ ...c, ...partial }))

  const stepIndex = STEPS.indexOf(step)
  const canNext = (() => {
    if (step === 'name') return charter.teamName.trim().length > 0
    if (step === 'symbol') return charter.symbol !== '' || charter.customSymbol !== ''
    if (step === 'values') return charter.values.length >= 3
    return true
  })()

  const next = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }
  const back = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const toggleValue = (v: string) => {
    patch({
      values: charter.values.includes(v)
        ? charter.values.filter(x => x !== v)
        : [...charter.values, v],
    })
  }

  const addAgreement = (text: string) => {
    if (!text.trim() || charter.agreements.find(a => a.text === text)) return
    patch({ agreements: [...charter.agreements, { id: crypto.randomUUID(), text: text.trim(), votes: 0 }] })
  }

  const saveCharter = () => {
    const toSave = { ...charter, savedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const steps = t('intro.steps', { returnObjects: true }) as string[]
  const displaySymbol = charter.customSymbol || charter.symbol

  if (showLearn) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => setShowLearn(false)} className="font-semibold text-brand-600">{t('app.title')}</button>
            <button onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')} className="text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
              {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
            </button>
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
            <button onClick={() => setShowLearn(true)} className="btn-ghost">{t('learn.title')}</button>
            <button onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')} className="ml-1 text-sm text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
              {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
            </button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      {step !== 'intro' && (
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
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep('name')} className="btn-primary text-base px-8 py-3">{t('intro.start')}</button>
              {loadCharter() && (
                <button onClick={() => { const c = loadCharter(); if (c) { setCharter(c); setStep('charter') } }} className="btn-secondary">
                  {t('intro.load')}
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
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
              {SYMBOLS.map(s => (
                <button
                  key={s.emoji}
                  onClick={() => patch({ symbol: s.emoji, customSymbol: '' })}
                  title={`${s.name}: ${s.meaning}`}
                  className={`p-2 rounded-2xl text-3xl transition-all hover:scale-110 ${
                    charter.symbol === s.emoji && !charter.customSymbol
                      ? 'bg-brand-100 ring-2 ring-brand-400 scale-110'
                      : 'bg-white border border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {s.emoji}
                </button>
              ))}
            </div>
            {charter.symbol && !charter.customSymbol && (
              <p className="text-sm text-brand-700 bg-brand-50 rounded-xl px-4 py-2 mb-4">
                {SYMBOLS.find(s => s.emoji === charter.symbol)?.meaning}
              </p>
            )}
            <div className="mb-6">
              <label className="label">{t('symbol.custom_label')}</label>
              <input
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
            <div className="flex flex-wrap gap-2 mb-6">
              {VALUE_CARDS.map(v => (
                <button
                  key={v}
                  onClick={() => toggleValue(v)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    charter.values.includes(v)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-400'
                  }`}
                >
                  {v}
                </button>
              ))}
              {charter.values.filter(v => !VALUE_CARDS.includes(v)).map(v => (
                <button key={v} onClick={() => toggleValue(v)}
                  className="px-4 py-2 rounded-xl border text-sm font-medium bg-brand-600 text-white border-brand-600">
                  {v} ✕
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <input className="input flex-1" placeholder={t('values.custom_placeholder')} value={customValue} onChange={e => setCustomValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && customValue.trim()) { toggleValue(customValue.trim()); setCustomValue('') } }} />
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
                    <button onClick={() => patch({ agreements: charter.agreements.map(a => a.id === ag.id ? { ...a, votes: a.votes + 1 } : a) })}
                      className="text-sm">{t('agreements.upvote')} {ag.votes > 0 && <span className="text-xs text-gray-500">{ag.votes}</span>}</button>
                    <span className="flex-1 text-sm text-gray-800">{ag.text}</span>
                    <button onClick={() => patch({ agreements: charter.agreements.filter(a => a.id !== ag.id) })} className="text-gray-200 hover:text-red-400 text-xs">{t('agreements.delete')}</button>
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{t('charter.title')}</h1>
              <div className="flex gap-2">
                <button onClick={saveCharter} className="btn-primary">{saved ? t('charter.saved') : t('charter.save')}</button>
                <button onClick={() => window.print()} className="btn-secondary">{t('charter.print')}</button>
                <button onClick={() => { setCharter(defaultCharter()); setStep('intro') }} className="btn-ghost">{t('charter.restart')}</button>
              </div>
            </div>

            {/* Charter card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-2xl mb-6" id="charter-card">
              <div className="text-center mb-6">
                <div className="text-7xl mb-3">{displaySymbol}</div>
                <h2 className="text-3xl font-bold">{charter.teamName || t('charter.team_name_fallback')}</h2>
                <p className="text-brand-200 text-sm mt-1">{t('charter.created')}: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-brand-100 text-xs uppercase tracking-wider mb-2">{t('charter.values_title')}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {charter.values.map(v => (
                      <span key={v} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{v}</span>
                    ))}
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
