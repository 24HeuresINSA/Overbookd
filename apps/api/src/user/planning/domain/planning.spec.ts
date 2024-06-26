import { Planning } from "./planning";
import { JsonStoredTask } from "./storedTask";
import { InMemoryTaskRepository } from "./task.repository.inmemory";

const julien = { id: 1, name: "julien" };
const vincent = { id: 2, name: "vincent" };
const antonin = { id: 3, name: "antonin" };
const antoninContact = { id: 3, name: "antonin", phone: "06010203003" };
const valerie = { id: 4, name: "valerie" };
const lina = { id: 5, name: "lina" };
const elodie = { id: 6, name: "elodie" };
const elodieContact = { id: 6, name: "elodie", phone: "0601020306" };
const loic = { id: 7, name: "loic" };
const tristan = { id: 8, name: "tristan" };
const constantin = { id: 9, name: "constantin" };
const michel = { id: 10, name: "michel" };
const ana = { id: 11, name: "ana" };
const anaContact = { id: 11, name: "ana", phone: "0601020311" };
const ambre = { id: 12, name: "ambre" };
const antoine = { id: 13, name: "antoine" };
const brenda = { id: 14, name: "brenda" };

const debarrierageAvenueDesArts = {
  name: "Debarierrage Avenue des Arts",
  instructions: "Bonsoir, il faut enlever des barrieres",
  id: 1,
  location: { name: "Avenue des Arts", geoLocation: null },
};

const deplacerLeFen = {
  name: "Deplacer le FEN",
  instructions: "Bonsoir, il faut deplacer le FEN vers les barrieres",
  id: 2,
  location: { name: "Avenue des Arts", geoLocation: null },
};

const barrierageAvenueDesArts = {
  name: "Barierrage Avenue des Arts",
  instructions: "Bonsoir, il faut porter des barrieres",
  id: 3,
  location: { name: "Avenue des Arts", geoLocation: null },
};

const ambiancerLeQG = {
  name: "Ambiancer le QG",
  instructions: "Mettre la grosse ambiance au QG",
  id: 4,
  location: { name: "QG Orga", geoLocation: null },
};

const shift12hTo14hMay12 = {
  start: new Date("2023-05-12 12:00"),
  end: new Date("2023-05-12 14:00"),
};
const shift18hTo20hMay12 = {
  start: new Date("2023-05-12 18:00"),
  end: new Date("2023-05-12 20:00"),
};
const shift20hTo22hMay12 = {
  start: new Date("2023-05-12 20:00"),
  end: new Date("2023-05-12 22:00"),
};
const shift22hTo00hMay12 = {
  start: new Date("2023-05-12 22:00"),
  end: new Date("2023-05-13 00:00"),
};
const shift23hTo01hMay12 = {
  start: new Date("2023-05-12 23:00"),
  end: new Date("2023-05-13 01:00"),
};
const shift00hTo02hMay13 = {
  start: new Date("2023-05-13 00:00"),
  end: new Date("2023-05-13 02:00"),
};
const shift02hTo03hMay13 = {
  start: new Date("2023-05-13 02:00"),
  end: new Date("2023-05-13 03:00"),
};

const shift12hTo14hMay15 = {
  start: new Date("2023-05-15 12:00"),
  end: new Date("2023-05-15 14:00"),
};
const shift14hTo16hMay15 = {
  start: new Date("2023-05-15 14:00"),
  end: new Date("2023-05-15 16:00"),
};

const debarrierageAvenueDesArtsOn12hTo14hMay15: JsonStoredTask = {
  ...debarrierageAvenueDesArts,
  period: shift12hTo14hMay15,
  assignees: [vincent, antonin, lina].map((volunteer) => ({
    ...volunteer,
    period: shift12hTo14hMay15,
  })),
  contacts: [antoninContact],
};

const debarrierageAvenueDesArtsOn14hTo16hMay15: JsonStoredTask = {
  ...debarrierageAvenueDesArts,
  period: shift14hTo16hMay15,
  assignees: [antonin, valerie, lina].map((volunteer) => ({
    ...volunteer,
    period: shift14hTo16hMay15,
  })),
  contacts: [antoninContact],
};

const deplacerLeFenOn12hTo14hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift12hTo14hMay12,
  assignees: [lina, elodie].map((volunteer) => ({
    ...volunteer,
    period: shift12hTo14hMay12,
  })),
  contacts: [elodieContact],
};

const deplacerLeFenOn20hTo22hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift20hTo22hMay12,
  assignees: [valerie, elodie].map((volunteer) => ({
    ...volunteer,
    period: shift20hTo22hMay12,
  })),
  contacts: [elodieContact],
};

const barrierageAvenueDesArtsOn18hTo02hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: {
    start: shift18hTo20hMay12.start,
    end: shift00hTo02hMay13.end,
  },
  assignees: [loic, tristan].map((volunteer) => ({
    ...volunteer,
    period: {
      start: shift18hTo20hMay12.start,
      end: shift00hTo02hMay13.end,
    },
  })),
  contacts: [],
};

