export interface User {
  id: string;
  username: string;
  password: string; // Dla uproszczenia przechowujemy hasło w postaci jawnej (w praktyce należy stosować hashowanie)
  role: "admin" | "user";
  balance: number;
  refreshToken: string[];
}

export interface Car {
  id: string;
  model: string;
  price: number;
  ownerId: string;
}
export interface Body {
  [key: string]: string;
}
export interface EventLog {
  carId: string;
  ownerId: string;
  model: string;
  event: "add" | "sell";
}
