import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import emailRoutes from './features/emails/email.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import { loadAndScheduleAll } from './features/emails/email.scheduler.js';

dotenv.config();
mongoose.set('strictQuery', false);

const PORT = 8080;
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(emailRoutes);
app.use('/auth', authRoutes);

const bootUpDb = async () => {
  await mongoose.connect(process.env.CONNECTION);
  await loadAndScheduleAll();
  app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));
};

bootUpDb();