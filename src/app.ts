import dotenv from "dotenv"
dotenv.config();

import express, { Application, Request, Response} from "express"
import userRouter from "./routes/user-route";
import dbConnect from "./config/database-connection";
import cors from "cors"
import { HttpError } from "./utils/https-error";

const app: Application = express();
const PORT = process.env.PORT;

dbConnect();

app.use(express.json());
app.use(cors());

app.use("/v1/user", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Working");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // MongoDB duplicate key error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      details: err.keyValue
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e: any) => e.message)
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});