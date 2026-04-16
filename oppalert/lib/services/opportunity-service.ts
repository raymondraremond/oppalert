import { Opportunity } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';
import { DbAdapter } from './db-adapter';
import { AdzunaAdapter } from './adzuna-adapter';
import { JoobleAdapter } from './jooble-adapter';
import { MockAdapter } from './mock-adapter';

class OpportunityService {
  private adapters: OpportunityAdapter[] = [];

  constructor() {
    this.adapters.push(new DbAdapter());
    // External adapters removed to focus on local platform data and prevent hangs
    // this.adapters.push(new AdzunaAdapter());
    // this.adapters.push(new JoobleAdapter());
    this.adapters.push(new MockAdapter());
  }


  addAdapter(adapter: OpportunityAdapter) {
    this.adapters.push(adapter);
  }

  async searchAll(query: OpportunityQuery): Promise<Opportunity[]> {
    const results = await Promise.all(
      this.adapters.map(async adapter => {
        try {
          return await adapter.search(query);
        } catch (error) {
          console.error(`Adapter ${adapter.name} failed:`, error);
          return [];
        }
      })
    );
    
    // Flatten and deduplicate by title + organization
    const seen = new Set();
    const flattened = results.flat();
    return flattened.filter(opp => {
      const key = `${opp.title || 'no-title'}-${opp.organization || 'no-org'}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => {
      const daysA = typeof a.days === 'number' ? a.days : 30;
      const daysB = typeof b.days === 'number' ? b.days : 30;
      return daysA - daysB;
    });

  }


  async getOne(id: string): Promise<Opportunity | null> {
    for (const adapter of this.adapters) {
      const opp = await adapter.getById(id);
      if (opp) return opp;
    }
    return null;
  }
}

export const opportunityService = new OpportunityService();
