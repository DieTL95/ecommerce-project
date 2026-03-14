import type { SelectQueryBuilder } from "kysely";

interface PageResult<O> {
  results: O[];
  total: number;
  pages: number;
}
export async function getPages<O>(
  qb: SelectQueryBuilder<any, any, O>,
  offset: number,
  limit: number,
): Promise<PageResult<O>> {
  console.log(offset);
  const [res, total] = await Promise.all([
    qb
      .offset(offset)
      .limit(limit)
      .orderBy("created_at", "desc")
      .orderBy("id", "desc")
      .groupBy("id")
      .execute(),
    qb
      .clearSelect()
      .select((eb) => [eb.fn.countAll<number>().as("count")])
      .executeTakeFirstOrThrow(),
  ]);
  return {
    results: res,
    total: total.count,
    pages: Math.ceil(total.count / 12),
  };
}

export default getPages;
