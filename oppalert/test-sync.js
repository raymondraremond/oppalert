async function test() {
  const routes = [
    '/api/cron/sync'
  ];

  console.log("Waiting a few seconds for server to be fully ready...")
  await new Promise(r => setTimeout(r, 6000));

  for (const route of routes) {
    console.log(`\nTesting ${route}...`);
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      const data = await res.json();
      console.log(`Status: ${res.status}`);
      console.log(`Response:`, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error fetching ${route}:`, e.message);
    }
  }
}

test();
