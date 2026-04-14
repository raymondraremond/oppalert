import { Opportunity, Category, FundingType } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class JoobleAdapter implements OpportunityAdapter {
  name = 'Jooble Jobs';

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    const apiKey = process.env.JOOBLE_API_KEY;
    if (!apiKey) return [];

    // Adzuna only provides jobs, so skip if searching for scholarships etc
    if (query.category && query.category !== 'job' && query.category !== 'internship') {
      return [];
    }

    const url = `https://api.jooble.org/api/${apiKey}`;
    const body = {
      keywords: query.keyword || 'opportunities',
      location: query.location || '',
      page: query.page || 1
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      return (data.jobs || []).map((job: any) => this.mapToOpportunity(job));
    } catch (error) {
      console.error('Jooble API error:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Opportunity | null> {
    return null; // Similar to Adzuna, detailed fetch is often separate
  }

  private mapToOpportunity(job: any): Opportunity {
    const deadlineStr = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return {
      id: `jooble-${job.id}`,
      icon: '💼',
      title: job.title,
      org: job.company || 'Unknown Company',
      cat: 'job' as Category,
      loc: job.location,
      fund: 'Paid Position' as FundingType,
      deadline: deadlineStr,
      days: 15,
      desc: job.snippet,
      featured: false,
      about: job.snippet,
      elig: ['Please check official listing for requirements'],
      benefits: ['Competitive compensation'],
      applyUrl: job.link,
      quickinfo: {
        Type: 'Job',
        Location: job.location,
        Salary: job.salary || 'Not Specified',
      }
    };
  }
}
