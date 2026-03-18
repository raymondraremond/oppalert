import { Opportunity } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';

export class DbAdapter implements OpportunityAdapter {
  name = 'OppAlert Database';

  async search(query: OpportunityQuery): Promise<Opportunity[]> {
    try {
      const params = new URLSearchParams();
      if (query.category) params.append('cat', query.category);
      if (query.keyword) params.append('q', query.keyword);
      if (query.location && query.location !== 'Any Location') params.append('loc', query.location);
      params.append('limit', '50');

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Opportunity | null> {
    try {
      const res = await fetch(`/api/opportunities/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  }
}
