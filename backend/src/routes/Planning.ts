import { Request, Response } from "express";
import User from "@entities/User";
import TimeSpan, { ITimeSpan } from "@entities/TimeSpan";
import FTModel, { IFT } from "@entities/FT";
import StatusCodes from "http-status-codes";
import jsPDF from "jspdf";
import logger from "@shared/Logger";
import ConfigModel from "@entities/Config";

//PDF Helpers
const LITTLE_SPACE = 5;
const BASE_SPACE = 10;
const BIG_SPACE = 20;
const BASE_X = 25;

let yCursor = BASE_SPACE;

interface Task {
  id: number;
  ft: IFT;
  timespan: ITimeSpan;
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
 * fill the pdf
 * @param doc
 * @param user
 * @param sos_numbers
 * @param userAssignedFT
 */
function fillPDF(doc: jsPDF, user: any, sos_numbers: any, tasks: Task[]) {
  //Basic configuration
  doc.setFont("helvetica");
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
  incrementY(doc, BIG_SPACE);
  centeredText(doc, title, yCursor);
  incrementY(doc, BASE_SPACE);
  //SOS part with numbers
  sosPart(doc, sos_numbers);
  incrementY(doc, BIG_SPACE * 2.5);
  //Tasks part
  tasks.forEach((task: Task) => {
    singleTask(doc, task);
  });
}

function buildAllTasks(userAssignedFT: IFT[], timespans: ITimeSpan[]) {
  const tasks: Task[] = [];
  const sortedTS = timespans.sort(
    (tsa, tsb) => tsa.start.getTime() - tsb.start.getTime()
  );
  let index = 1;
  sortedTS.forEach((ts: ITimeSpan) => {
    const ft = userAssignedFT.find((ft: IFT) => ft.count === ts.FTID);
    if (ft) {
      tasks.push({
        id: index,
        ft: ft,
        timespan: ts,
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
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  } else {
    return "";
  }
}

/**
 * build the sos part of the pdf
 * @param doc
 * @param yCursor
 * @returns
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
 * @param yCursor
 * @param task
 */
function singleTask(doc: jsPDF, task: Task) {
  //Space for the rect
  doc.setFontSize(15);
  const title = sanitizeString(`Tache ${task.id} : ${task.ft.general.name}`);
  doc.text(title, BASE_X, yCursor);
  incrementY(doc, LITTLE_SPACE);
  doc.setFontSize(10);
  doc.text("Quand ?", BASE_X, yCursor);
  const startDate = new Date(task.timespan.start);
  //avoir la date en string au bon format fr
  const startDateString = sanitizeString(
    `${startDate.getDate()}/${
      startDate.getMonth() + 1
    }/${startDate.getFullYear()} à ${startDate.getHours()}:${startDate.getMinutes()}`
  );
  doc.text(startDateString, BASE_X + BASE_SPACE + 5, yCursor);
}

function incrementY(doc: jsPDF, increment: number) {
  const pageHeight = doc.internal.pageSize.height;
  const newY = yCursor + increment;
  if (newY > pageHeight) {
    logger.info("New y is too high" + newY);
    doc.addPage();
    yCursor = BASE_SPACE;
    return;
  }
  yCursor = newY;
}
