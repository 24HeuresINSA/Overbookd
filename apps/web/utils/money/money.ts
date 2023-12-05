export class Money {
  static inEuros(cents: number) {
    return cents / 100;
  }

  static displayCents(cents: number) {
    const euros = this.inEuros(cents);
    const hasCents = euros % 1 !== 0;
    const formattedEuros = hasCents ? euros.toFixed(2) : euros.toFixed(0);
    return `${formattedEuros} €`;
  }
}
