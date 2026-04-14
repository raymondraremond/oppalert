export type Category = 'scholarship' | 'job' | 'fellowship' | 'grant' | 'internship' | 'startup' | 'bootcamp' | 'event'
export type FundingType = 'Fully Funded' | 'Partial Funding' | 'Paid Position' | 'Equity / Funding'

export interface Opportunity {
  id: string
  icon?: string
  image?: string
  image_url?: string
  
  // Content
  title: string
  organization?: string
  org?: string // Alias for organization
  
  category?: Category
  cat?: Category // Alias for category
  
  location?: string
  loc?: string // Alias for location
  
  funding_type?: FundingType
  fund?: FundingType // Alias for funding_type
  
  deadline?: string
  days_remaining?: number
  days?: number // Alias for days_remaining
  
  description?: string
  desc?: string // Alias for description
  about?: string
  
  eligibility?: string[]
  elig?: string[] // Alias for eligibility
  
  benefits?: string[]
  
  application_url?: string
  applyUrl?: string // Alias for application_url
  
  // Flags & Metadata
  is_featured?: boolean
  featured?: boolean // Alias for is_featured
  
  is_verified?: boolean
  is_active?: boolean
  
  source?: 'internal' | 'adzuna' | 'jooble'
  external_id?: string
  
  created_at?: string
  
  // UI & Metadata
  quickinfo?: Record<string, string>
  tags?: string[]
  cost?: string
}

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'premium' | 'admin'
  savedIds?: string[]
}
