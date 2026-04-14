import { query } from '../db';
import { AdzunaAdapter } from './adzuna-adapter';
import { JoobleAdapter } from './jooble-adapter';
import { Opportunity } from '../types';

export class OpportunitySyncService {
  private adzuna = new AdzunaAdapter();
  private jooble = new JoobleAdapter();

  async syncAll() {
    console.log('Starting global opportunity sync...');
    
    const results = {
      adzuna: 0,
      jooble: 0,
      errors: [] as string[]
    };

    // Sync Adzuna
    try {
      const adzunaJobs = await this.adzuna.search({ limit: 50 });
      results.adzuna = await this.persistOpportunities(adzunaJobs, 'adzuna');
    } catch (err: any) {
      results.errors.push(`Adzuna sync failed: ${err.message}`);
    }

    // Sync Jooble
    try {
      const joobleJobs = await this.jooble.search({ limit: 50 });
      results.jooble = await this.persistOpportunities(joobleJobs, 'jooble');
    } catch (err: any) {
      results.errors.push(`Jooble sync failed: ${err.message}`);
    }

    return results;
  }

  private async persistOpportunities(opps: Opportunity[], source: 'adzuna' | 'jooble'): Promise<number> {
    let count = 0;
    
    for (const opp of opps) {
      try {
        // Use external_id from mapping or derive one
        const externalId = opp.id.startsWith(source) ? opp.id : `${source}-${opp.id}`;
        
        await query(
          `INSERT INTO opportunities (
            external_id, source, icon, title, organization, 
            category, location, funding_type, description, 
            about, eligibility, benefits, application_url, 
            deadline, is_active, is_verified
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, false
          ) ON CONFLICT (external_id) DO UPDATE SET
            title = EXCLUDED.title,
            organization = EXCLUDED.organization,
            location = EXCLUDED.location,
            description = EXCLUDED.description,
            application_url = EXCLUDED.application_url,
            is_active = true
          `,
          [
            externalId,
            source,
            opp.icon || '🌍',
            opp.title,
            opp.org || opp.organization || '',
            opp.cat || opp.category || 'job',
            opp.loc || opp.location || '',
            opp.fund || opp.funding_type || 'Paid Position',
            opp.desc || opp.description || '',
            opp.about || opp.description || '',
            opp.elig || [],
            opp.benefits || [],
            opp.applyUrl || opp.application_url,
            opp.deadline ? new Date(opp.deadline) : null
          ]
        );
        count++;
      } catch (err) {
        console.error(`Failed to persist ${source} job:`, err);
      }
    }
    
    return count;
  }
}

export const syncService = new OpportunitySyncService();
