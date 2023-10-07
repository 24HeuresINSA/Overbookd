export class Money {
  static inEuros(cents: number) {
    return cents / 100;
  }

  static displayCents(cents: number) {
    return `${this.inEuros(cents)}  €`;
  }
}
