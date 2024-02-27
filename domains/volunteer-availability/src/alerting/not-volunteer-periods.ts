export interface NotVolunteerPeriods {
  getNbPeriods(adherentId: number): Promise<number>;
}
