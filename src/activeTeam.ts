// Cross-app team identity contract (agile-toolkit:activeTeam).
//
// Defined by the Dashboard (agile-toolkit/agile-toolkit.github.io) — see its
// README.md `## localStorage keys` and design-system/team.ts. This file is a
// verbatim copy; keep it that way.
//
// GOALS.md names one shared team object as "what holds it together", and this
// app is the one whose stated role is to produce it. Until now it did not:
// the Dashboard inferred a team name from `team-identity-charter` instead, and
// only Moving Motivators wrote the contract. Saving a charter is the moment a
// team's name becomes real, so that is where it is written.

export interface ActiveTeam {
  name: string
  source: string
  updatedAt: number
}

const KEY = 'agile-toolkit:activeTeam'

export function readActiveTeam(): ActiveTeam | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ActiveTeam>
    return parsed?.name ? (parsed as ActiveTeam) : null
  } catch {
    return null
  }
}

// No-ops when the name/source already match, so polling loops don't spam
// `storage` events or rewrite `updatedAt` on every refresh tick.
export function writeActiveTeam(name: string, source: string): void {
  const trimmed = name.trim()
  if (!trimmed) return
  try {
    const current = readActiveTeam()
    if (current?.name === trimmed && current.source === source) return
    localStorage.setItem(KEY, JSON.stringify({ name: trimmed, source, updatedAt: Date.now() }))
  } catch {
    /* storage unavailable or quota exceeded */
  }
}
