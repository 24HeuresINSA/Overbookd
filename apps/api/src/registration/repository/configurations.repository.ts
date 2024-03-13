export type Configurations = {
  getInviteStaffLink(): Promise<string | undefined>;
  saveInviteStaffLink(link: string): Promise<void>;
};
