import { Client } from "pg";

const pgClinet = new Client(process.env.DB_LINK);

export default pgClinet;