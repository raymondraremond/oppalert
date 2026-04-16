import { Opportunity } from '../types';
import { opportunities } from '../data';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class MockAdapter implements OpportunityAdapter {
  name = 'Mock Service';

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    let filtered = [...opportunities];

    if (query.category && (query.category as string) !== 'all') {
      filtered = filtered.filter(o => (o.cat || o.category) === query.category);
    }

    if (query.fundingType && query.fundingType !== 'Any Funding') {
      filtered = filtered.filter(o => (o.fund || o.funding_type) === query.fundingType);
    }

    if (query.keyword) {
      const keywords = query.keyword.toLowerCase().split(/\s+/).filter(k => k.length > 1);
      filtered = filtered.filter(o => {
        const searchableText = `
          ${o.title} 
          ${o.organization || o.org || ''} 
          ${o.description || o.desc || ''} 
          ${o.category || o.cat || ''} 
          ${((o as any).tags || []).join(' ')}
        `.toLowerCase();
        
        // Match if ALL keywords are present somewhere (Simple AND search)
        return keywords.every(kw => searchableText.includes(kw));
      });
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
