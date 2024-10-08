import { PAY_CONTRIBUTION, Permission } from "@overbookd/permission";
import { Edition } from "../edition.js";
import { IAlertAboutContribution, SettleAlert } from "./settle-alert.js";

export type Permissions = {
  mine(id: number): Promise<Permission[]>;
};

export type IDefineContribution = {
  adherentId: number;
  edition: number;
};

export type Contributions = {
  mine(adherentId: number): Promise<IDefineContribution[]>;
};

export class SettleAlerting {
  constructor(
    private readonly permissions: Permissions,
    private readonly contributions: Contributions,
  ) {}

  async for(id: number): Promise<IAlertAboutContribution | undefined> {
    const edition = Edition.current;
    const [myPermissions, myContributions] = await Promise.all([
      this.permissions.mine(id),
      this.contributions.mine(id),
    ]);

    if (this.isFreeFromContributing(myPermissions)) return undefined;
    if (this.hasAlreadyContribute(myContributions)) return undefined;

    return new SettleAlert(edition);
  }

  private isFreeFromContributing(myPermissions: Permission[]): boolean {
    return !myPermissions.includes(PAY_CONTRIBUTION);
  }

  private hasAlreadyContribute(
    myContributions: IDefineContribution[],
  ): boolean {
    const currentEdition = Edition.current;
    return myContributions.some(({ edition }) => edition === currentEdition);
  }
}
