import type { Team } from "@overbookd/team";

type HasTeam = {
  teams: string[];
};

export function keepMembersOf(teams: Team[]): (member: HasTeam) => boolean {
  if (teams.length === 0) return () => true;

  return (member) => {
    return teams.every(({ code }) => member.teams.includes(code));
  };
}

export function excludeMembersOf(teams: Team[]): (member: HasTeam) => boolean {
  if (teams.length === 0) return () => true;

  return (member) => {
    return !teams.some(({ code }) => member.teams.includes(code));
  };
}
