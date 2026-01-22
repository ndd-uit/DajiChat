import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
dotenv.config(); // Tai cau hinh tu file .env

const app = express(); // Tao ra ung dung Express
const PORT = process.env.PORT || 3000; // Cau hinh cong mac dinh

//middlwares
app.use(express.json()); // De phan tich JSON trong request body

//public routes
app.use('/api/auth', authRoute);
//private routes

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
});