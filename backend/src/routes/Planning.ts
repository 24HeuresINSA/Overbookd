import { Request, Response } from "express";
import User from "@entities/User";
import TimeSpan, { ITimeSpan } from "@entities/TimeSpan";
import FTModel, { IFT } from "@entities/FT";
import StatusCodes from "http-status-codes";
import jsPDF from "jspdf";
import logger from "@shared/Logger";
import ConfigModel from "@entities/Config";
import { convert } from "html-to-text";

//PDF Helpers
const LITTLE_SPACE = 5;
const BASE_SPACE = 10;
const BIG_SPACE = 20;
const BASE_X = 25;

let yCursor = BASE_SPACE;
let allUsers: any[] = [];
let allTimeSPans: ITimeSpan[] = [];

interface Task {
  id: number;
  ft: IFT;
  timespan: ITimeSpan;
  respPhone: number;
  partners: (string | undefined)[];
}

export async function createPlanning(
  req: Request,
  res: Response
): Promise<any> {
  //Get user from request
  const userID = req.params.userID;
  const user = await User.findById(userID);
  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "User not found",
    });
  }
  await User.find().then((users: any) => {
    allUsers = users;
  });
  if (!allUsers) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "No users found",
    });
  }
  await TimeSpan.find().then((timespans: any) => {
    allTimeSPans = timespans;
  });
  //Get timespans where assigned is userid
  const timespans = await TimeSpan.find({ assigned: userID });
  if (!timespans) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  //Get specific FT for where user is assigned
  const userAssignedFT: any = [];
  for (let index = 0; index < timespans.length; index++) {
    const ft = await FTModel.findOne({ count: timespans[index].FTID });
    userAssignedFT.push(ft);
  }

  //Get config
  const config = await ConfigModel.find({});
  if (!config) {
    return;
  }
  //Get sos numbers
  const configNumbers = config.find((c) => c.key === "sos_numbers");
  if (!configNumbers) {
    return;
  }
  const sos_numbers = configNumbers.value;

  const userTasks = buildAllTasks(userAssignedFT, timespans);

  //Create planning
  const doc = new jsPDF();
  //reset the cursor position
  yCursor = BASE_SPACE;
  fillPDF(doc, user, sos_numbers, userTasks);
  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating pdf",
    });
  } else {
    const base64pdf = btoa(doc.output());
    return res.status(StatusCodes.OK).json(base64pdf);
  }
}

/**
 * fill the pdf with the data
 * @param doc
 * @param user
 * @param sos_numbers
 * @param tasks
 */
function fillPDF(doc: jsPDF, user: any, sos_numbers: any, tasks: Task[]) {
  //Basic configuration
  doc.setFontSize(10);

  //Header
  centeredText(doc, "Planning 24 heures de l'INSA", yCursor);
  doc.setFontSize(20);
  let title = `${sanitizeString(user?.firstname)} ${sanitizeString(
    user?.lastname
  )}`;
  if (user?.nickname) {
    title += ` (${sanitizeString(user?.nickname)})`;
  }
  incrementY(doc, BASE_SPACE);
  centeredText(doc, title, yCursor);
  incrementY(doc, BASE_SPACE);
  //SOS part with numbers
  sosPart(doc, sos_numbers);
  incrementY(doc, BASE_SPACE);
  //Tasks part
  tasks.forEach((task: Task) => {
    singleTask(doc, task);
    incrementY(doc, LITTLE_SPACE);
  });
}

/**
 * build all tasks
 * @param userAssignedFT
 * @param timespans
 * @returns
 */
function buildAllTasks(userAssignedFT: IFT[], timespans: ITimeSpan[]) {
  const tasks: Task[] = [];
  const sortedTS = timespans.sort(
    (tsa, tsb) => tsa.start.getTime() - tsb.start.getTime()
  );
  let index = 1;
  sortedTS.forEach((ts: ITimeSpan) => {
    const ft = userAssignedFT.find((ft: IFT) => ft.count === ts.FTID);
    const respUser = allUsers.find(
      //@ts-ignore
      (u: any) => u._id.toString() === ft?.general.inCharge._id
    );
    const twinTimeSpan = allTimeSPans.filter(
      (TS: ITimeSpan) =>
        ts.FTID === TS.FTID &&
        ts.start.getTime() === TS.start.getTime() &&
        ts.end.getTime() === TS.end.getTime() &&
        ts._id.toString() !== TS._id.toString()
    );
    const tsPartners = twinTimeSpan.map((tsp: ITimeSpan) => {
      const part = allUsers.find(
        (u: any) => u._id.toString() === tsp?.assigned
      );
      if (part) {
        return part.firstname + " " + part.lastname;
      }
    });

    const respPhone = respUser?.phone;
    if (ft) {
      tasks.push({
        id: index,
        ft: ft,
        timespan: ts,
        respPhone: respPhone,
        partners: tsPartners,
      });
      index++;
    }
  });
  return tasks;
}

