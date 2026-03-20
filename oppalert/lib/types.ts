export type Category = 'scholarship' | 'job' | 'fellowship' | 'grant' | 'internship' | 'startup' | 'bootcamp' | 'event'
export type FundingType = 'Fully Funded' | 'Partial Funding' | 'Paid Position' | 'Equity / Funding'

export interface Opportunity {
  id: string
  icon?: string
  
  // App/Mock fields
  title: string
  org?: string
  cat?: Category
  loc?: string
  fund?: FundingType
  deadline?: string
  days?: number
  desc?: string
  featured?: boolean
  sponsored?: boolean
  sponsoredBy?: string
  about?: string
  elig?: string[]
  benefits?: string[]
  applyUrl?: string
  quickinfo?: Record<string, string>

  // DB Fields (snake_case from Postgres)
  organization?: string
  category?: Category
  location?: string
  funding_type?: FundingType
  days_remaining?: number
  description?: string
  application_url?: string
  is_featured?: boolean
  is_active?: boolean
  created_at?: string
}

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'premium' | 'admin'
  savedIds?: string[]
}
