import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl:
    process.env.PRODUCTION === "true" ? { rejectUnauthorized: false } : false,
});

export default pool;
