import '#src/loadEnv.js'
import 'express-async-errors';
import ENV from "#src/structures/env.js";
import express, {Express} from 'express';
import cors from 'cors'
import initRoutes from "#src/routes/index.js";
import connectDB from "#src/config/db.js";

(async () => {
  await connectDB();

  const app: Express = express();

  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({extended: false}));

  initRoutes(app);

  app.listen(ENV.EXPRESS_SERVER_PORT, () => {
    console.log(`Listening on ${ENV.EXPRESS_SERVER_PORT}`);
  });
})();
