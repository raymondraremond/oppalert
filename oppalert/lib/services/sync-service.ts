import { query } from '../db';
import { AdzunaAdapter } from './adzuna-adapter';
import { JoobleAdapter } from './jooble-adapter';
import { Opportunity } from '../types';

export class OpportunitySyncService {
  private adzuna = new AdzunaAdapter();
  private jooble = new JoobleAdapter();

  async syncAll() {
    const startTime = Date.now();
    console.log('Starting global opportunity sync...');
    
    const results = {
      adzuna: 0,
      jooble: 0,
      deleted: 0,
      errors: [] as string[]
    };

    // Run Cleanup
    try {
      results.deleted = await this.cleanupStaleOpportunities();
    } catch (err: any) {
      results.errors.push(`Cleanup failed: ${err.message}`);
    }
    
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

    // Log Results
    const durationCount = Date.now() - startTime;
    await this.logSync('all', results, durationCount);

    return results;
  }

  async cleanupStaleOpportunities(): Promise<number> {
    console.log('Cleaning up stale opportunities...');
    const res = await query(
      `DELETE FROM opportunities 
       WHERE source IN ('adzuna', 'jooble') 
       AND (
         deadline < NOW() - INTERVAL '30 days' OR 
         (deadline IS NULL AND created_at < NOW() - INTERVAL '30 days')
       )`,
      []
    );
    return res.rowCount || 0;
  }

  private async logSync(source: string, results: any, duration: number) {
    const status = results.errors.length === 0 ? 'success' : results.errors.length < 3 ? 'partial' : 'failed';
    const errorMessage = results.errors.length > 0 ? results.errors.join('; ') : null;
    
    await query(
      `INSERT INTO sync_logs (
        source, status, items_added, items_deleted, error_message, duration_ms
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [source, status, results.adzuna + results.jooble, results.deleted, errorMessage, duration]
    );
  }

  private async persistOpportunities(opps: Opportunity[], source: 'adzuna' | 'jooble'): Promise<number> {
    let count = 0;
    
    for (const opp of opps) {
      try {
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
