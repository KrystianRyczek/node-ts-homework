import express, { NextFunction, Request, Response } from "express";
import usersRouter from "./routes/users";
import authUsersRouter from "./routes/authUsers";
import authCarRouter from "./routes/authCars";
import sse from "./routes/sse";
// import JWTStrategy from './config/jwt.js';
import authMiddleware from "./middlewares/jwt.js";
export const app = express();
app.use(express.json());

app.use(express.static("../frontend"));
app.use("/sse", sse);
app.use("/api", usersRouter);
app.use("/api", authMiddleware, authUsersRouter);
app.use("/api", authMiddleware, authCarRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Not found - ${req.path}` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.name);
  if (err.name === "ValidationError" || err.name === "BodyData") {
    return res.status(400).json({ serverErrorMessage: err.message });
  }
  if (err.name === "GetCarsFailed" || err.name === "GetUsersFailed") {
    return res.status(404).json({ serverErrorMessage: err.message });
  }
  if (err.name === "IncorrectCredentials" || err.name === "Unauthorized") {
    return res.status(401).json({ serverErrorMessage: err.message });
  }
  if (
    err.name === "BuyCarFailed" ||
    err.name === "AddNewCarFailed" ||
    err.name === "DeleteCarFailed" ||
    err.name === "AddNewUserFailed" ||
    err.name === "UpdateUserFailed" ||
    err.name === "DeleteUserFailed"
  ) {
    return res.status(304).json({ serverErrorMessage: err.message });
  }
  if (err.name === "OcupatedUserName") {
    return res.status(409).json({ serverErrorMessage: err.message });
  }
  res.status(500).json({ serverErrorMessage: err.message });
});
