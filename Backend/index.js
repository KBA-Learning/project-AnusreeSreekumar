import express, { json } from "express";
import { adminroute } from './Routes/adminroute.js';
import { playerroute } from "./Routes/playerroute.js";
import { loginroute } from "./Routes/loginroute.js";
import cookieParser from 'cookie-parser';
import { authenticate } from "./Middleware/auth.js";

import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser()); 

app.use(json());
app.use('/', loginroute)
app.use('/', adminroute)
app.use('/', playerroute)

app.get('/check-auth', authenticate, (req, res) => {
    res.json({
      username: req.username,
      role: req.userrole,
    });
})

const port = process.env.port;

app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
})
