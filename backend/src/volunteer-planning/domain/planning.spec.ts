import { Planning } from './planning';
import { JsonStoredTask } from './storedTask';
import { InMemoryTaskRepository } from './task.repository.inmemory';

const julien = { id: 1 };
const vincent = { id: 2 };
const antoine = { id: 3 };
const valerie = { id: 4 };
const lina = { id: 5 };
const elodie = { id: 6 };

const barrierageAvenueDesArts = {
  name: 'Barierrage Avenue des Arts',
  description: 'Bonsoir, il faut porter des barrieres',
  id: 1,
  location: 'Avenue des Arts',
};

const deplacerLeFen = {
  name: 'Deplacer le FEN',
  description: 'Bonsoir, il faut deplacer le FEN vers les barrieres',
  id: 2,
  location: 'Avenue des Arts',
};

const shift12hTo14hMay12 = {
  start: new Date('2023-05-12 12:00'),
  end: new Date('2023-05-12 14:00'),
};
const shift20hTo22hMay12 = {
  start: new Date('2023-05-12 20:00'),
  end: new Date('2023-05-12 22:00'),
};
const shift22hTo00hMay12 = {
  start: new Date('2023-05-12 22:00'),
  end: new Date('2023-05-13 00:00'),
};

const barrierageAvenueDesArtsOn20hTo22hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift20hTo22hMay12,
  assignees: [vincent, antoine, lina],
};

const barrierageAvenueDesArtsOn22hTo00hMay12: JsonStoredTask = {
  ...barrierageAvenueDesArts,
  period: shift22hTo00hMay12,
  assignees: [antoine, valerie, lina],
};

const deplacerLeFenOn12hTo14hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift12hTo14hMay12,
  assignees: [lina, elodie],
};

const deplacerLeFenOn20hTo22hMay12: JsonStoredTask = {
  ...deplacerLeFen,
  period: shift20hTo22hMay12,
  assignees: [valerie, elodie],
};

describe('Planning', () => {
  const taskRepository = new InMemoryTaskRepository([
    barrierageAvenueDesArtsOn20hTo22hMay12,
    barrierageAvenueDesArtsOn22hTo00hMay12,
    deplacerLeFenOn12hTo14hMay12,
    deplacerLeFenOn20hTo22hMay12,
  ]);
  const planning = new Planning(taskRepository);
  describe('retrieve volunteer tasks', () => {
    describe('when volunteer is not assigned to any task', () => {
      it('should retrieve an empty tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(julien.id);
        expect(tasks).toEqual([]);
      });
    });
    describe("when volunteer is assigned to 'Barierrage Avenue des Arts' from 2023-05-12 20:00 to 2023-05-12 22:00", () => {
      it("should retrieve 'Barierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.getVolunteerTasks(vincent.id);
        const { assignees, id, ...barrierageAvenueDesArtShift } =
          barrierageAvenueDesArtsOn20hTo22hMay12;
        expect(tasks).toEqual([barrierageAvenueDesArtShift]);
      });
    });
    describe("when volunteer is assigned to both 'Barierrage Avenue des Arts' from 2023-05-12 20:00 to 2023-05-12 22:00 and from 2023-05-12 22:00 to 2023-05-13 00:00", () => {
      it("should retrieve 'Barierrage Avenue des Arts' in tasks list", async () => {
        const tasks = await planning.getVolunteerTasks(antoine.id);
        const { assignees, id, ...barrierageAvenueDesArtShift } =
          barrierageAvenueDesArtsOn20hTo22hMay12;
        const globalBarrierageAvenueDesArtShift = {
          ...barrierageAvenueDesArtShift,
          period: {
            start: shift20hTo22hMay12.start,
            end: shift22hTo00hMay12.end,
          },
        };
        expect(tasks).toEqual([globalBarrierageAvenueDesArtShift]);
      });
    });
    describe('when volunteer is assigned to different tasks from 2023-05-12 20:00 to 2023-05-12 22:00 and from 2023-05-12 22:00 to 2023-05-13 00:00', () => {
      it('should retrieve both in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(valerie.id);
        const expectedShifts = [
          deplacerLeFenOn20hTo22hMay12,
          barrierageAvenueDesArtsOn22hTo00hMay12,
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toEqual(expectedShifts);
      });
    });
    describe('when volunteer is assigned to various tasks, including some similar', () => {
      it('should retrieve grouped tasks for similar tasks only in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(lina.id);
        const expectedShifts = [
          deplacerLeFenOn12hTo14hMay12,
          {
            ...barrierageAvenueDesArtsOn20hTo22hMay12,
            period: {
              start: shift20hTo22hMay12.start,
              end: shift22hTo00hMay12.end,
            },
          },
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toEqual(expectedShifts);
      });
    });
    describe('when volunteer is assigned to same task with a break beetween shifts', () => {
      it('should retrieve separated tasks in tasks list', async () => {
        const tasks = await planning.getVolunteerTasks(elodie.id);
        const expectedShifts = [
          deplacerLeFenOn12hTo14hMay12,
          deplacerLeFenOn20hTo22hMay12,
        ].map(({ assignees, id, ...task }) => task);
        expect(tasks).toEqual(expectedShifts);
      });
    });
  });
});
