export interface SignaLocation {
  id: number;
  name: string;
}

export type CreateLocation = Pick<SignaLocation, "name">;

export interface SignaLocationCreate {
  name: string;
}

export class Location implements SignaLocation {
  constructor(readonly id: number, readonly name: string) {
    this.id = id;
    this.name = name;
  }
}
