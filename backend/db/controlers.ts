import sql from "./db";
import { hashPassword } from "../util/auth";
import { Car, User } from "../types";

export const createUsersTable = async () => {
  console.log("Creating USERS table not exists.");
  console.log("Creating USERS table...");
  await sql`CREATE TABLE IF NOT EXISTS USERS( id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, role VARCHAR(10) DEFAULT 'user', balance FLOAT DEFAULT 10000);`;
  const dbRespons = await sql`SELECT * FROM USERS;`;
  if (dbRespons.length === 0) {
    await sql`INSERT INTO USERS (username, password, role) VALUES ('admin', ${hashPassword(
      process.env.ADMIN_PASSWORD || "admin123"
    )}, 'admin');`;
  }
};
export const createCarsTable = async () => {
  console.log("CARS table not exists.");
  console.log("Creating CARS table...");
  await sql`CREATE TABLE IF NOT EXISTS CARS( id SERIAL PRIMARY KEY, model VARCHAR(100) NOT NULL, price FLOAT NOT NULL, ownerId VARCHAR(100) );`;
};

export const addNewItem = async (
  tableName: string,
  item: { [key: string]: string | number }
) => {
  const propertysArr: string[] = Object.keys(item);
  const addedItem: User[] | Car[] = await sql`INSERT INTO ${sql(
    tableName
  )} ${sql(item, propertysArr)} RETURNING *;`;
  console.log("Added item:", addedItem);
  if (addedItem.length > 0) {
    return addedItem;
  } else {
    return null;
  }
};

export const getItemByProperty = async (
  tableName: string,
  property: string,
  value: string | number
) => {
  const item: User[] | Car[] = await sql`SELECT * FROM ${sql(
    tableName
  )} WHERE ${sql(property)} = ${value} ;`;
  if (item.length > 0) {
    return item;
  }
  return null;
};

export const getItems = async (tableName: string) => {
  const items: User[] | Car[] = await sql`SELECT * FROM ${sql(tableName)};`;
  if (items.length > 0) {
    return items as User[] | Car[];
  }
  return null;
};

export const editItem = async (
  tableName: string,
  propertyName: string,
  propertyValue: string | number,
  updatedItem: { [key: string]: string | number }
) => {
  const updatedItems: User[] | Car[] = await sql`UPDATE ${sql(
    tableName
  )} SET ${sql(updatedItem)} WHERE ${sql(
    propertyName
  )} = ${propertyValue} RETURNING *;`;
  if (updatedItems.length > 0) {
    return updatedItems as User[] | Car[];
  }
  return null;
};

export const deleteItem = async (tableName: string, itemId: number) => {
  const deletedItems: User[] | Car[] = await sql`DELETE FROM ${sql(
    tableName
  )} WHERE id = ${itemId} RETURNING *;`;
  if (deletedItems.length > 0) {
    return deletedItems as User[] | Car[];
  }
  return null;
};
