import { TimeSpansGenerator } from "./time-spans-generator";

describe("Time spans Generator", () => {
  describe("when time window is not sliced", () => {
    it("should return a single time span", () => {
      const timeSpans = TimeSpansGenerator.generateTimeSpans({
        id: 1,
        start: new Date("2023-05-13 10:00"),
        end: new Date("2023-05-13 12:30"),
        sliceTime: null,
        userRequests: [],
      });
      expect(timeSpans).toEqual([
        {
          timeWindowId: 1,
          start: new Date("2023-05-13 10:00"),
          end: new Date("2023-05-13 12:30"),
          assignments: [],
        },
      ]);
    });
  });
  describe("when time window is sliced", () => {
    describe("when time window duration is not dividable by slice time", () => {
      it("should inform that the time window duration is not dividable by the slice time", () => {
        expect(() => {
          TimeSpansGenerator.generateTimeSpans({
            id: 1,
            start: new Date("2023-05-13 10:00"),
            end: new Date("2023-05-13 12:01"),
            sliceTime: 30,
            userRequests: [],
          });
        }).toThrow("Time window duration is not dividable by the slice time");
      });
    });
    describe("when time window duration is the slice time", () => {
      it("should return a single time span", () => {
        const timeSpans = TimeSpansGenerator.generateTimeSpans({
          id: 1,
          start: new Date("2023-05-13 10:00"),
          end: new Date("2023-05-13 11:00"),
          sliceTime: 1,
          userRequests: [],
        });
        expect(timeSpans).toEqual([
          {
            timeWindowId: 1,
            start: new Date("2023-05-13 10:00"),
            end: new Date("2023-05-13 11:00"),
            assignments: [],
          },
        ]);
      });
    });
    describe("when time window duration is dividable by the slice time", () => {
      describe("when time duration is 3h and slice time is 1h", () => {
        it("should return 3 time spans", () => {
          const timeSpans = TimeSpansGenerator.generateTimeSpans({
            id: 1,
            start: new Date("2023-05-13 10:00"),
            end: new Date("2023-05-13 13:00"),
            sliceTime: 1,
            userRequests: [],
          });
          expect(timeSpans).toHaveLength(3);
          expect(timeSpans).toEqual([
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 10:00"),
              end: new Date("2023-05-13 11:00"),
              assignments: [],
            },
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 11:00"),
              end: new Date("2023-05-13 12:00"),
              assignments: [],
            },
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 12:00"),
              end: new Date("2023-05-13 13:00"),
              assignments: [],
            },
          ]);
        });
      });
      describe("when time duration is 3h and slice time is 1.5h", () => {
        it("should return 2 time spans", () => {
          const timeSpans = TimeSpansGenerator.generateTimeSpans({
            id: 1,
            start: new Date("2023-05-13 10:00"),
            end: new Date("2023-05-13 13:00"),
            sliceTime: 1.5,
            userRequests: [],
          });
          expect(timeSpans).toHaveLength(2);
          expect(timeSpans).toEqual([
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 10:00"),
              end: new Date("2023-05-13 11:30"),
              assignments: [],
            },
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 11:30"),
              end: new Date("2023-05-13 13:00"),
              assignments: [],
            },
          ]);
        });
      });
      describe("when time duration is 3h and slice time is 1.5h and there is 2 userRequests", () => {
        it("should return 2 time spans with 2 nested assignments", () => {
          const timeSpans = TimeSpansGenerator.generateTimeSpans({
            id: 1,
            start: new Date("2023-05-13 10:00"),
            end: new Date("2023-05-13 13:00"),
            sliceTime: 1.5,
            userRequests: [
              {
                id: 11,
                ftTimeWindowsId: 1,
                user: {
                  id: 1,
                  firstname: "John",
                  lastname: "Doe",
                },
              },
              {
                id: 15,
                ftTimeWindowsId: 2,
                user: {
                  id: 2,
                  firstname: "Jane",
                  lastname: "Doe",
                },
              },
            ],
          });
          expect(timeSpans).toHaveLength(2);
          expect(timeSpans).toEqual([
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 10:00"),
              end: new Date("2023-05-13 11:30"),
              assignments: [
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
            {
              timeWindowId: 1,
              start: new Date("2023-05-13 11:30"),
              end: new Date("2023-05-13 13:00"),
              assignments: [
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
          ]);
        });
      });
    });
  });
});
