import { createServer } from "http";
import routes from "./routes";
import type { IncomingMessage, ServerResponse } from "node:http";
import dotenv from "dotenv";
import {
  addNewItem,
  createCarsTable,
  createUsersTable,
  deleteItem,
  editItem,
  getItemByProperty,
} from "./db/controlers";
dotenv.config({ path: "../.env" });

const port: string = process.env.PORT || "3000";
if (!port) {
  throw new Error("PORT environment variable is not defined");
}
const serverPort: number = parseInt(port);
const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    routes(req, res);
  }
);

server.listen(serverPort, async () => {
  console.log(`Server running on http://localhost:${serverPort}`);
  try {
    await createUsersTable();
    await createCarsTable();
    // await addNewItem("users", {
    //   username: "admin",
    //   password: "admin123",
    //   role: "admin",
    //   balance: 1000,
    // });
    // await getItemByProperty("users", "username", "admin");
    // await deleteItem("users", 2);
    // await editItem("users", "id", 1, {
    //   username: "admin1",
    //   password: "newpassword1",
    //   role: "admin",
    // });
  } catch (e) {
    console.log("Error during table creation:", e);
  }
});
