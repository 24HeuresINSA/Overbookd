import { Planning } from './planning';
import { JsonStoredTask } from './storedTask';
import { InMemoryTaskRepository } from './task.repository.inmemory';

const julien = { id: 1, name: 'julien' };
const vincent = { id: 2, name: 'vincent' };
const antonin = { id: 3, name: 'antonin' };
const valerie = { id: 4, name: 'valerie' };
const lina = { id: 5, name: 'lina' };
const elodie = { id: 6, name: 'elodie' };
const loic = { id: 7, name: 'loic' };
const tristan = { id: 8, name: 'tristan' };
const constantin = { id: 9, name: 'constantin' };
const michel = { id: 10, name: 'michel' };
const ana = { id: 11, name: 'ana' };
const ambre = { id: 12, name: 'ambre' };

const debarrierageAvenueDesArts = {
  name: 'Debarierrage Avenue des Arts',
  description: 'Bonsoir, il faut enlever des barrieres',
  id: 1,
  location: 'Avenue des Arts',
};

const deplacerLeFen = {
  name: 'Deplacer le FEN',
  description: 'Bonsoir, il faut deplacer le FEN vers les barrieres',
  id: 2,
  location: 'Avenue des Arts',
};

const barrierageAvenueDesArts = {
  name: 'Barierrage Avenue des Arts',
  description: 'Bonsoir, il faut porter des barrieres',
  id: 3,
  location: 'Avenue des Arts',
};

const shift12hTo14hMay12 = {
  start: new Date('2023-05-12 12:00'),
  end: new Date('2023-05-12 14:00'),
};
const shift18hTo20hMay12 = {
  start: new Date('2023-05-12 18:00'),
  end: new Date('2023-05-12 20:00'),
};
const shift20hTo22hMay12 = {
  start: new Date('2023-05-12 20:00'),
  end: new Date('2023-05-12 22:00'),
};
const shift22hTo00hMay12 = {
  start: new Date('2023-05-12 22:00'),
  end: new Date('2023-05-13 00:00'),
};
const shift00hTo02hMay13 = {
  start: new Date('2023-05-13 00:00'),
  end: new Date('2023-05-13 02:00'),
};
const shift02hTo03hMay13 = {
  start: new Date('2023-05-13 02:00'),
  end: new Date('2023-05-13 03:00'),
};

const shift12hTo14hMay15 = {
  start: new Date('2023-05-15 12:00'),
  end: new Date('2023-05-15 14:00'),
};
const shift14hTo16hMay15 = {
  start: new Date('2023-05-15 14:00'),
  end: new Date('2023-05-15 16:00'),
};

const debarrierageAvenueDesArtsOn12hTo14hMay15: JsonStoredTask = {
  ...debarrierageAvenueDesArts,
  period: shift12hTo14hMay15,
  assignees: [vincent, antonin, lina].map((volunteer) => ({
    ...volunteer,
    period: shift12hTo14hMay15,
  })),
};

const debarrierageAvenueDesArtsOn14hTo16hMay15: JsonStoredTask = {
  ...debarrierageAvenueDesArts,
  period: shift14hTo16hMay15,
  assignees: [antonin, valerie, lina].map((volunteer) => ({
    ...volunteer,
    period: shift14hTo16hMay15,
  })),
};

const deplacerLeFenOn12hTo14hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift12hTo14hMay12,
  assignees: [lina, elodie].map((volunteer) => ({
    ...volunteer,
    period: shift12hTo14hMay12,
  })),
};

const deplacerLeFenOn20hTo22hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift20hTo22hMay12,
  assignees: [valerie, elodie].map((volunteer) => ({
    ...volunteer,
    period: shift20hTo22hMay12,
  })),
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
};

const barrierageAvenueDesArtsOn18hTo20hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift18hTo20hMay12,
  assignees: [ana, ambre].map((volunteer) => ({
    ...volunteer,
    period: shift18hTo20hMay12,
  })),
};

const barrierageAvenueDesArtsOn20hTo22hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift20hTo22hMay12,
  assignees: [ana, ambre].map((volunteer) => ({
    ...volunteer,
    period: shift20hTo22hMay12,
  })),
};