const barrierageAvenueDesArtsOn20hTo03hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: {
    start: shift20hTo22hMay12.start,
    end: shift02hTo03hMay13.end,
  },
  assignees: [constantin].map((volunteer) => ({
    ...volunteer,
    period: {
      start: shift20hTo22hMay12.start,
      end: shift02hTo03hMay13.end,
    },
  })),
  contacts: [],
};

const barrierageAvenueDesArtsOn18hTo20hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift18hTo20hMay12,
  assignees: [ana, ambre].map((volunteer) => ({
    ...volunteer,
    period: shift18hTo20hMay12,
  })),
  contacts: [anaContact],
};

const barrierageAvenueDesArtsOn20hTo22hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift20hTo22hMay12,
  assignees: [ana, ambre].map((volunteer) => ({
    ...volunteer,
    period: shift20hTo22hMay12,
  })),
  contacts: [anaContact],
};

const barrierageAvenueDesArtsOn22hTo00hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift22hTo00hMay12,
  assignees: [michel].map((volunteer) => ({
    ...volunteer,
    period: shift22hTo00hMay12,
  })),
  contacts: [],
};

const barrierageAvenueDesArtsOn23hTo01hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift23hTo01hMay12,
  assignees: [antoine].map((volunteer) => ({
    ...volunteer,
    period: shift23hTo01hMay12,
  })),
  contacts: [],
};

const barrierageAvenueDesArtsOn00hTo02hMay13: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift00hTo02hMay13,
  assignees: [michel].map((volunteer) => ({
    ...volunteer,
    period: shift00hTo02hMay13,
  })),
  contacts: [],
};

const barrierageAvenueDesArtsOn02hTo03hMay13: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift02hTo03hMay13,
  assignees: [loic, tristan].map((volunteer) => ({
    ...volunteer,
    period: shift02hTo03hMay13,
  })),
  contacts: [],
};

const ambiancerLeQGOn00hTo02hMay13: JsonStoredTask = {
  ...ambiancerLeQG,
  period: shift00hTo02hMay13,
  assignees: [brenda].map((volunteer) => ({
    ...volunteer,
    period: shift00hTo02hMay13,
  })),
  contacts: [],
};

