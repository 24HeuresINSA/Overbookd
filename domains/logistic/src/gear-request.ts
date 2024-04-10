export type Gear = {
  slug: string;
  name: string;
};

export type GearRequest = Gear & {
  quantity: number;
};
