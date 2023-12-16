export class Money {
  static inEuros(cents: number) {
    return cents / 100;
  }

  static displayCents(cents: number) {
    const euros = this.inEuros(cents);
    const formattedEuros = euros.toFixed(2);
    return `${formattedEuros} €`;
  }
}
