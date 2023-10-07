export interface SignaLocation {
  id: number;
  name: string;
}

export type CreateLocation = Pick<SignaLocation, "name">;

export interface SignaLocationCreate {
  name: string;
}
