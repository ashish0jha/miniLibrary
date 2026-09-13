import { Pool } from "pg";

const pgClinet = new Pool({
    connectionString:process.env.DB_LINK,
});

export default pgClinet;