import authRepo from "~/repositories/authRepo";
import equipmentRepo from "~/repositories/equipementRepo";
import transactionRepo from "~/repositories/transactionRepo";
import { CategoryRepository, GearsRepository } from "./catalog.repository";
import configurationRepo from "./configurationRepo";
import conflictsRepo from "./conflictsRepo";
import equipmentProposalRepo from "./equipmentProposalRepo";
import faRepo from "./faRepo";
import ftRepo from "./ftRepo";
import locationRepo from "./locationRepo";
import signaLocationRepo from "./signaLocationRepo";
import teamRepo from "./teamRepo";
import timeslotRepo from "./timeslotRepo";
import userRepo from "./userRepo";
import permissionRepo from "./permissionRepo";
import { InventoryRepository } from "./inventoryRepo";
import { GearRequestRepository } from "./gearRequestRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
  equipment: equipmentRepo,
  FT: ftRepo,
  timeslot: timeslotRepo,
  location: locationRepo,
  authRepo: authRepo,
  equipmentProposal: equipmentProposalRepo,
  Conflict: conflictsRepo,
  team: teamRepo,
  gear: GearsRepository,
  category: CategoryRepository,
  configuration: configurationRepo,
  signaLocation: signaLocationRepo,
  permission: permissionRepo,
  inventoryRepository: InventoryRepository,
  gearRequestRepository: GearRequestRepository,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  transactionRepo,
  userRepo,
  faRepo,
  ftRepo,
  equipmentRepo,
  timeslotRepo,
  locationRepo,
  authRepo,
  equipmentProposalRepo,
  conflictsRepo,
  teamRepo,
  GearsRepository,
  CategoryRepository,
  configurationRepo,
  signaLocationRepo,
  permissionRepo,
  InventoryRepository,
  GearRequestRepository,
};
