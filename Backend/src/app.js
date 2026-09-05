import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const allowedOrigins = process.env.ALLOWED_SITE
    ? process.env.ALLOWED_SITE.split(",").map(s => s.trim())
    : [];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true
};

app.use(cors(corsOptions));

// Health check endpoint for cron jobs (e.g., cron-job.org)
app.get("/", (req, res) => {
    res.status(200).send("Backend is awake!");
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

export default app;
