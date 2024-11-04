import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';
import noteRouter from './routes/noteRoute.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
connectDB();

app.use("/api/auth", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/note", noteRouter);

app.get('/', (req, res) => {
    res.send('Sync Space Backend is Running');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});