export const CTMA_URL = "https://cetaitmieuxavant.24heures.org";
const CETAITMIEUXAVANT = "cetaitmieuxavant";
export const PREPROD = "preprod";
export const WIKI_URL = "https://wiki.24heures.org";
export const OVERVIEW_URL = "https://overview.24heures.org/";

export function isPreProd(): boolean {
  return window.location.hostname.includes(PREPROD);
}

export function isCetaitMieuxAvant(): boolean {
  return window.location.hostname.includes(CETAITMIEUXAVANT);
}
