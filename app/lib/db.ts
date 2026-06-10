import postgres from 'postgres';

let sql: ReturnType<typeof postgres> | null = null;

export function getSql() {
  if (!sql) {
    const postgresUrl = process.env.POSTGRES_URL;
    if (!postgresUrl) {
      throw new Error('Missing required server configuration: POSTGRES_URL');
    }

    sql = postgres(postgresUrl, { ssl: 'require' });
  }

  return sql;
}

export default getSql;
