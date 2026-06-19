export interface ApiZitadelUserCreated {
  userId: string;
  details: {
    sequence: string;
    changeDate: string;
    resourceOwner: string;
  };
}
