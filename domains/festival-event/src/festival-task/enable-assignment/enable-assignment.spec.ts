import { beforeEach, describe, expect, it } from "vitest";
import {
  barCashier,
  cleanPressConference,
  findTruck,
  flashMobOnJustDance,
  gabIsAssignedTo,
  guardPS1,
  guardPS2,
  installEscapeGame,
  leadPressConference,
  preparePressConference,
  uninstallPreventionVillage,
} from "../festival-task.fake.js";
import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";
import { ASSIGNMENT_STARTED } from "../../common/action.js";
import {
  friday18hfriday20h,
  friday20hfriday22h,
  friday22hsaturday00h,
  gab,
  monday00h,
  noel,
  saturday00hsaturday02h,
  saturday02hsaturday04h,
  saturday04hsaturday06h,
  saturday06hsaturday08h,
  saturday08h,
  saturday08hsaturday10h,
  saturday10hsaturday12h,
  saturday12hsaturday14h,
  saturday14hsaturday16h,
  saturday16hsaturday18h,
  saturday18hsaturday20h,
  saturday20hsaturday22h,
  saturday22hsunday00h,
  sunday00hsunday02h,
  sunday02hsunday04h,
  sunday04hsunday06h,
  sunday06hsunday08h,
  sunday08hsunday10h,
  sunday10hsunday12h,
  sunday11hsunday12h,
  sunday12hsunday14h,
  sunday14hsunday16h,
  sunday16hsunday18h,
  sunday18hsunday20h,
  sunday20hsunday22h,
  sunday22hmonday00h,
  valery,
} from "../festival-task.test-util.js";
import { EnableAssignment } from "./enable-assignment.js";
import { InMemoryFestivalTasksForEnableAssignment } from "./festival-tasks-for-enable-assignment.inmemory.js";
import {
  FestivalTaskNotFound,
  FestivalTaskNotValidated,
  ReadyToAssignError,
} from "../festival-task.error.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";

const expectedGuardPsAssignments = [
  { ...friday18hfriday20h, assignees: [] },
  { ...friday20hfriday22h, assignees: [] },
  { ...friday22hsaturday00h, assignees: [] },
  { ...saturday00hsaturday02h, assignees: [] },
  { ...saturday02hsaturday04h, assignees: [] },
  { ...saturday04hsaturday06h, assignees: [] },
  { ...saturday06hsaturday08h, assignees: [] },
  { ...saturday08hsaturday10h, assignees: [] },
  { ...saturday10hsaturday12h, assignees: [] },
  { ...saturday12hsaturday14h, assignees: [] },
  { ...saturday14hsaturday16h, assignees: [] },
  { ...saturday16hsaturday18h, assignees: [] },
  { ...saturday18hsaturday20h, assignees: [] },
  { ...saturday20hsaturday22h, assignees: [] },
  { ...saturday22hsunday00h, assignees: [] },
  { ...sunday00hsunday02h, assignees: [] },
  { ...sunday02hsunday04h, assignees: [] },
  { ...sunday04hsunday06h, assignees: [] },
  { ...sunday06hsunday08h, assignees: [] },
  { ...sunday08hsunday10h, assignees: [] },
  { ...sunday10hsunday12h, assignees: [] },
  { ...sunday12hsunday14h, assignees: [] },
  { ...sunday14hsunday16h, assignees: [] },
  { ...sunday16hsunday18h, assignees: [] },
  { ...sunday18hsunday20h, assignees: [] },
  { ...sunday20hsunday22h, assignees: [] },
  { ...sunday22hmonday00h, assignees: [] },
];

const expectedBarCashierAssignmentsFridayNigth = [
  { ...friday18hfriday20h, assignees: [] },
  { ...friday20hfriday22h, assignees: [] },
  { ...friday22hsaturday00h, assignees: [] },
  { ...saturday00hsaturday02h, assignees: [] },
  { ...saturday02hsaturday04h, assignees: [] },
];

const expectedBarCashierAssignmentsSaturdayNigth = [
  { ...saturday18hsaturday20h, assignees: [] },
  { ...saturday20hsaturday22h, assignees: [] },
  { ...saturday22hsunday00h, assignees: [] },
  { ...sunday00hsunday02h, assignees: [] },
  { ...sunday02hsunday04h, assignees: [] },
];

const expectedPreparePressConferenceAssignments = [
  { ...sunday11hsunday12h, assignees: [valery] },
];

const expectedCleanPressConferenceAssignments = [
  { ...sunday14hsunday16h, assignees: [valery] },
  { ...sunday16hsunday18h, assignees: [valery] },
];

