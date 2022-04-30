import { ITFRequired, ITimeFrame } from "@entities/FT";
import { ITimeSpan } from "@entities/TimeSpan";
import { ObjectId } from "mongodb";
import { timeframeToTimeSpan } from "./slicing";

describe("Services - slicing", () => {
  const startDate = new Date();
  const endDate = new Date();
  const threeHoursLaterDate = new Date();
  const FTID = 12;
  startDate.setMinutes(0,0,0);
  endDate.setMinutes(0,0,0);
  threeHoursLaterDate.setMinutes(0,0,0);
  endDate.setMonth(startDate.getMonth() + 1);
  threeHoursLaterDate.setHours(startDate.getHours() + 3)
  describe("when given timeframe is not meant to be sliced", () => {
    describe("when given timeframe required 4 team members", () => {
      const team = "test";
      const required: ITFRequired[] = [
        {
          _id: "test",
          type: "team",
          team,
          amount: 4,
        },
      ];
      const timeframe = {
        toSlice: false,
        start: +startDate,
        end: +endDate,
        required,
        _id: "indivisible time frame",
        name: "indivisible time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 4 timespans", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(4);
      });
      it("should generate all timespans with same start and end dates", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const expectedStart = startDate;
        const expectedEnd = endDate;
        expect(
          res.every(
            (ts) => +ts.start === +expectedStart && +ts.end === +expectedEnd
          )
        ).toBe(true);
      });
      it("should generate all timespans with required team", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res.every((ts) => ts.required === team)).toBe(true);
      });
    });
    describe("when given timeframe required 2 specific users", () => {
      const users = [
        { _id: new ObjectId(), username: "test user 1" },
        { _id: new ObjectId(), username: "test user 2" },
      ];
      const required: ITFRequired[] = users.map((user, index) => ({
        _id: `test ${index}`,
        type: "user",
        user,
      }));
      const timeframe = {
        toSlice: false,
        start: +startDate,
        end: +endDate,
        required,
        _id: "indivisible time frame",
        name: "indivisible time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 2 timespans", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(2);
      });
      it("should generate a timespan for each user", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const expectdUser1TimeSpan: ITimeSpan = {
          _id: new ObjectId(),
          start: startDate,
          end: endDate,
          timeframeID: "indivisible time frame",
          required: users[0]._id.toString(),
          assigned: users[0]._id,
          FTID,
        };
        expect(res).toContainEqual(expectdUser1TimeSpan);
        const expectdUser2TimeSpan: ITimeSpan = {
          _id: new ObjectId(),
          start: startDate,
          end: endDate,
          timeframeID: "indivisible time frame",
          required: users[1]._id.toString(),
          assigned: users[1]._id,
          FTID,
        };
        expect(res).toContainEqual(expectdUser2TimeSpan);
      });
    });
    describe("when given timeframe required 10 team members and 3 specific users", () => {
      const users = [
        { _id: new ObjectId(), username: "test user 1" },
        { _id: new ObjectId(), username: "test user 2" },
        { _id: new ObjectId(), username: "test user 3" },
      ];
      const team = "test";
      const requiredUsers: ITFRequired[] = users.map((user, index) => ({
        _id: `test ${index}`,
        type: "user",
        user,
      }));
      const required = [
        ...requiredUsers,
        {
          _id: "test",
          type: "team",
          team,
          amount: 10,
        },
      ];
      const timeframe = {
        toSlice: false,
        start: +startDate,
        end: +endDate,
        required,
        _id: "indivisible time frame",
        name: "indivisible time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 13 timespans", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(13);
      });
    });
  });
  describe("when given timeframe has to be sliced into 1 hours blocks", () => {
    describe("when given timeframe required 4 team members", () => {
      const team = "test";
      const required: ITFRequired[] = [
        {
          _id: "test",
          type: "team",
          team,
          amount: 4,
        },
      ];
      const timeframe = {
        toSlice: true,
        sliceTime: 1,
        start: +startDate,
        end: +threeHoursLaterDate,
        required,
        _id: "to slice into hours blocks time frame",
        name: "to slice into hours blocks time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 12 timeSpans (4 for each hours)", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(12);
      })
      it("should generate 4 timeSpans for a dedicated hour", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const midHourTimeSpans = res.filter(ts => ts.start.getHours() === startDate.getHours() + 1);
        expect(midHourTimeSpans).toHaveLength(4)
      });
      it("should generate first timeSpans with startDate matching timeframe startDate", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const firstTimeSpans = res.at(1) as ITimeSpan;
        expect(+firstTimeSpans.start).toBe(timeframe.start)
      })
      it("should generate last timeSpans with endDate matching timeframe endDate", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const lastTimeSpans = res.at(-1) as ITimeSpan;
        expect(+lastTimeSpans.end).toBe(timeframe.end)
      })
      it("should generate all timespans with required team", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res.every((ts) => ts.required === team)).toBe(true);
      });
    })
    describe("when given timeframe required 2 specific users", () => {
      const users = [
        { _id: new ObjectId(), username: "test user 1" },
        { _id: new ObjectId(), username: "test user 2" },
      ];
      const required: ITFRequired[] = users.map((user, index) => ({
        _id: `test ${index}`,
        type: "user",
        user,
      }));
      const timeframe = {
        toSlice: true,
        sliceTime: 1,
        start: +startDate,
        end: +threeHoursLaterDate,
        required,
        _id: "to slice into hours blocks time frame",
        name: "to slice into hours blocks time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 6 timeSpans (2 for each hours)", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(6);
      })
      it("should generate 2 timeSpans for a dedicated hour", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const midHourTimeSpans = res.filter(ts => ts.start.getHours() === startDate.getHours() + 1);
        expect(midHourTimeSpans).toHaveLength(2)
      });
      it("should generate first timeSpans with startDate matching timeframe startDate", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const firstTimeSpans = res.at(1) as ITimeSpan;
        expect(+firstTimeSpans.start).toBe(timeframe.start)
      })
      it("should generate last timeSpans with endDate matching timeframe endDate", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        const lastTimeSpans = res.at(-1) as ITimeSpan;
        expect(+lastTimeSpans.end).toBe(timeframe.end)
      })
      it("should generate a timespans at each hour with each user required and assigned", () => {
        const user1 = users[0];
        const user2 = users[1];
        const res = timeframeToTimeSpan(timeframe, FTID);
        
        const user1TimeSpans = res.filter(ts => ts.required === user1._id.toString())
        expect(user1TimeSpans).toHaveLength(3);
        expect(user1TimeSpans.every(ts => ts.assigned === user1._id)).toBe(true)

        const user2TimeSpans = res.filter(ts => ts.required === user2._id.toString())
        expect(user2TimeSpans).toHaveLength(3);
        expect(user2TimeSpans.every(ts => ts.assigned === user2._id)).toBe(true)
      });
    })
    describe("when given timeframe required 10 team members and 3 specific users", () => {
      const users = [
        { _id: new ObjectId(), username: "test user 1" },
        { _id: new ObjectId(), username: "test user 2" },
        { _id: new ObjectId(), username: "test user 3" },
      ];
      const team = "test";
      const requiredUsers: ITFRequired[] = users.map((user, index) => ({
        _id: `test ${index}`,
        type: "user",
        user,
      }));
      const required = [
        ...requiredUsers,
        {
          _id: "test",
          type: "team",
          team,
          amount: 10,
        },
      ];
      const timeframe = {
        toSlice: true,
        sliceTime: 1,
        start: +startDate,
        end: +threeHoursLaterDate,
        required,
        _id: "to slice into hours blocks time frame",
        name: "to slice into hours blocks time frame",
        timed: true,
      } as ITimeFrame;
      it("should generate 39 timeSpans (13 for each hour)", () => {
        const res = timeframeToTimeSpan(timeframe, FTID);
        expect(res).toHaveLength(39);
      })
    })
  })
});
