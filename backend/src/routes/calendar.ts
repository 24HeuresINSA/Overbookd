import ical, { ICalAlarmType } from 'ical-generator'
import  TimeSpan, { Timespan } from '../entities/TimeSpan'
import FTModel, {IFT} from '../entities/FT'
import { Request, Response } from "express";
import logger from "@shared/Logger"


export async function getCalendarById(req: Request, res: Response) {
  const { id } = req.params
  const fts = await FTModel.find({});
  logger.info(`Generating calendar for user ${id}`)

  const ftMapByCount: {[key: number]: IFT} = {};

  for(const ft of fts) {
    ftMapByCount[ft.count] = ft;
  }


  const calendar = ical(({
    domain: `${process.env.DOMAIN}`,
    name: '24H 47eme - Calendrier',
    prodId: { company: '24H de l\'insa', product: 'Overbookd Calendar' },
  } as any))

  const timeSpans = await TimeSpan.find({
    assigned: id
  })

  timeSpans.forEach((timeSpan: Timespan) => {
    const ft = ftMapByCount[timeSpan.FTID];
    const summary = `${(ft as any).general.name}`;
    let description = "N/A"
    let location = "N/A"
    let attendee = "N/A";
    if(ft.general.inCharge) {
      attendee = `${(ft as any).general.inCharge.username}`
    }

    if(ft.details) {
      description = `Personne en charge : <b>${attendee}</b><br />${(ft as any).details.description}`;
      //fuck bad typings its annoying :(
      if(ft.details.locations) {
        location = `${(ft as any).details.locations.join(', ')}`;
      }
    }
    calendar.createEvent({
      start: timeSpan.start,
      end: timeSpan.end,
      summary: summary,
      description: description,
      location: location,
      alarms: [{
        triggerBefore: 10 * 60,
        type: ICalAlarmType.display
      }]
    })
  })

  res.set('Content-Type', 'text/calendar; charset=utf-8')
  res.send(calendar.toString())
}