import { describe, it, expect, beforeEach } from 'vitest'
import { readWpParticipants, readMmTopMotivators, loadCharters, loadHistory, defaultCharter, scrumValuesCovered } from './App'

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
