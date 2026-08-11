import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



dotenv.config({
    path : './.env'
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true
    })
)

import productRouter from "./routes/product.routes.js";
app.use("/api/v1/products", productRouter)

import categoryRouter from "./routes/category.routes.js";
app.use("/api/v1/categories", categoryRouter)


export {app}