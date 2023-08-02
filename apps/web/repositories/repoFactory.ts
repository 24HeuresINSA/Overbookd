import authRepo from "~/repositories/authRepo";
import transactionRepo from "~/repositories/transactionRepo";
import { AssignmentRepository } from "./assignmentRepo";
import { CategoryRepository, GearsRepository } from "./catalog.repository";
import { CharismaPeriodRepository } from "./charismaPeriodRepo";
import faRepo from "./faRepo";
import ftRepo from "./ftRepo";
import { GearRequestRepository } from "./gearRequestRepo";
import { InventoryRepository } from "./inventoryRepo";
import permissionRepo from "./permissionRepo";
import signaLocationRepo from "./signaLocationRepo";
import teamRepo from "./teamRepo";
import userRepo from "./userRepo";
import { OrgaNeedsRepository } from "./orgaNeedsRepo";
import { VolunteerAvailabilityRepository } from "./volunteerAvailabilityRepo";
import { NeedHelpRepository } from "./needHelp.repository";
import { TimelineRepository } from "./timeline.repository";
import { ConfigurationRepository } from "./configurationRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
  FT: ftRepo,
  authRepo: authRepo,
  team: teamRepo,
  gear: GearsRepository,
  category: CategoryRepository,
  configuration: ConfigurationRepository,
  signaLocation: signaLocationRepo,
  permission: permissionRepo,
  inventoryRepository: InventoryRepository,
  gearRequestRepository: GearRequestRepository,
  charismaPeriod: CharismaPeriodRepository,
  volunteerAvailability: VolunteerAvailabilityRepository,
  assignmentRepository: AssignmentRepository,
  orgaNeeds: OrgaNeedsRepository,
  needHelp: NeedHelpRepository,
  timeline: TimelineRepository,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  transactionRepo,
  userRepo,
  faRepo,
  ftRepo,
  authRepo,
  teamRepo,
  GearsRepository,
  CategoryRepository,
  ConfigurationRepository,
  signaLocationRepo,
  permissionRepo,
  InventoryRepository,
  GearRequestRepository,
  CharismaPeriodRepository,
  VolunteerAvailabilityRepository,
  AssignmentRepository,
  OrgaNeedsRepository,
  NeedHelpRepository,
  TimelineRepository,
};
