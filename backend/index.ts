import { createServer } from "http";
import routes from "./routes";
import type { IncomingMessage, ServerResponse } from "node:http";
import dotenv from "dotenv";
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

server.listen(serverPort, () => {
  console.log(`Server running on http://localhost:${serverPort}`);
});
