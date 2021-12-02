import userRepo from "./userRepo";
import faRepo from "./faRepo";
import ftRepo from "./ftRepo";
import transactionRepo from "~/repositories/transactionRepo";
import equipmentRepo from "~/repositories/equipementRepo";
import timeslotRepo from "./timeslotRepo";
import locationRepo from "./locationRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
  FA: faRepo,
  equipment: equipmentRepo,
  FT: ftRepo,
  timeslot: timeslotRepo,
  location: locationRepo,
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
};
