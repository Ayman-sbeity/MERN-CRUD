import express from 'express';
import dbCon from './utils/db.js';
import dotenv from 'dotenv';
import routers from './routes/routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

dbCon();


app.use('/api',routers)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
