import { describe, it, expect, beforeEach } from 'vitest'
import { readActiveTeam, writeActiveTeam } from './activeTeam'

/**
 * `agile-toolkit:activeTeam` is the shared team object GOALS.md calls "what
 * holds it together". This app is its producer, so these tests guard the
 * producer side of the contract: the shape other apps read, and the
 * no-op-on-unchanged behaviour that keeps a polling Dashboard from rewriting
 * `updatedAt` forever.
 */

const KEY = 'agile-toolkit:activeTeam'

beforeEach(() => localStorage.clear())

describe('writeActiveTeam', () => {
  it('publishes the name, the source app and a timestamp', () => {
    writeActiveTeam('Platform Squad', 'team-identity')
    const parsed = JSON.parse(localStorage.getItem(KEY)!)
    expect(parsed.name).toBe('Platform Squad')
    expect(parsed.source).toBe('team-identity')
    expect(typeof parsed.updatedAt).toBe('number')
  })

  it('trims, because a charter name is free text', () => {
    writeActiveTeam('  Platform Squad  ', 'team-identity')
    expect(readActiveTeam()?.name).toBe('Platform Squad')
  })

  it('ignores an empty name rather than publishing a blank team', () => {
    writeActiveTeam('   ', 'team-identity')
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('does not rewrite when nothing changed', () => {
    writeActiveTeam('Platform Squad', 'team-identity')
    const first = readActiveTeam()!.updatedAt
    writeActiveTeam('Platform Squad', 'team-identity')
    expect(readActiveTeam()!.updatedAt).toBe(first)
  })

  it('does rewrite when the name changes', () => {
    writeActiveTeam('Platform Squad', 'team-identity')
    writeActiveTeam('Payments Squad', 'team-identity')
    expect(readActiveTeam()!.name).toBe('Payments Squad')
  })

  it('records which app set it, so a later writer can be told apart', () => {
    writeActiveTeam('Platform Squad', 'moving-motivators')
    expect(readActiveTeam()!.source).toBe('moving-motivators')
  })
})

describe('readActiveTeam', () => {
  it('returns null when nothing has been published', () => {
    expect(readActiveTeam()).toBeNull()
  })

  it('returns null rather than throwing on a corrupt value', () => {
    localStorage.setItem(KEY, 'not json')
    expect(readActiveTeam()).toBeNull()
  })

  it('returns null when the payload has no name', () => {
    localStorage.setItem(KEY, JSON.stringify({ source: 'team-identity', updatedAt: 1 }))
    expect(readActiveTeam()).toBeNull()
  })
})
