import pkg from "pg";
const { Pool } = pkg;
export const pool = new Pool({
  user: "postgres",
  password: "pakistan@715",
  host: "localhost",
  port: 5432,
  database: "xychros_backend_new",
});
