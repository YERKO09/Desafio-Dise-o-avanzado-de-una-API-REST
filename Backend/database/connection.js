import "dotenv/config";
import pg from "pg";

export const { Pool } = pg;

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env
// cambia los datos de acuerdo a tu configuración de postgres
export const pool = new Pool({
  // user: PGUSER,
  // host: PGHOST,
  // database: PGDATABASE,
  password: PGPASSWORD,
  // port: PGPORT,
  allowExitOnIdle: true,
});
try {
  await pool.query("SELECT NOW()");
  console.log("Database connected!!!");
} catch (error) {
  console.log(error);
}