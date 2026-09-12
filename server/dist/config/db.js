import { Client } from "pg";
console.log(process.env.DB_LINK);
const pgClinet = new Client(process.env.DB_LINK);
export default pgClinet;
//# sourceMappingURL=db.js.map