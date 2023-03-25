import { TimespansGenerator } from './timespansGenerator';

describe('Timespans Generator', () => {
  describe('when time window is not sliced', () => {
    it('should return a single timespan', () => {
      const timespans = TimespansGenerator.generateTimespans({
        id: 1,
        start: new Date('2023-05-13 10:00'),
        end: new Date('2023-05-13 12:30'),
        sliceTime: null,
      });
      expect(timespans).toEqual([
        {
          timeWindowId: 1,
          start: new Date('2023-05-13 10:00'),
          end: new Date('2023-05-13 12:30'),
          assignments: null,
        },
      ]);
    });
  });
  describe('when time window is sliced', () => {
    describe('when time window duration is not dividable by slice time', () => {
      it('should inform that the time window duration is not dividable by the slice time', () => {
        expect(() => {
          TimespansGenerator.generateTimespans({
            id: 1,
            start: new Date('2023-05-13 10:00'),
            end: new Date('2023-05-13 12:01'),
            sliceTime: 30,
          });
        }).toThrow('Time window duration is not dividable by the slice time');
      });
    });
    describe('when time window duration is the slice time', () => {
      it('should return a single timespan', () => {
        const timespans = TimespansGenerator.generateTimespans({
          id: 1,
          start: new Date('2023-05-13 10:00'),
          end: new Date('2023-05-13 11:00'),
          sliceTime: 1,
        });
        expect(timespans).toEqual([
          {
            timeWindowId: 1,
            start: new Date('2023-05-13 10:00'),
            end: new Date('2023-05-13 11:00'),
            assignments: null,
          },
        ]);
      });
    });
    describe('when time window duration is dividable by the slice time', () => {
      describe('when time duration is 3h and slice time is 1h', () => {
        it('should return 3 timespans', () => {
          const timespans = TimespansGenerator.generateTimespans({
            id: 1,
            start: new Date('2023-05-13 10:00'),
            end: new Date('2023-05-13 13:00'),
            sliceTime: 1,
          });
          expect(timespans).toHaveLength(3);
          expect(timespans).toEqual([
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 10:00'),
              end: new Date('2023-05-13 11:00'),
              assignments: null,
            },
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 11:00'),
              end: new Date('2023-05-13 12:00'),
              assignments: null,
            },
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 12:00'),
              end: new Date('2023-05-13 13:00'),
              assignments: null,
            },
          ]);
        });
      });
      describe('when time duration is 3h and slice time is 1.5h', () => {
        it('should return 2 timespans', () => {
          const timespans = TimespansGenerator.generateTimespans({
            id: 1,
            start: new Date('2023-05-13 10:00'),
            end: new Date('2023-05-13 13:00'),
            sliceTime: 1.5,
          });
          expect(timespans).toHaveLength(2);
          expect(timespans).toEqual([
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 10:00'),
              end: new Date('2023-05-13 11:30'),
              assignments: null,
            },
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 11:30'),
              end: new Date('2023-05-13 13:00'),
              assignments: null,
            },
          ]);
        });
      });
      describe('when time duration is 3h and slice time is 1.5h and there is 2 userRequests', () => {
        it('should return 2 timespans', () => {
          const timespans = TimespansGenerator.generateTimespans({
            id: 1,
            start: new Date('2023-05-13 10:00'),
            end: new Date('2023-05-13 13:00'),
            sliceTime: 1.5,
            userRequests: [
              {
                id: 11,
                ftTimeWindowsId: 1,
                user: {
                  id: 1,
                  firstname: 'John',
                  lastname: 'Doe',
                },
              },
              {
                id: 15,
                ftTimeWindowsId: 2,
                user: {
                  id: 2,
                  firstname: 'Jane',
                  lastname: 'Doe',
                },
              },
            ],
          });
          expect(timespans).toHaveLength(2);
          expect(timespans).toEqual([
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 10:00'),
              end: new Date('2023-05-13 11:30'),
              assignments: {
                create: [
                  {
                    userRequestId: 11,
                    assigneeId: 1,
                  },
                  {
                    userRequestId: 15,
                    assigneeId: 2,
                  },
                ],
              },
            },
            {
              timeWindowId: 1,
              start: new Date('2023-05-13 11:30'),
              end: new Date('2023-05-13 13:00'),
              assignments: {
                create: [
                  {
                    userRequestId: 11,
                    assigneeId: 1,
                  },
                  {
                    userRequestId: 15,
                    assigneeId: 2,
                  },
                ],
              },
            },
          ]);
        });
      });
    });
  });
});