/**
 * Display text in the center of the page
 * @param doc
 * @param text
 * @param y
 */
function centeredText(doc: jsPDF, text: string, y: number) {
  const fontSize = doc.getFontSize();
  const pageWidth = doc.internal.pageSize.getWidth();
  const txtWidth =
    (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
  const x = (pageWidth - txtWidth) / 2;
  doc.text(text, x, y);
}

/**
 * remove all special characters
 * @param str
 * @returns
 */
function sanitizeString(str: any) {
  if (str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } else {
    return "";
  }
}

/**
 * build the sos part of the pdf
 * @param doc
 * @param sos_numbers
 */
function sosPart(doc: jsPDF, sos_numbers: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const startingCursor = yCursor;
  incrementY(doc, LITTLE_SPACE);
  doc.setFontSize(15);
  incrementY(doc, LITTLE_SPACE);
  doc.text("SOS", BASE_X, yCursor);
  doc.setFontSize(10);
  incrementY(doc, LITTLE_SPACE);
  sos_numbers.forEach((sos: any) => {
    const text = `${sos.name} : ${sos.number}`;
    doc.text(text, BASE_X, yCursor);
    incrementY(doc, LITTLE_SPACE);
  });
  doc.rect(20, startingCursor, pageWidth - 40, yCursor - startingCursor);
}

/**
 * build the part for 1 task
 * @param doc
 * @param task
 */
function singleTask(doc: jsPDF, task: Task) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  //Space for the rect
  doc.setFontSize(12);
  const title = sanitizeString(`Tache ${task.id} : ${task.ft.general.name}`);
  doc.text(title, BASE_X - 5, yCursor);
  incrementY(doc, LITTLE_SPACE);
  doc.setFontSize(10);
  //avoir la date et l'heure format francais
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const startDate = new Date(task.timespan.start);
  const startDateString = sanitizeString(
    startDate.toLocaleDateString("fr-FR", options)
  );
  const endDate = new Date(task.timespan.end);
  const endDateString = sanitizeString(
    endDate.toLocaleDateString("fr-FR", options)
  );
  const dateText = sanitizeString(
    `Quand ? : ${startDateString} - ${endDateString}`
  );
  doc.text(dateText, BASE_X, yCursor);
  incrementY(doc, LITTLE_SPACE);
  const resp = `Responsable : ${sanitizeString(
    //@ts-ignore
    task.ft.general.inCharge.username
  )} (+33${task.respPhone})`;
  doc.text(resp, BASE_X, yCursor);
  incrementY(doc, LITTLE_SPACE);
  let partners = "Avec : ";
  task.partners.forEach((part: any) => {
    if (part !== undefined) {
      partners += sanitizeString(part + ", ");
    }
  });
  const longstr = doc.splitTextToSize(partners, pageWidth - BASE_X * 2);
  longstr.forEach((str: any) => {
    doc.text(str, BASE_X, yCursor);
    incrementY(doc, LITTLE_SPACE);
  });
  doc.setFontSize(11);
  doc.text("Consignes :", BASE_X, yCursor);
  doc.setFontSize(10);
  incrementY(doc, LITTLE_SPACE);

  const consignes = sanitizeString(task.ft.details.description);
  const firstSplit = convert(consignes);
  const secondSplit = firstSplit.split("\n");
  secondSplit.forEach((str: any) => {
    if (str !== "") {
      const logstr = sanitizeString(str);
      doc.text(logstr, BASE_X, yCursor);
      incrementY(doc, LITTLE_SPACE);
    } else {
      incrementY(doc, 1);
    }
  });
  incrementY(doc, LITTLE_SPACE);
}

/**
 * Allows to increment the y and take care of the page break
 * @param doc
 * @param increment
 * @returns
 */
function incrementY(doc: jsPDF, increment: number) {
  const pageHeight = doc.internal.pageSize.height;
  const newY = yCursor + increment;
  if (newY > pageHeight) {
    doc.addPage();
    yCursor = BASE_SPACE;
    return;
  }
  yCursor = newY;
}
