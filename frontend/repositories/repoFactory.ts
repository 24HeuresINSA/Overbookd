import authRepo from "~/repositories/authRepo";
import transactionRepo from "~/repositories/transactionRepo";
import { AssignmentRepository } from "./assignmentRepo";
import { CategoryRepository, GearsRepository } from "./catalog.repository";
import { CharismaPeriodRepository } from "./charismaPeriodRepo";
import configurationRepo from "./configurationRepo";
import faRepo from "./faRepo";
import ftRepo from "./ftRepo";
import { GearRequestRepository } from "./gearRequestRepo";
import { InventoryRepository } from "./inventoryRepo";
import locationRepo from "./locationRepo";
import permissionRepo from "./permissionRepo";
import signaLocationRepo from "./signaLocationRepo";
import teamRepo from "./teamRepo";
import userRepo from "./userRepo";
import { OrgaNeedsRepository } from "./orgaNeedsRepo";
import { VolunteerAvailabilityRepository } from "./volunteerAvailabilityRepo";
import { NeedHelpRepository } from "./needHelp.repository";
import { TimelineRepository } from "./timeline.repository";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
  FT: ftRepo,
  location: locationRepo,
  authRepo: authRepo,
  team: teamRepo,
  gear: GearsRepository,
  category: CategoryRepository,
  configuration: configurationRepo,
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
  locationRepo,
  authRepo,
  teamRepo,
  GearsRepository,
  CategoryRepository,
  configurationRepo,
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