describe("Planning", () => {
  const taskRepository = new InMemoryTaskRepository([
    debarrierageAvenueDesArtsOn12hTo14hMay15,
    debarrierageAvenueDesArtsOn14hTo16hMay15,
    deplacerLeFenOn12hTo14hMay12,
    deplacerLeFenOn20hTo22hMay12,
    barrierageAvenueDesArtsOn18hTo02hMay12,
    barrierageAvenueDesArtsOn20hTo03hMay12,
    barrierageAvenueDesArtsOn18hTo20hMay12,
    barrierageAvenueDesArtsOn20hTo22hMay12,
    barrierageAvenueDesArtsOn22hTo00hMay12,
    barrierageAvenueDesArtsOn23hTo01hMay12,
    barrierageAvenueDesArtsOn00hTo02hMay13,
    barrierageAvenueDesArtsOn02hTo03hMay13,
    ambiancerLeQGOn00hTo02hMay13,
  ]);
  const planning = new Planning(taskRepository);
  describe("retrieve volunteer tasks", () => {
    describe("when volunteer is not assigned to any task", () => {
      it("should retrieve an empty tasks list", async () => {
        const tasks = await planning.generateForVolunteer(julien.id);
        expect(tasks).toEqual([]);
      });
    });
    describe("when volunteer is assigned to 'Debarierrage Avenue des Arts' from 2023-05-15 12:00 to 2023-05-15 14:00", () => {
      it("should retrieve 'Debarierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.generateForVolunteer(vincent.id);
        const { assignees, id, ...barrierageAvenueDesArtShift } =
          debarrierageAvenueDesArtsOn12hTo14hMay15;
        expect(tasks).toMatchObject([barrierageAvenueDesArtShift]);
      });
    });
    describe("when volunteer is assigned to both 'Debarierrage Avenue des Arts' from 2023-05-15 12:00 to 2023-05-15 14:00 and from 2023-05-15 14:00 to 2023-05-15 16:00 and is contact", () => {
      it("should retrieve 'Debarierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.generateForVolunteer(antonin.id);
        const { assignees, id, ...debarrierageAvenueDesArtShift } =
          debarrierageAvenueDesArtsOn12hTo14hMay15;
        const globalDebarrierageAvenueDesArtShift = {
          ...debarrierageAvenueDesArtShift,
          contacts: [],
          period: {
            start: shift12hTo14hMay15.start,
            end: shift14hTo16hMay15.end,
          },
        };
        expect(tasks).toMatchObject([globalDebarrierageAvenueDesArtShift]);
      });
    });
    describe("when volunteer is assigned to different tasks from 2023-05-12 20:00 to 2023-05-12 22:00 and from 2023-05-12 22:00 to 2023-05-13 00:00", () => {
      it("should retrieve both in tasks list", async () => {
        const tasks = await planning.generateForVolunteer(valerie.id);
        const expectedShifts = [
          deplacerLeFenOn20hTo22hMay12,
          debarrierageAvenueDesArtsOn14hTo16hMay15,
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toMatchObject(expectedShifts);
      });
    });
    describe("when volunteer is assigned to various tasks, including some similar", () => {
      it("should retrieve grouped tasks for similar tasks only in tasks list", async () => {
        const tasks = await planning.generateForVolunteer(lina.id);
        const expectedShifts = [
          deplacerLeFenOn12hTo14hMay12,
          {
            ...debarrierageAvenueDesArtsOn12hTo14hMay15,
            period: {
              start: shift12hTo14hMay15.start,
              end: shift14hTo16hMay15.end,
            },
          },
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toMatchObject(expectedShifts);
      });
    });
    describe("when volunteer is assigned to same task with a break beetween shifts", () => {
      it("should retrieve separated tasks in tasks list", async () => {
        const tasks = await planning.generateForVolunteer(elodie.id);
        const expectedShifts = [
          { ...deplacerLeFenOn12hTo14hMay12, contacts: [] },
          { ...deplacerLeFenOn20hTo22hMay12, contacts: [] },
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toMatchObject(expectedShifts);
      });
    });
    describe("volunteer also assigned during task", () => {
      describe(`Given task barrierage avenue des arts with:
      - 18h00-02h00: Loic and Tristan + 20 volunteers on 2 hours time spans => with Ana and Ambre from 18h00 to 22h00 and Michel from 22h00 to 02h00
      - 02h00-03h00: Loic and Tristan
      - 20h00-03h00: Constantin
      - 23h00-01h00: Antoine
      `, () => {
        describe("When generating planning for volunteer assigned from 18h00 to 22h00", () => {
          it(`should find other volunteers as:
          - 18h00-20h00
            - Loic
            - Tristan
            - Ambre
          - 20h00-22h00
            - Loic
            - Tristan
            - Constantin
            - Ambre
          `, async () => {
            const tasks = await planning.generateForVolunteer(ana.id);
            expect(tasks.at(0)?.assignments).toHaveLength(2);
            expect(tasks.at(0)?.assignments).toEqual([
              {
                period: shift18hTo20hMay12,
                volunteers: [ambre, loic, tristan],
              },
              {
                period: shift20hTo22hMay12,
                volunteers: [loic, tristan, ambre, constantin],
              },
            ]);
          });
        });
        describe("When generating planning for Loic", () => {
          it(`should find other volunteers as:
          - 18h00-20h00
            - Tristan
            - Ambre
            - Ana
          - 20h00-22h00
            - Tristan
            - Constantin
            - Ambre
            - Ana
          - 22h00-23h00
            - Tristan
            - Constantin
            - Michel
          - 23h00-00h00
            - Tristan
            - Constantin
            - Antoine
            - Michel
          - 00h00-01h00
            - Tristan
            - Constantin
            - Antoine
            - Michel
          - 01h00-02h00
            - Tristan
            - Constantin
            - Michel
          - 02h00-03h00
            - Tristan
            - Constantin
          `, async () => {
            const tasks = await planning.generateForVolunteer(loic.id);
            expect(tasks.at(0)?.assignments).toHaveLength(7);
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: shift18hTo20hMay12,
              volunteers: [tristan, ana, ambre],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: shift20hTo22hMay12,
              volunteers: [tristan, constantin, ana, ambre],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift22hTo00hMay12.start,
                end: shift23hTo01hMay12.start,
              },
              volunteers: [tristan, constantin, michel],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift23hTo01hMay12.start,
                end: shift22hTo00hMay12.end,
              },
              volunteers: [tristan, constantin, michel, antoine],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift22hTo00hMay12.end,
                end: shift23hTo01hMay12.end,
              },
              volunteers: [tristan, constantin, antoine, michel],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift23hTo01hMay12.end,
                end: shift00hTo02hMay13.end,
              },
              volunteers: [tristan, constantin, michel],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: shift02hTo03hMay13,
              volunteers: [constantin, tristan],
            });
          });
        });
        describe("When generating planning for Antoine", () => {
          it(`should find other volunteers as:
          - 23h00-00h00
            - Loic
            - Tristan
            - Constantin
            - Michel
          - 00h00-01h00
            - Loic
            - Tristan
            - Constantin
            - Michel
          `, async () => {
            const tasks = await planning.generateForVolunteer(antoine.id);
            expect(tasks.at(0)?.assignments).toHaveLength(2);
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift23hTo01hMay12.start,
                end: shift00hTo02hMay13.start,
              },
              volunteers: [loic, tristan, constantin, michel],
            });
            expect(tasks.at(0)?.assignments).toContainEqual({
              period: {
                start: shift00hTo02hMay13.start,
                end: shift23hTo01hMay12.end,
              },
              volunteers: [loic, tristan, constantin, michel],
            });
          });
        });
      });
      describe("when volunteer is alone on a period", () => {
        it("should not generate an assignment for this period", async () => {
          const tasks = await planning.generateForVolunteer(brenda.id);
          expect(tasks.at(0)?.assignments).toHaveLength(0);
        });
      });
    });
  });
});
