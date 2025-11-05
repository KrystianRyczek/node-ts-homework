import { ServerResponse } from "node:http";
import path from "node:path";
import fs from "fs";

export const htmlFile = (res: ServerResponse): void => {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    const htmlFile = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/index.html")
    );
    res.write(htmlFile);
    res.end();
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.write("<h1>Internal Server Error</h1>");
    res.end();
  }
};
export const cssFile = (res: ServerResponse): void => {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/css");
    const cssFile = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/style.css")
    );
    res.write(cssFile);
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.write("Internal server error!");
    res.end();
  }
};
export const jsFile = (res: ServerResponse): void => {
  try {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/javascript");
    const jsFile = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/main.js")
    );
    res.write(jsFile);
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.write("Internal server error!");
    res.end();
  }
};
