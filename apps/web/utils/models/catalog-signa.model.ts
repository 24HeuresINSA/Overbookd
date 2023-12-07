import { Signage } from "@overbookd/signa";

type WithPotentialProfilePicture = {
  image?: string;
  imageBlob?: string;
};

export type SignageWithPotentialImage = Signage & WithPotentialProfilePicture;
