import { describe, it, expect, beforeEach } from 'vitest'
import {
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
} from './App'
import type { SavedCharter } from './types'

beforeEach(() => localStorage.clear())

describe('readWpParticipants', () => {
  it('returns null when Work Profiles has no data', () => {
    expect(readWpParticipants()).toBeNull()
  })

  it('returns non-archived profile names', () => {
    localStorage.setItem('work-profiles-data', JSON.stringify([
      { name: 'Alice', archived: false },
      { name: 'Bob', archived: true },
      { name: 'Carol' },
    ]))
    expect(readWpParticipants()).toEqual(['Alice', 'Carol'])
  })

  it('returns null when every profile is archived or unnamed', () => {
    localStorage.setItem('work-profiles-data', JSON.stringify([{ archived: true, name: 'Alice' }]))
    expect(readWpParticipants()).toBeNull()
  })

  it('recovers gracefully from corrupted storage', () => {
    localStorage.setItem('work-profiles-data', '{not json')
    expect(readWpParticipants()).toBeNull()
  })
})

describe('readMmTopMotivators', () => {
  it('returns null when Moving Motivators has no session', () => {
    expect(readMmTopMotivators()).toBeNull()
  })

  it('capitalizes and takes the top 3 ranked motivators', () => {
    localStorage.setItem('moving-motivators:lastSession', JSON.stringify({
      ranked: ['mastery', 'freedom', 'curiosity', 'order'],
    }))
    expect(readMmTopMotivators()).toEqual(['Mastery', 'Freedom', 'Curiosity'])
  })

  it('recovers gracefully from corrupted storage', () => {
    localStorage.setItem('moving-motivators:lastSession', '{not json')
    expect(readMmTopMotivators()).toBeNull()
  })
})

describe('loadCharters / loadHistory', () => {
  it('default to an empty array when unset', () => {
    expect(loadCharters()).toEqual([])
    expect(loadHistory()).toEqual([])
  })

  it('recover gracefully from corrupted storage', () => {
    localStorage.setItem('team-identity:charters', '{not json')
    localStorage.setItem('team-identity:history', '{not json')
    expect(loadCharters()).toEqual([])
    expect(loadHistory()).toEqual([])
  })

  it('recover from a non-array value', () => {
    localStorage.setItem('team-identity:charters', JSON.stringify({ not: 'an array' }))
    expect(loadCharters()).toEqual([])
  })
})

describe('scrumValuesCovered', () => {
  it('returns an empty set for no values', () => {
    expect(scrumValuesCovered([])).toEqual(new Set())
  })

  it('unions the Scrum values tagged by each chosen card', () => {
    // Collaboration -> Commitment, Respect; Innovation -> Courage
    expect(scrumValuesCovered(['Collaboration', 'Innovation'])).toEqual(new Set(['Commitment', 'Respect', 'Courage']))
  })

  it('ignores values with no Scrum-value tags', () => {
    expect(scrumValuesCovered(['not-a-real-card'])).toEqual(new Set())
  })

  it('does not double-count an overlapping tag from two cards', () => {
    // Both Trust and Transparency tag Openness
    const covered = scrumValuesCovered(['Trust', 'Transparency'])
    expect(covered.size).toBe(1)
    expect(covered.has('Openness')).toBe(true)
  })
})

describe('defaultCharter', () => {
  it('starts with no team name, symbol, values, or agreements', () => {
    const c = defaultCharter()
    expect(c.teamName).toBe('')
    expect(c.values).toEqual([])
    expect(c.agreements).toEqual([])
  })

  it('returns a fresh object each call', () => {
    const a = defaultCharter()
    a.values.push({ id: 'x' } as never)
    expect(defaultCharter().values).toEqual([])
  })
})

