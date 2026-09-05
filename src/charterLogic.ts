import type { WorkshopStep, TeamCharter, SavedCharter, HistoryEntry } from './types'
import { SCRUM_VALUE_MAP } from './data/scrum-values-map'

export const STORAGE_KEY = 'team-identity-charter'
export const DRAFT_KEY = 'team-identity:draft'
export const FACILITATOR_KEY = 'agile-toolkit:facilitatorMode'
export const CHARTERS_KEY = 'team-identity:charters'
export const HISTORY_KEY = 'team-identity:history'
export const LIBRARY_CAP = 20
export const HISTORY_CAP = 10
export const STEPS: WorkshopStep[] = ['intro', 'name', 'symbol', 'values', 'agreements', 'charter']

export function readWpParticipants(): string[] | null {
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

export function readMmTopMotivators(): string[] | null {
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

export function loadCharter(): TeamCharter | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export function loadDraft(): { charter: TeamCharter; step: WorkshopStep; savedAt: number } | null {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') } catch { return null }
}

export function loadCharters(): SavedCharter[] {
  try {
    const raw = localStorage.getItem(CHARTERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function persistCharters(charters: SavedCharter[]): void {
  try { localStorage.setItem(CHARTERS_KEY, JSON.stringify(charters)) } catch { /* quota exceeded */ }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function persistHistory(entries: HistoryEntry[]): void {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)) } catch { /* quota exceeded */ }
}

// Which of the 5 Scrum values a charter's chosen value cards collectively touch,
// via SCRUM_VALUE_MAP's card→Scrum-value tagging. Used for the charter's
// "Scrum alignment" coverage badge row.
export function scrumValuesCovered(values: string[]): Set<string> {
  return new Set(values.flatMap(v => SCRUM_VALUE_MAP[v] ?? []))
}

export const defaultCharter = (): TeamCharter => ({
  teamName: '',
  symbol: '',
  customSymbol: '',
  values: [],
  agreements: [],
})

// Charter share-link payload: a bare base64(JSON) blob in the URL hash, no
// signing or compression — charters are small and this only needs to round-trip.
export function encodeCharterHash(charter: TeamCharter): string {
  return btoa(JSON.stringify(charter))
}

export function decodeCharterHash(encoded: string): TeamCharter | null {
  try {
    const parsed = JSON.parse(atob(encoded)) as TeamCharter
    return parsed && typeof parsed === 'object' && parsed.teamName !== undefined ? parsed : null
  } catch {
    return null
  }
}

// Shared by both "Save to library" and JSON import: dedupe incoming entries
// by id against what's already saved, then fill remaining room up to `cap`,
// newest-first. Entries that don't fit the cap are reported, not silently dropped.
export function mergeIntoLibrary(
  existing: SavedCharter[],
  candidates: SavedCharter[],
  cap: number
): { updated: SavedCharter[]; added: number; duplicates: number; capSkipped: number } {
  const existingIds = new Set(existing.map(c => c.id))
  const newOnes = candidates.filter(c => !existingIds.has(c.id))
  const duplicates = candidates.length - newOnes.length
  const roomLeft = Math.max(0, cap - existing.length)
  const toAdd = newOnes.slice(0, roomLeft)
  const capSkipped = newOnes.length - toAdd.length
  return { updated: [...toAdd, ...existing], added: toAdd.length, duplicates, capSkipped }
}

// Values/agreements delta between a history snapshot and the current charter,
// used by the charter-history compare panel.
export function diffCharterFields(
  base: Pick<TeamCharter, 'values' | 'agreements'>,
  current: Pick<TeamCharter, 'values' | 'agreements'>
) {
  const addedValues = current.values.filter(v => !base.values.includes(v))
  const removedValues = base.values.filter(v => !current.values.includes(v))
  const keptValues = current.values.filter(v => base.values.includes(v))
  const addedAgreements = current.agreements.filter(a => !base.agreements.find(b => b.text === a.text))
  const removedAgreements = base.agreements.filter(a => !current.agreements.find(b => b.text === a.text))
  return { addedValues, removedValues, keptValues, addedAgreements, removedAgreements }
}

export function isSavedCharterShape(v: unknown): v is SavedCharter {
  if (!v || typeof v !== 'object') return false
  const c = v as Record<string, unknown>
  return typeof c.id === 'string' && typeof c.libraryName === 'string' &&
    typeof c.teamName === 'string' && Array.isArray(c.values) && Array.isArray(c.agreements)
}
