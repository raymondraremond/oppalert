import { Opportunity } from './types'

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Chevening Postgraduate Scholarship 2025',
    org: 'UK Government',
    cat: 'scholarship',
    loc: 'United Kingdom',
    deadline: '2025-11-05',
    days_remaining: 220,
    cost: 'Free',
    tags: ['Masters', 'Fully Funded', 'Leadership'],
    is_featured: true,
  } as any,
  {
    id: '2',
    title: 'Graduate Trainee Program 2025',
    org: 'Paystack',
    cat: 'job',
    loc: 'Lagos, Nigeria (Hybrid)',
    deadline: '2025-05-15',
    days_remaining: 45,
    cost: 'Free',
    tags: ['Fintech', 'Engineering', 'Entry Level'],
    is_featured: true,
  } as any,
  {
    id: '3',
    title: 'Entrepreneurship Program Cycle 11',
    org: 'Tony Elumelu Foundation',
    cat: 'startup',
    loc: 'Pan-Africa',
    deadline: '2025-05-30',
    days_remaining: 60,
    cost: 'Free',
    tags: ['Funding', 'Mentorship', 'SME'],
    is_featured: true,
  } as any,
  {
    id: '4',
    title: 'Software Engineering Immersive',
    org: 'ALX Africa',
    cat: 'fellowship',
    loc: 'Online',
    deadline: '2025-09-20',
    days_remaining: 180,
    cost: 'Free',
    tags: ['Tech', 'Coding', 'Career'],
    is_featured: false,
  } as any,
  {
    id: '5',
    title: 'Africa Tech Summit Fellowship',
    org: 'Africa Tech Summit',
    cat: 'fellowship',
    loc: 'Nairobi, Kenya',
    deadline: '2025-06-20',
    days_remaining: 90,
    cost: 'Free',
    tags: ['Tech', 'Networking', 'Innovation'],
    is_featured: true,
  } as any,
  {
    id: '6',
    title: 'Google Generation Scholarship',
    org: 'Google',
    cat: 'scholarship',
    loc: 'Global',
    deadline: '2025-07-15',
    days_remaining: 120,
    cost: 'Free',
    tags: ['Computer Science', 'Women in Tech'],
    is_featured: false,
  } as any,
  {
    id: '7',
    title: 'Y Combinator S2025 Batch',
    org: 'Y Combinator',
    cat: 'startup',
    loc: 'San Francisco (Remote)',
    deadline: '2025-07-30',
    days_remaining: 120,
    cost: 'Free',
    tags: ['Funding', 'Startup', 'Global'],
    is_featured: false,
  } as any,
  {
    id: '8',
    title: 'UNICEF Internship Program',
    org: 'UNICEF',
    cat: 'internship',
    loc: 'Various Locations',
    deadline: '2025-07-30',
    days_remaining: 120,
    cost: 'Free',
    tags: ['International', 'Social Good', 'NGO'],
    is_featured: false,
  } as any,
]

export function getOpportunity(id: string) {
  return opportunities.find(o => o.id === id)
}

export function getRelated(currentId: string, cat: string, limit: number = 3) {
  return opportunities
    .filter(o => o.cat === cat && o.id !== currentId)
    .slice(0, limit)
}
