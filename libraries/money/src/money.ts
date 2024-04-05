export class Money {
  private constructor(private readonly cents: number) {}

  static cents(cents: number) {
    return new Money(cents);
  }

  static euros(euros: number) {
    return new Money(Math.round(euros * 100));
  }

  get inEuros(): number {
    return this.cents / 100;
  }

  get inCents(): number {
    return this.cents;
  }

  toString(): string {
    const formattedEuros = this.inEuros.toFixed(2);
    return `${formattedEuros} €`;
  }
}
