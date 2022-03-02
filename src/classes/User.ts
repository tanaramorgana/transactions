import Transaction from "./Transaction";

export default class User {
  id: number;
  transactions: Transaction[] = [];

  constructor(
    public name: string,
    public cpf: string,
    public email: string,
    public age: string
  ) {
    this.id = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  }
}
