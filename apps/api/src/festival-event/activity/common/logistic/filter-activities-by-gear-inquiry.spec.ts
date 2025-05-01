import { LIVRE_PAR_LOGISTIQUE, MAGASIN } from "@overbookd/festival-event";
import { DatabasePreviewForLogistic } from "../repository/previews.query";
import { DRAFT, IN_REVIEW } from "@overbookd/festival-event-constants";
import { FilterActivitiesByGearInquiry } from "./filter-activities-by-gear-inquiry";

const MOBILIER = {
  name: "Mobilier",
  path: "matos->mobilier",
  owner: { name: "Orga Matos", code: "matos" },
};
const BARRIERES = {
  name: "Barrières",
  path: "barrieres",
  owner: { name: "Orga Barrières", code: "barrieres" },
};

const TABLE = {
  quantity: 30,
  drive: MAGASIN,
  catalogItem: {
    slug: "table",
    name: "Table",
    isPonctualUsage: false,
    isConsumable: false,
    category: MOBILIER,
  },
};
const VAUBAN = {
  quantity: 20,
  drive: undefined,
  catalogItem: {
    slug: "vauban",
    name: "Vauban",
    isPonctualUsage: false,
    isConsumable: false,
    category: BARRIERES,
  },
};

const activityWithTableAndVauban: DatabasePreviewForLogistic = {
  id: 1,
  name: "Activity with Table and Vauban",
  status: DRAFT,
  teamCode: "matos",
  inquiries: [TABLE, VAUBAN],
};
const activityWithTable: DatabasePreviewForLogistic = {
  id: 2,
  name: "Activity with Table",
  status: IN_REVIEW,
  teamCode: "matos",
  inquiries: [TABLE],
};
const activityWithVauban: DatabasePreviewForLogistic = {
  id: 3,
  name: "Activity with Vauban",
  status: DRAFT,
  teamCode: "barrieres",
  inquiries: [VAUBAN],
};
const activityWithoutInquiries: DatabasePreviewForLogistic = {
  id: 4,
  name: "Activity without inquiries",
  status: DRAFT,
  teamCode: "matos",
  inquiries: [],
};

describe("Filter activities by gear inquiry", () => {
  const filter = new FilterActivitiesByGearInquiry([
    activityWithTableAndVauban,
    activityWithTable,
    activityWithVauban,
    activityWithoutInquiries,
  ]);
  describe.each`
    search       | searchCategory   | searchOwner    | searchDrive  | expectedActivities
    ${undefined} | ${undefined}     | ${undefined}   | ${undefined} | ${[activityWithTableAndVauban, activityWithTable, activityWithVauban]}
    ${"Tab"}     | ${undefined}     | ${undefined}   | ${undefined} | ${[activityWithTable, activityWithTableAndVauban]}
    ${"Unknown"} | ${undefined}     | ${undefined}   | ${undefined} | ${[]}
    ${undefined} | ${MOBILIER.path} | ${undefined}   | ${undefined} | ${[activityWithTable, activityWithTableAndVauban]}
    ${undefined} | ${undefined}     | ${"baRRieres"} | ${undefined} | ${[activityWithTableAndVauban, activityWithVauban]}
    ${undefined} | ${undefined}     | ${undefined}   | ${MAGASIN}   | ${[activityWithTable, activityWithTableAndVauban]}
    ${"auBa"}    | ${undefined}     | ${"barrieres"} | ${undefined} | ${[activityWithTableAndVauban, activityWithVauban]}
  `(
    'When looking for "$search" in $searchCategory category with $searchOwner owner and $searchDrive drive',
    ({
      search,
      searchCategory,
      searchOwner,
      searchDrive,
      expectedActivities,
    }) => {
      it("should return all festival activities when matching the gear", () => {
        const activities = filter.apply({
          search,
          category: searchCategory,
          owner: searchOwner,
          drive: searchDrive,
        });
        expect(activities).toHaveLength(expectedActivities.length);
        const sortedActivities = activities.map(({ id }) => id).sort();
        const sortedExpectedActivities = expectedActivities
          .map(({ id }) => id)
          .sort();
        expect(sortedActivities).toEqual(sortedExpectedActivities);
      });
    },
  );
});
