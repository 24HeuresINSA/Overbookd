export interface Collaborator {
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
}

export class CollaboratorRepresentation implements Collaborator {
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
}

export interface CollaboratorWithId extends Collaborator {
  id: number;
}

export class CollaboratorWithIdRepresentation
  extends CollaboratorRepresentation
  implements CollaboratorWithId
{
  id: number;
}
