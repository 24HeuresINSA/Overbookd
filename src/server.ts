import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@shared/Logger";
import mCors from "./cors";

import session from "express-session";
import keycloak, { memoryStore } from "./keycloak";

const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS
app.use(mCors);

app.use(
  session({
    secret: "abcdefageguhdok654sd65_djzuéOdnjzKIJDjneé0I",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

export default app;
