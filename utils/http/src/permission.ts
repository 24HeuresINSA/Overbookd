export type Permission = {
  id: number;
  name: string;
  description: string;
  teams: string[];
};

export type CreatePermissionForm = {
  id?: number;
  name: string;
  description?: string;
};
