import userRepo from "./userRepo";
import transactionRepo from "~/repositories/transactionRepo";

const repositories = {
  user: userRepo,
  transaction: transactionRepo,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
  transactionRepo,
  userRepo,
};
