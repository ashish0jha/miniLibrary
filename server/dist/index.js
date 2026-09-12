import express from 'express';
import "dotenv/config";
import pgClinet from './config/db.js';
import { configDotenv } from 'dotenv';
const app = express();
pgClinet.connect()
    .then(() => {
    console.log("DB Connected");
    app.listen(3000, () => console.log("Server Listening at port 3000"));
})
    .catch((err) => {
    console.log("DB not Connected", err.message);
});
//# sourceMappingURL=index.js.map