import { Opportunity } from '../types';
import { opportunities } from '../data';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class MockAdapter implements OpportunityAdapter {
  name = 'Mock Service';

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    let filtered = [...opportunities];

    if (query.category && query.category !== 'all') {
      filtered = filtered.filter(o => (o.cat || o.category) === query.category);
    }

    if (query.fundingType && query.fundingType !== 'Any Funding') {
      filtered = filtered.filter(o => (o.fund || o.funding_type) === query.fundingType);
    }

    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(o => 
        (o.title || '').toLowerCase().includes(kw) || 
        (o.desc || o.description || '').toLowerCase().includes(kw) ||
        (o.org || o.organization || '').toLowerCase().includes(kw)
      );
    }

    if (query.location && query.location !== 'Any Location') {
      const loc = query.location.toLowerCase();
      filtered = filtered.filter(o => (o.loc || o.location || '').toLowerCase().includes(loc));
    }

    return filtered;
  }

  async getById(id: string): Promise<Opportunity | null> {
    return opportunities.find(o => o.id === id) || null;
  }
}
