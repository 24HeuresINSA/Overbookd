import { Assignment } from "../assignment";
import { Assignments } from "../repositories/assignments";
import { CandidateFactory, IDefineCandidate } from "./candidate";
import { Volunteer } from "./volunteer";

export class FunnelError extends Error {}

export type FulfillDemand = {
  volunteer: Volunteer["id"];
  team: string;
};

export type IStartupFunnel = {
  select(assignment: Assignment): {
    select(volunteer: Volunteer): Promise<IActAsFunnel>;
  };
};

export type IActAsFunnel = {
  candidates: IDefineCandidate[];
  canAssign: boolean;
  assign(): Promise<IStartupFunnel>;
  canFulfillMoreRemainingDemands: boolean;
  addCandidate(): Promise<IActAsFunnel>;
  fulfillDemand(volunteer: FulfillDemand): IActAsFunnel;
  canRevokeLastCandidate: boolean;
  revokeLastCandidate(): IActAsFunnel;
  canChangeLastCandidate: boolean;
  previousCandidate(): Promise<IActAsFunnel>;
  nextCandidate(): Promise<IActAsFunnel>;
};

export type FunnelRepositories = {
  assignments: Assignments;
  candidateFactory: CandidateFactory;
};
