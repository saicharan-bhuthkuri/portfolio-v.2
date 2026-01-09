import { turso } from "./src/lib/db";

async function main() {
    try {
        console.log("Creating contacts table...");
        await turso.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("Success! 'contacts' table created.");
    } catch (e) {
        console.error("Error creating table:", e);
    }
}

main();
