export interface Permission {
  id: number;
  name: string;
  description: string;
  teams: string[];
}

export interface CreatePermissionForm {
  id?: number;
  name: string;
  description?: string;
}
