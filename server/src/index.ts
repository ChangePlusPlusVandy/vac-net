import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { exampleRoute } from "./routes/exampleRoute";
import { verifyToken } from "./middlewares/verifyToken";
import { notFound, errorHandler } from "./middlewares/errors";
import { connectDB } from "../config/database";
import loanRoute from "./routes/loan.router";
import beneficiaryRouter from "./routes/beneficiary.router";
import sessionRouter from "./routes/sessions.router";
import userRouter from "./routes/user.router";

dotenv.config();

const app: Express = express();
const PORT: number | string = process.env.PORT ?? 3001;

void connectDB(); // Connect to MongoDB

app.use(cors()); // Allow cross-origin requests (for frontend to communicate with backend on different ports/address)
app.use(express.json()); // Parses incoming JSON requests and uts the parsed data in req
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlenconded payloads
// error handling and better logging
app.use(morgan("dev"));
app.use(helmet());

/**
 * Uses the verifyToken middleware to protect the "/data" route
 * Use the verifyToken to protect all the routes that require authentication
 */
app.use("/loan", loanRoute);
app.use("/beneficiary", beneficiaryRouter);
app.use("/session", sessionRouter);
app.use("/user", userRouter);
// Default route: Unprotected
app.get("/", (_req: Request, res: Response) => {
  res.send("Express + Typescript Auth Server Temp!");
});

// error handling route
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
