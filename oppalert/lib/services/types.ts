import { Opportunity, Category } from '../types';

export interface OpportunityQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  category?: Category;
  fundingType?: string;
}

export interface OpportunityAdapter {
  name: string;
  search(query: OpportunityQuery): Promise<Opportunity[]>;
  getById(id: string): Promise<Opportunity | null>;
}
