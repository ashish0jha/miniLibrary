import express from 'express';
import "dotenv/config"
import pgClinet from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import adminrouter from './routes/books.js';
import BorrowReturnRouter from './routes/borrowReturn.js';
import libraryRouter from './routes/library.js'
import adminOnlyRouter from './routes/adminOnly.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/admin",adminrouter);
app.use("/",BorrowReturnRouter);
app.use("/",libraryRouter);
app.use("/",adminOnlyRouter)

pgClinet.connect()
.then(()=>{
    console.log("DB Connected");
    app.listen(3000,()=>console.log("Server Listening at port 3000"));
})
.catch((err)=>{
    console.log("DB not Connected",err.message)
})