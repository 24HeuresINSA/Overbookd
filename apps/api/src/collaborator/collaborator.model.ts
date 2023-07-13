interface Collaborator {
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
}

class CollaboratorRepresentation implements Collaborator {
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
}

interface CollaboratorWithOptionalId extends Collaborator {
  id?: number;
}

export class CollaboratorWithOptionalIdRepresentation
  extends CollaboratorRepresentation
  implements CollaboratorWithOptionalId
{
  id?: number;
}

export interface CollaboratorWithId extends CollaboratorWithOptionalId {
  id: number;
}

export class CollaboratorWithIdRepresentation
  extends CollaboratorRepresentation
  implements CollaboratorWithId
{
  id: number;
}
