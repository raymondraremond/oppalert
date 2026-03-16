import { Opportunity } from '../types';
import { opportunities } from '../data';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class MockAdapter implements OpportunityAdapter {
  name = 'Mock Service';

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    let filtered = [...opportunities];

    if (query.category) {
      filtered = filtered.filter(o => o.cat === query.category);
    }

    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(kw) || 
        o.desc.toLowerCase().includes(kw) ||
        o.org.toLowerCase().includes(kw)
      );
    }

    if (query.location) {
      const loc = query.location.toLowerCase();
      filtered = filtered.filter(o => o.loc.toLowerCase().includes(loc));
    }

    return filtered;
  }

  async getById(id: string): Promise<Opportunity | null> {
    return opportunities.find(o => o.id === id) || null;
  }
}
