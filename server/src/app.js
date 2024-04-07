import express from "express";
import cors from "cors";
import {
    loginRouter,
    quizRouter,
    badgeRouter
} from './routes/index.js'

const app = express()

app.use(cors());

app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/badge", badgeRouter);

export default app;