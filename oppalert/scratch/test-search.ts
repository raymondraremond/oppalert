
import { opportunityService } from './lib/services/opportunity-service';

async function test() {
  console.log('Testing search for "scholarship"...');
  const results = await opportunityService.searchAll({ keyword: 'scholarship' });
  console.log('Results count:', results.length);
  if (results.length > 0) {
    console.log('First result:', results[0].title);
  } else {
    console.log('No results found.');
  }

  console.log('\nTesting search for "fgedbh"...');
  const results2 = await opportunityService.searchAll({ keyword: 'fgedbh' });
  console.log('Results count:', results2.length);
}

test().catch(console.error);
