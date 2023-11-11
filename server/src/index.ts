import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { exampleRoute } from "./routes/exampleRoute";
import { verifyToken } from "./middlewares/verifyToken";
import { notFound, errorHandler } from "./middlewares/errors";
import { connectDB } from "../config/database";
import { beneficiaryRoute } from "./routes/testRoute";

dotenv.config();

const app: Express = express();
const PORT: number | string = process.env.PORT || 3001;

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
app.use("/example", verifyToken, exampleRoute);
app.use("/test", beneficiaryRoute);

// Default route: Unprotected
app.get("/", (_req: Request, res: Response) => {
  res.send("Express + Typescript Auth Server Temp!");
});

app.put("/test/", (req: Request, res: Response) => {
});

app.delete("/test/", (req: Request, res: Response) => {  
});

// error handling route
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
