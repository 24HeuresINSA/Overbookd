import { AuthRepository } from "~/repositories/auth.repository";
import { TransactionRepository } from "~/repositories/transaction.repository";
import { AssignmentRepository } from "./assignment.repository";
import { CategoryRepository, GearsRepository } from "./catalog.repository";
import { CharismaPeriodRepository } from "./charisma-period.repository";
import { FaRepository } from "./fa.repository";
import { FtRepository } from "./ft.repository";
import { GearRequestRepository } from "./gear-gequest.repository";
import { InventoryRepository } from "./inventory.repository";
import { PermissionRepository } from "./permission.repository";
import { SignaLocationRepository } from "./signa-location.repository";
import { TeamRepository } from "./team.repository";
import { UserRepository } from "./user.repository";
import { OrgaNeedsRepository } from "./orga-needs.repository";
import { VolunteerAvailabilityRepository } from "./volunteer-availability.repository";
import { NeedHelpRepository } from "./need-help.repository";
import { TimelineRepository } from "./timeline.repository";
import { ConfigurationRepository } from "./configuration.repository";

const repositories = {
  user: UserRepository,
  transaction: TransactionRepository,
  FA: FaRepository,
  FT: FtRepository,
  authRepo: AuthRepository,
  team: TeamRepository,
  gear: GearsRepository,
  category: CategoryRepository,
  configuration: ConfigurationRepository,
  signaLocation: SignaLocationRepository,
  permission: PermissionRepository,
  inventory: InventoryRepository,
  gearRequest: GearRequestRepository,
  charismaPeriod: CharismaPeriodRepository,
  volunteerAvailability: VolunteerAvailabilityRepository,
  assignment: AssignmentRepository,
  orgaNeeds: OrgaNeedsRepository,
  needHelp: NeedHelpRepository,
  timeline: TimelineRepository,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  TransactionRepository,
  UserRepository,
  FaRepository,
  FtRepository,
  AuthRepository,
  TeamRepository,
  GearsRepository,
  CategoryRepository,
  ConfigurationRepository,
  SignaLocationRepository,
  PermissionRepository,
  InventoryRepository,
  GearRequestRepository,
  CharismaPeriodRepository,
  VolunteerAvailabilityRepository,
  AssignmentRepository,
  OrgaNeedsRepository,
  NeedHelpRepository,
  TimelineRepository,
};
