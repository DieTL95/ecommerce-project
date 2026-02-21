import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";
import type { DB } from "./db.d.ts";

dotenv.config({ quiet: true });
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
