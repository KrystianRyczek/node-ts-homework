import postgres from "postgres";

const { POSTGRES_HOST: host } = process.env;
const { POSTGRES_PORT: port } = process.env;
const { POSTGRES_DB: database } = process.env;
const { POSTGRES_USER: user } = process.env;
const { POSTGRES_PASSWORD: password } = process.env;

console.log("Connecting to Postgres with:", {
  host,
  port,
  database,
  user,
  password: password ? "****" : undefined,
});

const sql = postgres({
  user,
  password,
  host,
  port: port ? parseInt(port) : 5432,
  database,
});

export default sql;
