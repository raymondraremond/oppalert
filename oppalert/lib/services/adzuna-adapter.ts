import { Opportunity, Category, FundingType } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class AdzunaAdapter implements OpportunityAdapter {
  name = 'Adzuna Jobs';
  private appId = process.env.ADZUNA_APP_ID;
  private appKey = process.env.ADZUNA_APP_KEY;

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    if (!this.appId || !this.appKey) return [];
    
    // Default country to za (South Africa) as it has good coverage for Africa, 
    // but in a real app this would be dynamic or 'gb' for global
    const country = 'za'; 
    const page = query.page || 1;
    let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${this.appId}&app_key=${this.appKey}&content-type=application/json`;

    if (query.keyword) url += `&what=${encodeURIComponent(query.keyword)}`;
    if (query.location) url += `&where=${encodeURIComponent(query.location)}`;
    
    // Adzuna only provides jobs, so if user specifically asked for scholarship/grant, we return empty
    if (query.category && query.category !== 'job' && query.category !== 'internship') {
      return [];
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return (data.results || []).map((job: any) => this.mapToOpportunity(job));
    } catch (error) {
      console.error('Adzuna API error:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Opportunity | null> {
    // Adzuna search returns many fields, but detailed 'getById' is often limited in free tier.
    // For this integration, we usually rely on search results or direct links.
    // Mocking for now since we'd mostly be using IDs from search results.
    return null; 
  }

  private mapToOpportunity(job: any): Opportunity {
    // Mapping Adzuna fields to OppAlert schema
    const deadlineStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // Mock deadline as 30 days from now

    return {
      id: `adzuna-${job.id}`,
      icon: '💼',
      title: job.title,
      org: job.company.display_name,
      cat: 'job' as Category,
      loc: job.location.display_name,
      fund: 'Paid Position' as FundingType,
      deadline: deadlineStr,
      days: 30,
      desc: job.description,
      featured: false,
      about: job.description,
      elig: ['Please check official listing for requirements'],
      benefits: ['Competitive salary', 'Modern tech stack'],
      applyUrl: job.redirect_url,
      quickinfo: {
        Type: 'Full-time Job',
        Location: job.location.display_name,
        Salary: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : 'Not Specified',
      }
    };
  }
}
