import "dotenv/config";
import fs, { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import pgClinet from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    await pgClinet.connect();
    console.log("DB Connected");

    const migrationsFolder = path.join(__dirname,"migrations");

    const filesInThatFolder = fs.readdirSync(migrationsFolder).sort();

    for(const file of filesInThatFolder) {
        if(!file.endsWith(".sql")) continue;

        const filepath = path.join(migrationsFolder,file);
        const sql = readFileSync(filepath,"utf-8");

        console.log(`Running Migrations : ${file}`);
        await pgClinet.query(sql);
        console.log(`Done : ${file}`);
    }
    console.log("All Migrations Done");
    process.exit(0);
}

await runMigrations()
.catch((err)=>{
    console.error("Migrations Failed : ",err);
    process.exit(1);
})