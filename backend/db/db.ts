import fs from "fs";
import path from "path";
import { Car, EventLog, User } from "../types";
import { ServerResponse } from "node:http";

export const getCollection = (
  res: ServerResponse,
  collectionName: string
): User[] | Car[] | EventLog[] => {
  try {
    const absPath = path.resolve(__dirname, `../../db/${collectionName}.json`);
    const dbData: User[] | Car[] | EventLog[] = JSON.parse(
      fs.readFileSync(absPath, "utf8")
    );
    return dbData;
  } catch (e) {
    console.error("Error adding new user:", e);
    res.statusCode = 500;
    res.write(JSON.stringify({ error: "Internal Server Error" }));
    res.end();
    return [];
  }
};
export const collectionsUpdate = (
  res: ServerResponse,
  collectionName: string,
  updatedData: User[] | Car[] | EventLog[]
): void => {
  const absPath = path.resolve(__dirname, `../../db/${collectionName}.json`);
  try {
    fs.writeFileSync(absPath, JSON.stringify(updatedData, null, 2), "utf8");
  } catch (e) {
    console.error("Error updating collections:", e);
    res.statusCode = 500;
    res.write(JSON.stringify({ error: "Internal Server Error" }));
    res.end();
  }
};
