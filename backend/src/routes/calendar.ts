import ical from 'ical-generator'
import  TimeSpan, { ITimeSpan } from '../entities/TimeSpan'
import FTModel, {IFT} from '../entities/FT'
import { Request, Response } from "express";

export async function getCalendarById(req: Request, res: Response) {
  const { id } = req.params
  const fts = await FTModel.find({});

  const ftMapByCount: {[key: number]: IFT} = {};

  for(const ft of fts) {
    ftMapByCount[ft.count] = ft;
  }


  const calendar = ical(({
    domain: `${process.env.DOMAIN}`,
    name: 'Time-Spans Calendar',
    prodId: { company: 'Time-Spans', product: 'Time-Spans Calendar' },
  } as any))

  const timeSpans = await TimeSpan.find({
    assigned: id
  })

  timeSpans.forEach((timeSpan: ITimeSpan) => {
    console.log(timeSpan.FTID);
    const ft = ftMapByCount[timeSpan.FTID];
    const summary = `${(ft as any).general.name}`;
    let description = "N/A"
    let location = "N/A"
    if(ft.details) {
      description = `${(ft as any).details.description}`;
      //fuck bad typings its annoying :(
      if(ft.details.location) {
        location = `${(ft as any).details.location.join(', ')}`;
      }
    }
    calendar.createEvent({
      start: timeSpan.start,
      end: timeSpan.end,
      summary: summary,
      description: description,
      location: location,
    })
  })

  res.set('Content-Type', 'text/calendar; charset=utf-8')
  res.send(calendar.toString())
}