describe('encodeCharterHash / decodeCharterHash', () => {
  it('round-trips a charter through encode then decode', () => {
    const charter = { ...defaultCharter(), teamName: 'Falcons', values: ['trust', 'focus'] }
    const decoded = decodeCharterHash(encodeCharterHash(charter))
    expect(decoded).toEqual(charter)
  })

  it('returns null for a non-base64 string', () => {
    expect(decodeCharterHash('not valid base64!!!')).toBeNull()
  })

  it('returns null for base64 that decodes to non-JSON', () => {
    expect(decodeCharterHash(btoa('not json'))).toBeNull()
  })

  it('returns null for base64 JSON missing teamName', () => {
    expect(decodeCharterHash(btoa(JSON.stringify({ values: [] })))).toBeNull()
  })
})

describe('mergeIntoLibrary', () => {
  const charter = (id: string): SavedCharter => ({
    ...defaultCharter(),
    id,
    libraryName: `Team ${id}`,
    savedAt: Date.now(),
  })

  it('adds new entries newest-first ahead of the existing library', () => {
    const existing = [charter('a')]
    const result = mergeIntoLibrary(existing, [charter('b'), charter('c')], 20)
    expect(result.updated.map(c => c.id)).toEqual(['b', 'c', 'a'])
    expect(result.added).toBe(2)
    expect(result.duplicates).toBe(0)
    expect(result.capSkipped).toBe(0)
  })

  it('skips candidates whose id already exists in the library', () => {
    const existing = [charter('a')]
    const result = mergeIntoLibrary(existing, [charter('a'), charter('b')], 20)
    expect(result.updated.map(c => c.id)).toEqual(['b', 'a'])
    expect(result.added).toBe(1)
    expect(result.duplicates).toBe(1)
  })

  it('stops adding once the cap is reached and reports the skipped count', () => {
    const existing = [charter('a'), charter('b')]
    const result = mergeIntoLibrary(existing, [charter('c'), charter('d'), charter('e')], 3)
    expect(result.updated).toHaveLength(3)
    expect(result.added).toBe(1)
    expect(result.capSkipped).toBe(2)
  })

  it('adds nothing when the library is already at cap', () => {
    const existing = [charter('a'), charter('b')]
    const result = mergeIntoLibrary(existing, [charter('c')], 2)
    expect(result.updated).toEqual(existing)
    expect(result.added).toBe(0)
    expect(result.capSkipped).toBe(1)
  })
})

describe('diffCharterFields', () => {
  it('reports no changes when values and agreements are identical', () => {
    const base = { values: ['trust'], agreements: [{ id: '1', text: 'Ship weekly', votes: 0 }] }
    const diff = diffCharterFields(base, base)
    expect(diff.addedValues).toEqual([])
    expect(diff.removedValues).toEqual([])
    expect(diff.keptValues).toEqual(['trust'])
    expect(diff.addedAgreements).toEqual([])
    expect(diff.removedAgreements).toEqual([])
  })

  it('detects added and removed values', () => {
    const base = { values: ['trust', 'focus'], agreements: [] }
    const current = { values: ['focus', 'courage'], agreements: [] }
    const diff = diffCharterFields(base, current)
    expect(diff.addedValues).toEqual(['courage'])
    expect(diff.removedValues).toEqual(['trust'])
    expect(diff.keptValues).toEqual(['focus'])
  })

  it('matches agreements by text, not id', () => {
    const base = { values: [], agreements: [{ id: '1', text: 'Ship weekly', votes: 0 }] }
    const current = { values: [], agreements: [{ id: '2', text: 'Ship weekly', votes: 3 }] }
    const diff = diffCharterFields(base, current)
    expect(diff.addedAgreements).toEqual([])
    expect(diff.removedAgreements).toEqual([])
  })

  it('detects added and removed agreements', () => {
    const base = { values: [], agreements: [{ id: '1', text: 'Old rule', votes: 0 }] }
    const current = { values: [], agreements: [{ id: '2', text: 'New rule', votes: 0 }] }
    const diff = diffCharterFields(base, current)
    expect(diff.addedAgreements).toEqual(current.agreements)
    expect(diff.removedAgreements).toEqual(base.agreements)
  })
})
