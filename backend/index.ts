import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { app } from "./app";

require("dotenv").config();

const { PORT: port } = process.env;
const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log("Server running. Use our API on port:", port);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
startServer();
