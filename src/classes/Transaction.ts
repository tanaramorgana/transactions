export default class Transaction {
  id: number;
  constructor(public title: string, public value: number, public type: string) {
    this.id = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
  }
}
