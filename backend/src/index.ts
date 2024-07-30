import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import userRoutes from './routes/userRoutes';

import moderationRouter from './routes/mRuote';

import reviewRoutes from './routes/reviewRoutes';


const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());


app.use("/api/user", userRoutes);
//actual path (/api/admin/reviews/approve)
// body :-> {"content":"....."}
app.use("/api/admin",moderationRouter);

app.use("/api/review", reviewRoutes)




app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});