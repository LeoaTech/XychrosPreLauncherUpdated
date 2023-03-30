import NewPool from 'pg';
const { Pool } = NewPool;
export const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});
