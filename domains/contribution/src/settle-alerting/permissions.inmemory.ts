import { Permission } from "@overbookd/permission";
import { Permissions } from "./settle-alerting";

export type Member = {
  id: number;
  permissions: Permission[];
};

export class InMemoryPermissions implements Permissions {
  constructor(private members: Member[]) {}

  mine(id: number): Promise<Permission[]> {
    const member = this.members.find((member) => member.id === id);
    const permissions = member?.permissions ?? [];
    return Promise.resolve(permissions);
  }
}
