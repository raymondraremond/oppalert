async function run() {
  const { query, SCHEMA_SQL } = await import('./oppalert/lib/db.ts');
  try {
    await query(SCHEMA_SQL);
    console.log("SCHEMA EXECUTED SUCCESSFULLY");
  } catch(e) {
    console.error("SCHEMA ERROR:", e);
  }
}
run();
