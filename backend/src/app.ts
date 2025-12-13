import express, { Application } from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app: Application = express();

import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.get('/', (req, res) => {
    res.send('Sweet Shop API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
