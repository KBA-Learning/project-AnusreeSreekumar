import express, { json } from "express";
import { adminroute } from './Routes/adminroute.js';
import { playerroute } from "./Routes/playerroute.js";
import dotenv from 'dotenv';

const app = express();
app.use(json());
app.use('/', adminroute)
app.use('/', playerroute)

const port = process.env.port;

app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
})
