import { PAY_CONTRIBUTION, Permission } from "@overbookd/permission";
import { Members } from "./settle-alerting";

export type Member = {
  id: number;
  permissions: Permission[];
};

export class InMemoryMembers implements Members {
  constructor(private members: Member[]) {}

  haveToSettleContribution(id: number): Promise<boolean> {
    return Promise.resolve(
      this.members.some(
        (member) =>
          member.id === id && member.permissions.includes(PAY_CONTRIBUTION),
      ),
    );
  }
}
