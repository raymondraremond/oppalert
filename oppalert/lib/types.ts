export type Category = 'scholarship' | 'job' | 'fellowship' | 'grant' | 'internship' | 'startup'
export type FundingType = 'Fully Funded' | 'Partial Funding' | 'Paid Position' | 'Equity / Funding'

export interface Opportunity {
  id: string
  icon: string
  title: string
  org: string
  cat: Category
  loc: string
  fund: FundingType
  deadline: string
  days: number
  desc: string
  featured: boolean
  about: string
  elig: string[]
  benefits: string[]
  applyUrl: string
  quickinfo: Record<string, string>
}

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'premium'
  savedIds: string[]
}
