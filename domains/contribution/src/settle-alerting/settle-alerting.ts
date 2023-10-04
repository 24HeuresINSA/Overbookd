import { Edition } from "../edition";
import { IAlertAboutContribution, SettleAlert } from "./settle-alert";

export interface Members {
  haveToSettleContribution(id: number): Promise<boolean>;
}

export interface IDefineContribution {
  adherentId: number;
  edition: number;
}

export interface Contributions {
  hasAlreadyContribute(contributionId: IDefineContribution): Promise<boolean>;
}

export class SettleAlerting {
  constructor(
    private readonly members: Members,
    private readonly contributions: Contributions,
  ) {}

  async for(id: number): Promise<IAlertAboutContribution | undefined> {
    const edition = Edition.current;
    const [haveToSettleContribution, hasAlreadyContribute] = await Promise.all([
      this.members.haveToSettleContribution(id),
      this.contributions.hasAlreadyContribute({ adherentId: id, edition }),
    ]);

    if (!haveToSettleContribution) return undefined;
    if (hasAlreadyContribute) return undefined;

    return new SettleAlert(edition);
  }
}
