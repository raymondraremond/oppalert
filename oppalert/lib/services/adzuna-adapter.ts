import { Opportunity, Category, FundingType } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class AdzunaAdapter implements OpportunityAdapter {
  name = 'Adzuna Jobs';
  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) {
      console.warn('Adzuna: Missing ADZUNA_APP_ID or ADZUNA_APP_KEY env vars');
      return [];
    }
    
    // Adzuna only provides jobs, so if user specifically asked for scholarship/grant, we return empty
    if (query.category && query.category !== 'job' && query.category !== 'internship') {
      return [];
    }

    // Use 'gb' (UK) as primary - it has the most comprehensive global job coverage.
    // 'za' (South Africa) returns near-zero results on the free tier.
    const countries = ['gb', 'us'];
    const allJobs: Opportunity[] = [];

    for (const country of countries) {
      try {
        const page = query.page || 1;
        let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`
          + `?app_id=${appId}&app_key=${appKey}`
          + `&content-type=application/json`
          + `&results_per_page=${Math.ceil((query.limit || 50) / countries.length)}`;

        if (query.keyword) url += `&what=${encodeURIComponent(query.keyword)}`;
        if (query.location) url += `&where=${encodeURIComponent(query.location)}`;

        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Adzuna [${country}] HTTP ${response.status}:`, await response.text());
          continue;
        }
        const data = await response.json();
        const jobs = (data.results || []).map((job: any) => this.mapToOpportunity(job, country));
        console.log(`Adzuna [${country}]: fetched ${jobs.length} jobs`);
        allJobs.push(...jobs);
      } catch (error) {
        console.error(`Adzuna [${country}] error:`, error);
      }
    }

    return allJobs;
  }

  async getById(id: string): Promise<Opportunity | null> {
    // Adzuna search returns many fields, but detailed 'getById' is often limited in free tier.
    // For this integration, we usually rely on search results or direct links.
    // Mocking for now since we'd mostly be using IDs from search results.
    return null; 
  }

  private mapToOpportunity(job: any, country = 'gb'): Opportunity {
    // Mapping Adzuna fields to OppFetch schema
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
