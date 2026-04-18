import { Opportunity } from '../types';
import { OpportunityAdapter, OpportunityQuery } from './types';
import { query } from '../db';
import { opportunities as seedData } from '../data';

export class DbAdapter implements OpportunityAdapter {
  name = 'OppFetch Database';

  async search(searchQuery: OpportunityQuery): Promise<Opportunity[]> {
    try {
      // 1. Fallback if no database
      if (!process.env.DATABASE_URL) {
        return this.searchSeed(searchQuery);
      }

      const { keyword, category, location, fundingType, limit = 5 } = searchQuery;
      let sql = 'SELECT * FROM opportunities WHERE is_active = true';
      const params: any[] = [];
      let idx = 1;

      if (category && (category as string) !== 'all') { 
        sql += ` AND category = $${idx++}`; 
        params.push(category); 
      }
      if (fundingType && fundingType !== 'Any Funding') { 
        sql += ` AND funding_type = $${idx++}`; 
        params.push(fundingType); 
      }
      if (location && location !== 'Any Location') { 
        sql += ` AND location ILIKE $${idx++}`; 
        params.push(`%${location}%`); 
      }
      
      if (keyword) {
        const keywords = keyword.split(/\s+/).filter(k => k.length > 1);
        let searchClauses = [];
        for (const kw of keywords) {
          searchClauses.push(`(title ILIKE $${idx} OR organization ILIKE $${idx} OR description ILIKE $${idx} OR category ILIKE $${idx})`);
          params.push(`%${kw}%`);
          idx++;
        }
        if (searchClauses.length > 0) sql += ` AND (${searchClauses.join(' AND ')})`;
      }

      sql += ` ORDER BY is_verified DESC, created_at DESC LIMIT $${idx++}`;
      params.push(limit);

      const { rows } = await query(sql, params);
      return rows.length > 0 ? rows : this.searchSeed(searchQuery);
    } catch (err) {
      console.error('[OppBot] DbAdapter Error:', err);
      return this.searchSeed(searchQuery);
    }
  }

  private searchSeed(searchQuery: OpportunityQuery): Opportunity[] {
    const { keyword, category, location, fundingType, limit = 5 } = searchQuery;
    let filtered = [...seedData];

    if (category && (category as string) !== 'all') {
      filtered = filtered.filter((o: any) => (o.cat || o.category) === category);
    }
    if (fundingType && fundingType !== 'Any Funding') {
      filtered = filtered.filter((o: any) => (o.fund || o.funding_type) === fundingType);
    }
    if (location && location !== 'Any Location') {
      filtered = filtered.filter((o: any) => {
        const loc = (o.loc || o.location || '').toLowerCase();
        return loc.includes(location.toLowerCase());
      });
    }
    if (keyword) {
      const keywords = keyword.toLowerCase().split(/\s+/).filter(k => k.length > 1);
      filtered = filtered.filter((o: any) => {
        const text = `${o.title} ${o.org || o.organization || ''} ${o.description || ''} ${o.cat || o.category || ''}`.toLowerCase();
        return keywords.every(kw => text.includes(kw));
      });
    }

    return filtered.slice(0, limit);
  }

  async getById(id: string): Promise<Opportunity | null> {
    try {
      if (process.env.DATABASE_URL) {
        const { rows } = await query('SELECT * FROM opportunities WHERE id = $1', [id]);
        if (rows[0]) return rows[0];
      }
      return seedData.find(o => o.id === id) || null;
    } catch {
      return seedData.find(o => o.id === id) || null;
    }
  }
}
