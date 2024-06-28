export function endByNumber(value: string): boolean {
  return /\d$/.test(value);
}

export function endByNumberSeparation(value: string): boolean {
  return /[.,]$/.test(value);
}
