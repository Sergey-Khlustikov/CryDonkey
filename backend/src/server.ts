import './loadEnv';
import 'express-async-errors';
import ENV from './structures/env';
import express from 'express';
import cors from 'cors'
import initRoutes from './routes';
import connectDB from './config/db';

await connectDB()

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

initRoutes(app)

app.listen(ENV.EXPRESS_SERVER_PORT, () => {
  console.log(`Listening on ${ENV.EXPRESS_SERVER_PORT}`);
});
