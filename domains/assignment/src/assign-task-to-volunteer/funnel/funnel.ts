import { AssignableVolunteer } from "../assignable-volunteer.js";
import { Assignment } from "../assignment.js";
import { Assignments } from "../repositories/assignments.js";
import { CandidateFactory, IDefineCandidate } from "./candidate.js";

export class FunnelError extends Error {}

export type FulfillDemand = {
  volunteer: AssignableVolunteer["id"];
  team: string;
};

export type IStartupFunnel = {
  select(assignment: Assignment): {
    select(volunteer: AssignableVolunteer): Promise<IActAsFunnel>;
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
