import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "dotenv/config";

const app = express();





app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});