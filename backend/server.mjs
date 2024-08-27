import './loadEnv.mjs';
import 'express-async-errors';
import ENV from './structures/env.mjs';
import express from 'express';
import cors from 'cors'
import initRoutes from './routes/index.mjs';
import connectDB from './config/db.mjs';
import errorHandler from './middlewares/errorHandler.mjs';

await connectDB()

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler)

initRoutes(app)

app.listen(ENV.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${ENV.EXPRESS_SERVER_PORT}`);
});
