import { Signage } from "@overbookd/signa";

type WithPotentialImage = {
  image?: string;
  imageBlob?: string;
};

export type SignageWithPotentialImage = Signage & WithPotentialImage;
