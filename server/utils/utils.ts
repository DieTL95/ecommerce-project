import { type RawBuilder, sql } from "kysely";

export function sqlJSON<T>(object: T): RawBuilder<T> {
  return sql`(${JSON.stringify(object)}::jsonb)`;
}
