import express from "express"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import callRouter from "./routes/call.routes.js"
import agentRouter from "./routes/agent.routes.js"
import analyticsRouter from "./routes/analytics.routes.js"  // ✅ ADD THIS

import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/error.middlewares.js"

const app = express()

// middlewares
app.use(cors({
    origin: [
        'http://localhost:8081',  // Dashboard
        'http://localhost:8082'   // Homepage
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// common middlewares
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/calls", callRouter);
app.use("/api/v1/agents", agentRouter);
app.use("/api/v1", analyticsRouter);  // ✅ ADD THIS LINE

app.use(errorHandler);

export { app }