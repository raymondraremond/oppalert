import { Opportunity, Category } from '../types';

export interface OpportunityQuery {
  page?: number;
  keyword?: string;
  location?: string;
  category?: Category;
}

export interface OpportunityAdapter {
  name: string;
  search(query: OpportunityQuery): Promise<Opportunity[]>;
  getById(id: string): Promise<Opportunity | null>;
}
