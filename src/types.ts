export type WorkshopStep = 'intro' | 'name' | 'symbol' | 'values' | 'agreements' | 'charter'

export interface WorkingAgreement {
  id: string
  text: string
  votes: number
}

export interface TeamCharter {
  teamName: string
  symbol: string
  customSymbol: string
  values: string[]
  agreements: WorkingAgreement[]
  members?: string[]
  savedAt?: number
}

export interface SavedCharter extends TeamCharter {
  id: string
  libraryName: string
}

export interface HistoryEntry {
  id: string
  savedAt: number
  teamName: string
  symbol: string
  customSymbol: string
  values: string[]
  agreements: WorkingAgreement[]
}
