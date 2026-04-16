import { opportunityService } from './lib/services/opportunity-service';

async function test() {
  console.log('Testing Opportunity Search...');
  try {
    const results = await opportunityService.searchAll({
      keyword: 'scholarship',
      limit: 5
    });
    console.log(`Success! Found ${results.length} results.`);
    results.forEach(r => console.log(`- ${r.title}`));
  } catch (err) {
    console.error('Search Failed:', err);
  }
}

test();
