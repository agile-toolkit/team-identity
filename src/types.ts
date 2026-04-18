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
  savedAt?: number
}
