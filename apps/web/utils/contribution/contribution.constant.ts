import {
  type ContributionType,
  DONATOR,
  MEMBER,
} from "@overbookd/contribution";

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  [MEMBER]: "Membre",
  [DONATOR]: "Donateur",
};

type ContributionTypeItem = { title: string; value: ContributionType };

export const CONTRIBUTION_TYPE_ITEMS: ContributionTypeItem[] = [
  { title: CONTRIBUTION_TYPE_LABELS.MEMBER, value: MEMBER },
  { title: CONTRIBUTION_TYPE_LABELS.DONATOR, value: DONATOR },
];
