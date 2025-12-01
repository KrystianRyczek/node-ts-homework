export interface User {
  id: number;
  username: string;
  password: string; // Dla uproszczenia przechowujemy hasło w postaci jawnej (w praktyce należy stosować hashowanie)
  role: "admin" | "user";
  balance: number;
  createdAt: Date;
}

export interface Car {
  id: number;
  model: string;
  price: number;
  ownerId: number;
  createdAt: Date;
}
export interface Body {
  [key: string]: string;
}
export interface EventLog {
  carId: number;
  buyerId: number;
  model: string;
  event: "add" | "sell";
}