describe('Planning', () => {
  const taskRepository = new InMemoryTaskRepository([
    debarrierageAvenueDesArtsOn12hTo14hMay15,
    debarrierageAvenueDesArtsOn14hTo16hMay15,
    deplacerLeFenOn12hTo14hMay12,
    deplacerLeFenOn20hTo22hMay12,
    barrierageAvenueDesArtsOn18hTo02hMay12,
    barrierageAvenueDesArtsOn20hTo03hMay12,
    barrierageAvenueDesArtsOn18hTo20hMay12,
    barrierageAvenueDesArtsOn20hTo22hMay12,
  ]);
  const planning = new Planning(taskRepository);
  describe('retrieve volunteer tasks', () => {
    describe('when volunteer is not assigned to any task', () => {
      it('should retrieve an empty tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(julien.id);
        expect(tasks).toEqual([]);
      });
    });
    describe("when volunteer is assigned to 'Debarierrage Avenue des Arts' from 2023-05-15 12:00 to 2023-05-15 14:00", () => {
      it("should retrieve 'Debarierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.getVolunteerTasks(vincent.id);
        const { assignees, id, ...barrierageAvenueDesArtShift } =
          debarrierageAvenueDesArtsOn12hTo14hMay15;
        expect(tasks).toMatchObject([barrierageAvenueDesArtShift]);
      });
    });
    describe("when volunteer is assigned to both 'Debarierrage Avenue des Arts' from 2023-05-15 12:00 to 2023-05-15 14:00 and from 2023-05-15 14:00 to 2023-05-15 16:00", () => {
      it("should retrieve 'Debarierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.getVolunteerTasks(antonin.id);
        const { assignees, id, ...debarrierageAvenueDesArtShift } =
          debarrierageAvenueDesArtsOn12hTo14hMay15;
        const globalDebarrierageAvenueDesArtShift = {
          ...debarrierageAvenueDesArtShift,
          period: {
            start: shift12hTo14hMay15.start,
            end: shift14hTo16hMay15.end,
          },
        };
        expect(tasks).toMatchObject([globalDebarrierageAvenueDesArtShift]);
      });
    });
    describe('when volunteer is assigned to different tasks from 2023-05-12 20:00 to 2023-05-12 22:00 and from 2023-05-12 22:00 to 2023-05-13 00:00', () => {
      it('should retrieve both in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(valerie.id);
        const expectedShifts = [
          deplacerLeFenOn20hTo22hMay12,
          debarrierageAvenueDesArtsOn14hTo16hMay15,
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toMatchObject(expectedShifts);
      });
    });
    describe('when volunteer is assigned to various tasks, including some similar', () => {
      it('should retrieve grouped tasks for similar tasks only in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(lina.id);
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
    describe('when volunteer is assigned to same task with a break beetween shifts', () => {
      it('should retrieve separated tasks in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(elodie.id);
        const expectedShifts = [
          deplacerLeFenOn12hTo14hMay12,
          deplacerLeFenOn20hTo22hMay12,
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toMatchObject(expectedShifts);
      });
    });
    describe('volunteer also assigned during task', () => {
      describe(`Given task barrierage avenue des arts with:
      - 18h00-02h00: Loic and Tristan + 20 volunteers on 2 hours timespans
      - 02h00-03h00: Loic and Tristan
      - 20h00-03h00: Constantin
      - 23h00-01h00: Antoine
      `, () => {
        describe('When generating planning for volunteer assigned from 18h00 to 22h00', () => {
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
            const tasks = await planning.getVolunteerTasks(ana.id);
            expect(tasks.at(0)?.assignments).toHaveLength(2);
            expect(tasks.at(0)?.assignments).toEqual([
              {
                period: shift18hTo20hMay12,
                volunteers: [ambre, loic, tristan],
              },
              {
                period: shift20hTo22hMay12,
                volunteers: [ambre, loic, tristan, constantin],
              },
            ]);
          });
        });
      });
    });
  });
});
