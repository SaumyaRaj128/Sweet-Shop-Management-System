import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

import authRoutes from './routes/authRoutes';

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Sweet Shop API is running...');
});

export default app;
