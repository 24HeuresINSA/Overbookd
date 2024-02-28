export type AvailabilitiesForAlert = {
  getCountFor(adherentId: number): Promise<number>;
};
