import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import xss from "xss-clean";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import session from "express-session";
import rateLimit from "express-rate-limit";

dotenv.config();

const Port = process.env.PORT || 3030;
const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(xss());
app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(limiter);

(async () => {
  try {
    app.listen(Port, () =>
      console.info(`Server listening on http:\//localhost:${Port}`)
    );
  } catch (err: Error | any) {
    console.error(err.message);
    process.exit(1);
  }
})();
