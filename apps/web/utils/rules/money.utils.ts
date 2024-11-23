export function endByNumber(value: string): boolean {
  return /\d$/.test(value);
}

export function endByNumberSeparation(value: string): boolean {
  return /[.,]$/.test(value);
}

export function hasOneZeroAfterSeparator(value: string): boolean {
  return /[.,]0$/.test(value);
}
