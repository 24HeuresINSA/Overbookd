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
  role: string;
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
  //load file as binary
  const arial_normal = doc.loadFile("src/assets/arial.ttf");
  const arial_bold = doc.loadFile("src/assets/arial_bold.ttf");
  doc.addFileToVFS("Arial.ttf", arial_normal);
  doc.addFileToVFS("Arial_Bold.ttf", arial_bold);

  doc.addFont("Arial.ttf", "Arial", "normal");
  doc.addFont("Arial_Bold.ttf", "Arial", "bold");
  doc.setFont("Arial", "normal");
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
  let title = `${user?.firstname} ${user?.lastname}`;
  if (user?.nickname) {
    title += ` (${user?.nickname})`;
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
      (u: any) => u._id.toString() === (ft as any).general.inCharge._id
    );
    const twinTimeSpan = allTimeSPans.filter(
      (TS: ITimeSpan) =>
        ts.FTID === TS.FTID &&
        ts.start.getTime() === TS.start.getTime() &&
        ts.end.getTime() === TS.end.getTime() &&
        ts._id.toString() !== TS._id.toString()
    );
    //We precise the affected role
    let affectedAs: string;
    if (ts.required.length === 24) {
      affectedAs = "hard";
    } else {
      affectedAs = ts.required;
    }
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
        role: affectedAs,
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
  doc.setFont("Arial", "bold");
  doc.text("SOS", BASE_X, yCursor);
  doc.setFont("Arial", "normal");
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
  const taskSize = predictSingleTaskHeight(doc, task);
  if (yCursor !== BASE_SPACE && yCursor + taskSize > pageHeight) {
    newPage(doc);
    if (taskSize > pageHeight) {
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    }
  }
  let startingCursor = yCursor;
  incrementY(doc, LITTLE_SPACE);
  doc.setFont("Arial", "bold");
  //TITLE of the task
  doc.setFontSize(14);
  const title = `Tache ${task.id} : ${task.ft.general.name}`;
  doc.text(title, BASE_X - 5, yCursor);
  doc.setFont("Arial", "normal");
  incrementY(doc, LITTLE_SPACE);
  //DATE of the task
  doc.setFontSize(12);
  //Get date, hours, minutes in FR format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const startDate = new Date(task.timespan.start);
  const startDateString = startDate.toLocaleDateString("fr-FR", options);
  const endDate = new Date(task.timespan.end);
  const endDateString = endDate.toLocaleDateString("fr-FR", options);
  const date = "Date : ";
  const dateWidth = makeTitle(doc, date);
  doc.setFont("Arial", "normal");
  const dateText = `${startDateString} - ${endDateString}`;
  doc.text(dateText, BASE_X + dateWidth, yCursor);
  incrementY(doc, LITTLE_SPACE);
  //LOCATION of the task
  const location = "Lieu : ";
  const locationWidth = makeTitle(doc, location);
  const locationDetail = `${(task as any).ft.details.locations[0] || ""}`;
  doc.text(locationDetail, BASE_X + locationWidth, yCursor);
  incrementY(doc, LITTLE_SPACE);
  //RESPONSIBLE of the task
  const responsable = "Responsable : ";
  const respWidth = makeTitle(doc, responsable);
  const resp = `${(task as any).ft.general.inCharge.username} (+33${
    task.respPhone
  })`;
  doc.text(resp, BASE_X + respWidth, yCursor);
  incrementY(doc, LITTLE_SPACE);
  //ROLE in the task if not soft
  if (task.role !== "soft") {
    const role = "Role : ";
    const roleWidth = makeTitle(doc, role);
    const roleDetail = `${task.role}`;
    doc.text(roleDetail, BASE_X + roleWidth, yCursor);
    incrementY(doc, LITTLE_SPACE);
  }
  //PARTNERS of the task
  const partnersTitle = "Avec : ";
  const partnersWidth = makeTitle(doc, partnersTitle);
  let partners = "";
  task.partners.forEach((part: any) => {
    if (part !== undefined) {
      partners += part + ", ";
    }
  });
  partners = partners.replace(/,\s*$/, "");
  const longstr = doc.splitTextToSize(partners, pageWidth - BASE_X * 2);
  for (let i = 0; i < longstr.length; i++) {
    if (i === 0) {
      doc.text(longstr[i], BASE_X + partnersWidth, yCursor);
    } else {
      doc.text(longstr[i], BASE_X, yCursor);
    }
    incrementY(doc, LITTLE_SPACE);
  }
  doc.setFontSize(12);
  makeTitle(doc, "Consignes : ");
  doc.setFontSize(10);
  incrementY(doc, LITTLE_SPACE);

  const consignes = task.ft.details.description;
  const firstSplit = convert(consignes as any, { wordwrap: 100 });
  const secondSplit = firstSplit.split("\n");
  secondSplit.forEach((str: any) => {
    if (yCursor === BASE_SPACE) {
      startingCursor = yCursor;
      incrementY(doc, LITTLE_SPACE);
    }
    if (str !== "") {
      doc.text(str, BASE_X, yCursor);
      incrementY(doc, LITTLE_SPACE);
    } else {
      incrementY(doc, 0.7);
    }
  });
  doc.rect(10, startingCursor, pageWidth - 20, yCursor - startingCursor);
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
  if (newY + BASE_SPACE > pageHeight) {
    doc.addPage();
    yCursor = BASE_SPACE;
    return;
  }
  yCursor = newY;
}

function newPage(doc: jsPDF) {
  doc.addPage();
  yCursor = BASE_SPACE;
}

/**
 * Write a title and return the text widht
 * @param doc
 * @param title
 * @returns
 */
function makeTitle(doc: jsPDF, title: string): number {
  doc.setFont("Arial", "bold");
  doc.text(title, BASE_X, yCursor);
  const textWidht =
    doc.getStringUnitWidth(title) * doc.internal.scaleFactor * 1.5;
  doc.setFont("Arial", "normal");
  return textWidht;
}

/**
 * predict the size of a task and return the height
 * @param doc
 * @param task
 * @returns
 */
function predictSingleTaskHeight(doc: jsPDF, task: Task): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let totalHeight = LITTLE_SPACE;
  doc.setFontSize(14);
  doc.setFont("Arial", "bold");
  const title = `Tache ${task.id} : ${task.ft.general.name}`;
  totalHeight += doc.getStringUnitWidth(title);
  totalHeight += LITTLE_SPACE;
  doc.setFontSize(12);
  const major = "Date : ";
  for (let i = 0; i < 6; i++) {
    totalHeight += doc.getStringUnitWidth(major);
    totalHeight += LITTLE_SPACE;
  }
  let partners = "";
  task.partners.forEach((part: any) => {
    if (part !== undefined) {
      partners += part + ", ";
    }
  });
  partners = partners.replace(/,\s*$/, "");
  const longstr = doc.splitTextToSize(partners, pageWidth - BASE_X * 2);
  for (let i = 0; i < longstr.length; i++) {
    totalHeight += doc.getStringUnitWidth(longstr[i]);
    totalHeight += LITTLE_SPACE;
  }
  const consignes = task.ft.details.description;
  const firstSplit = convert(consignes as any, { wordwrap: 100 });
  const secondSplit = firstSplit.split("\n");
  secondSplit.forEach((str: any) => {
    if (str !== "") {
      totalHeight += doc.getStringUnitWidth(str);
      totalHeight += LITTLE_SPACE;
    } else {
      totalHeight += 0.7;
    }
  });
  return totalHeight / (doc.internal.scaleFactor * 1.5);
}
