// api/db/drizzle.ts
import { drizzle as makeDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.js";
import { env } from "hono/adapter";
import type { Context } from "hono";

export default function drizzle(c: Context) {
  const { POSTGRES_URL } = env<{ POSTGRES_URL: string }>(c);
  const sql = neon(POSTGRES_URL);
  return makeDrizzle(sql, { schema, casing: "snake_case" });
}
