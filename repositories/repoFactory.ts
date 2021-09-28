import userRepo from "./userRepo";

const repositories = {
  user: userRepo,
};

type repoKey = keyof typeof repositories;

export const RepoFactory = {
  get: (name: repoKey) => repositories[name],
};
