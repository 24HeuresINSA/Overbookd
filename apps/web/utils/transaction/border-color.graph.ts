import type { Chart, ScriptableLineSegmentContext } from "chart.js";
import { ERROR, SUCCESS } from "../vuetify/theme/common";

// from https://stackoverflow.com/questions/76215225/different-line-chart-border-colors-for-positive-and-negative-values-using-chart
export function getBorderColorForAmount(
  ctx: ScriptableLineSegmentContext & { chart?: Chart },
) {
  if ((ctx.p0.parsed.y ?? 0) * (ctx.p1.parsed.y ?? 0) >= 0) {
    return (ctx.p0.parsed.y ?? 0) >= 0 ? SUCCESS : ERROR;
  }
  // if the segment changes sign from p0 to p1
  const x0 = ctx.p0.parsed.x ?? 0,
    x1 = ctx.p1.parsed.x ?? 0,
    y0 = ctx.p0.parsed.y ?? 0,
    y1 = ctx.p1.parsed.y ?? 0,
    //transform values to pixels
    x0px = ctx.chart?.scales["x"].getPixelForValue(x0) ?? 0,
    x1px = ctx.chart?.scales["x"].getPixelForValue(x1) ?? 0,
    y0px = ctx.chart?.scales["y"].getPixelForValue(y0) ?? 0,
    y1px = ctx.chart?.scales["y"].getPixelForValue(y1) ?? 0;

  // create gradient form p0 to p1
  const gradient = ctx.chart?.ctx.createLinearGradient(x0px, y0px, x1px, y1px);
  // calculate frac - the relative length of the portion of the segment
  // from p0 to the point where the segment intersects the x axis
  const frac = Math.abs(y0) / (Math.abs(y0) + Math.abs(y1));
  // set colors at the ends of the segment
  const [col_p0, col_p1] = y0 > 0 ? [SUCCESS, ERROR] : [ERROR, SUCCESS];
  gradient?.addColorStop(0, col_p0);
  gradient?.addColorStop(frac, col_p0);
  gradient?.addColorStop(frac, col_p1);
  gradient?.addColorStop(1, col_p1);
  return gradient;
}
