import app from './app';
import dotenv from 'dotenv';

import { connectDB } from './config/database';

dotenv.config({ quiet: true } as any);

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
