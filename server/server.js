import express from 'express'
import helmet from "helmet"
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser'

import connectDB from './config/mongodb.js';

import authRouter from './routes/auth.routes.js';
import sessionRoutes from './routes/session.routes.js'
import achievementRoutes from './routes/achievements.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import leaderboardRoutes from './routes/leaderboard.routes.js'
import statisticsRoutes from './routes/statistics.routes.js'
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import logger from './utils/logger.js';


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(requestLogger)
app.use("/api", apiLimiter);

app.get('/', (req, res) => {
    res.send('FocusTube Backed Running')
});

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/statistics", statisticsRoutes)

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port http://localhost:${PORT}`)
})
