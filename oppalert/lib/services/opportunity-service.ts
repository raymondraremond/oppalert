import { Opportunity } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';
import { MockAdapter } from './mock-adapter';
import { AdzunaAdapter } from './adzuna-adapter';
import { JoobleAdapter } from './jooble-adapter';

class OpportunityService {
  private adapters: OpportunityAdapter[] = [];

  constructor() {
    // Initializing with MockAdapter to maintain current functionality
    this.adapters.push(new MockAdapter());
    this.adapters.push(new AdzunaAdapter());
    this.adapters.push(new JoobleAdapter());
  }

  addAdapter(adapter: OpportunityAdapter) {
    this.adapters.push(adapter);
  }

  async searchAll(query: OpportunityQuery): Promise<Opportunity[]> {
    const results = await Promise.all(
      this.adapters.map(adapter => adapter.search(query))
    );
    
    // Flatten and deduplicate by ID if necessary
    // For now, just flatten and sort by mock 'days' (deadline)
    return results.flat().sort((a, b) => a.days - b.days);
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
