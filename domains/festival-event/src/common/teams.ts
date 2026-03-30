import { Reviewer } from "./review";

export type FestivalEventTeams = {
  findNameByCode(code: Reviewer<"FA">): string;
};

export class InMemoryFestivalEventTeams implements FestivalEventTeams {
  constructor() {}

  findNameByCode(code: Reviewer<"FA">): string {
    return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
  }
}