describe("Enable assignment", () => {
  let festivalTasks: InMemoryFestivalTasksForEnableAssignment;
  let enableAssignment: EnableAssignment;
  beforeEach(() => {
    const tasks = [
      guardPS1,
      guardPS2,
      barCashier,
      installEscapeGame,
      flashMobOnJustDance,
      uninstallPreventionVillage,
      leadPressConference,
      preparePressConference,
      cleanPressConference,
      gabIsAssignedTo,
      findTruck,
    ];
    festivalTasks = new InMemoryFestivalTasksForEnableAssignment(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, [
      {
        volunteer: valery,
        availabilities: [
          sunday11hsunday12h,
          { start: sunday14hsunday16h.start, end: sunday16hsunday18h.end },
        ],
      },
      {
        volunteer: gab,
        availabilities: [{ start: saturday08h.date, end: monday00h.date }],
      },
    ]);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    enableAssignment = new EnableAssignment(festivalTasks, translator);
  });
  describe.each`
    task                      | instigator | categorize                                      | expectedMobilizations
    ${guardPS1}               | ${noel}    | ${{ category: STATIQUE, topPriority: true }}    | ${[{ ...guardPS1.mobilizations.at(0), assignments: expectedGuardPsAssignments }]}
    ${guardPS2}               | ${noel}    | ${{ category: STATIQUE, topPriority: true }}    | ${[{ ...guardPS2.mobilizations.at(0), assignments: expectedGuardPsAssignments }]}
    ${barCashier}             | ${noel}    | ${{ category: RELOU, topPriority: true }}       | ${[{ ...barCashier.mobilizations.at(0), assignments: expectedBarCashierAssignmentsFridayNigth }, { ...barCashier.mobilizations.at(1), assignments: expectedBarCashierAssignmentsSaturdayNigth }]}
    ${barCashier}             | ${noel}    | ${{ category: BAR, topPriority: false }}        | ${[{ ...barCashier.mobilizations.at(0), assignments: expectedBarCashierAssignmentsFridayNigth }, { ...barCashier.mobilizations.at(1), assignments: expectedBarCashierAssignmentsSaturdayNigth }]}
    ${barCashier}             | ${noel}    | ${{ category: MANUTENTION, topPriority: true }} | ${[{ ...barCashier.mobilizations.at(0), assignments: expectedBarCashierAssignmentsFridayNigth }, { ...barCashier.mobilizations.at(1), assignments: expectedBarCashierAssignmentsSaturdayNigth }]}
    ${barCashier}             | ${noel}    | ${{ category: FUN, topPriority: false }}        | ${[{ ...barCashier.mobilizations.at(0), assignments: expectedBarCashierAssignmentsFridayNigth }, { ...barCashier.mobilizations.at(1), assignments: expectedBarCashierAssignmentsSaturdayNigth }]}
    ${barCashier}             | ${noel}    | ${{ topPriority: true }}                        | ${[{ ...barCashier.mobilizations.at(0), assignments: expectedBarCashierAssignmentsFridayNigth }, { ...barCashier.mobilizations.at(1), assignments: expectedBarCashierAssignmentsSaturdayNigth }]}
    ${preparePressConference} | ${noel}    | ${{ topPriority: true }}                        | ${[{ ...preparePressConference.mobilizations.at(0), assignments: expectedPreparePressConferenceAssignments }]}
    ${cleanPressConference}   | ${noel}    | ${{ topPriority: true }}                        | ${[{ ...cleanPressConference.mobilizations.at(0), assignments: expectedCleanPressConferenceAssignments }]}
  `(
    "when enabling assignment for validated festival task",
    ({ task, instigator, categorize, expectedMobilizations }) => {
      it(`should switch status to ${READY_TO_ASSIGN}`, async () => {
        const { status } = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(status).toBe(READY_TO_ASSIGN);
      });
      it("should keep festival task sections", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.general).toEqual(task.general);
        expect(readyToAssign.festivalActivity).toEqual(task.festivalActivity);
        expect(readyToAssign.instructions).toEqual(task.instructions);
        expect(readyToAssign.inquiries).toEqual(task.inquiries);
      });
      it("should generate assignments on each mobilization", async () => {
        const { mobilizations } = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(mobilizations).toEqual(expectedMobilizations);
      });
      it(`should add ${ASSIGNMENT_STARTED} key event to history`, async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.history).toStrictEqual([
          ...task.history,
          {
            action: ASSIGNMENT_STARTED,
            by: instigator,
            at: expect.any(Date),
            description: "Affectation activée pour la FT",
          },
        ]);
      });
      it("should add task category and priority", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(readyToAssign.topPriority).toBe(categorize.topPriority);
        expect(readyToAssign.category).toBe(categorize.category);
      });
      it("should be stored in task repository", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(festivalTasks.entries).toContainEqual(readyToAssign);
      });
    },
  );
  describe("when trying to enable assignment on unknown festival task", () => {
    it("should indicate festival task is not found", async () => {
      expect(
        async () =>
          await enableAssignment.for(1000, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(FestivalTaskNotFound);
    });
  });
  describe.each`
    task                          | status
    ${installEscapeGame}          | ${installEscapeGame.status}
    ${flashMobOnJustDance}        | ${flashMobOnJustDance.status}
    ${uninstallPreventionVillage} | ${uninstallPreventionVillage.status}
  `("when trying to enable assignment on $status festival task", ({ task }) => {
    it("should indicate festival task is not found", async () => {
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(FestivalTaskNotValidated);
    });
  });
  describe("when trying to enable assignment on festival task with at least on required volunteer that is not available", () => {
    it("should indicate that all required volunteers as to be available during mobilizations", async () => {
      const task = leadPressConference;
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(ReadyToAssignError);
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow("Au moins un des bénévoles n'est pas disponible.");
    });
  });
  describe("when trying to enable assignment on festival task with at least on required volunteer that is assigned on another task", () => {
    it("should indicate that all required volunteers as to be available during mobilizations", async () => {
      const task = findTruck;
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(ReadyToAssignError);
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow("Au moins un des bénévoles n'est pas disponible.");
    });
  });
});
