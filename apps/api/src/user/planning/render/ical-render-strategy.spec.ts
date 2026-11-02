import { describe, expect, it } from "vitest";
import { IcalRenderStrategy } from "./ical-render-strategy";

describe("IcalRenderStrategy", () => {
  it("returns a valid calendar container when there are no events", async () => {
    const calendar = await new IcalRenderStrategy().render([]);

    expect(calendar).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(calendar).toContain("\r\nVERSION:2.0\r\n");
    expect(calendar).toMatch(/\r\nEND:VCALENDAR$/);
  });
});
