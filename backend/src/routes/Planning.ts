import { Request, Response } from "express";
import User, { IUser } from "@entities/User";
import TimeSpan, { ITimeSpan } from "@entities/TimeSpan";
import FTModel, { IFT } from "@entities/FT";
import StatusCodes from "http-status-codes";
import jsPDF from "jspdf";
import logger from "@shared/Logger";
import ConfigModel, { IConfig } from "@entities/Config";
import { convert } from "html-to-text";
import { existsSync, readFileSync } from "fs";

//PDF Helpers
const LITTLE_SPACE = 5;
const BASE_SPACE = 10;
const BASE_X = 25;

let yCursor = BASE_SPACE;
let allUsers: IUser[] = [];
let allTimeSPans: ITimeSpan[] = [];
let allFT: IFT[] = [];

let pageNumber = 1;
let totalPage = 1;

interface Task {
  id: number;
  ft: IFT;
  timespan: ITimeSpan;
  respPhone: number | undefined;
  partners: (string | undefined)[];
  role: string;
}

export async function createAllPlanning(
  req: Request,
  res: Response
): Promise<any> {
  totalPage = 1;
  //get basic things to build all plannings
  yCursor = BASE_SPACE;
  //Get all users
  await User.find().then((users: any) => {
    allUsers = users.sort((a: any, b: any) =>
      a.firstname.localeCompare(b.firstname)
    );
  });
  //Get all timespans
  await TimeSpan.find().then((timespans: any) => {
    allTimeSPans = timespans;
  });
  //Get all FT
  await FTModel.find().then((fts: any) => {
    allFT = fts;
  });

  //Get sos numbers from config
  const sos_numbers: IConfig = (await ConfigModel.findOne(
    { key: "sos_numbers" },
    { key: 1, value: 1, _id: 0 }
  )) ?? { key: "", value: "", description: "" };
  if (sos_numbers.key === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No sos numbers found in config",
    });
  }

  const docs: string[] = [];
  let doc = new jsPDF({ putOnlyUsedFonts: true, compress: true });
  try {
    doc = createDocument();
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating pdf",
    });
  }
  for (let i = 0; i < allUsers.length; i++) {
    //get timespans for user
    const timespans = allTimeSPans.filter(
      //@ts-ignore
      (timespan: ITimeSpan) => timespan.assigned === allUsers[i]._id?.toString()
    );
    //check if user has timespans
    if (timespans.length === 0) {
      continue;
    }
    //get fts for timespans
    const userAssignedFT: any = [];
    for (let i = 0; i < timespans.length; i++) {
      const ft = allFT.find((ft: IFT) => ft.count === timespans[i].FTID);
      if (ft) {
        userAssignedFT.push(ft);
      }
    }
    const userTasks = buildAllTasks(userAssignedFT, timespans);
    fillPDF(doc, allUsers[i], sos_numbers.value, userTasks);
    if (totalPage > 2000) {
      docs.push(doc.output("datauristring"));
      doc = new jsPDF({ putOnlyUsedFonts: true, compress: true });
      try {
        doc = createDocument();
      } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error creating pdf",
        });
      }
      totalPage = 1;
    } else {
      newPage(doc);
    }
  }
  docs.push(doc.output("datauristring"));
  return res.status(StatusCodes.OK).json(docs);
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

  //Get sos numbers from config
  const sos_numbers: IConfig = (await ConfigModel.findOne(
    { key: "sos_numbers" },
    { key: 1, value: 1, _id: 0 }
  )) ?? { key: "", value: "", description: "" };
  if (sos_numbers.key === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No sos numbers found in config",
    });
  }

  const userTasks = buildAllTasks(userAssignedFT, timespans);

  //Create planning
  let doc = new jsPDF({ putOnlyUsedFonts: true, compress: true });
  try {
    doc = createDocument();
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating pdf",
    });
  }
  //reset the cursor position
  yCursor = BASE_SPACE;
  logger.info("Creating planning for user " + user?._id);
  fillPDF(doc, user, sos_numbers.value, userTasks);
  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating pdf",
    });
  } else {
    const output = doc.output("datauristring");
    return res.status(StatusCodes.OK).json(output);
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
  pageNumber = 1;
  //Basic configuration
  doc.setFontSize(10);

  //logo
  addLogo(doc);

  //Header
  centeredText(doc, "Planning 24 heures de l'INSA", yCursor);
  doc.setFontSize(20);
  doc.setFont("Arial", "bold");
  let title = `${user?.firstname} ${user?.lastname}`;
  if (user?.nickname) {
    title += ` (${user?.nickname})`;
  }

  // Set pdf properties
  doc.setProperties({
    title: "Planning de " + title,
    subject: 'Planning 24 heures de l"INSA',
    author: '24heures de l"INSA',
    keywords: "24heures, insa, planning",
    creator: "Overbookd",
  });

  //Title
  incrementY(doc, BASE_SPACE);
  centeredText(doc, title, yCursor);
  incrementY(doc, BASE_SPACE);
  doc.setFont("Arial", "normal");

  //SOS part with numbers
  sosPart(doc, sos_numbers);
  incrementY(doc, BASE_SPACE);

  //plan part
  planPart(doc);
  newPage(doc);
  //Tasks part
  tasks.forEach((task: Task) => {
    singleTask(doc, task);
    incrementY(doc, LITTLE_SPACE);
  });

  let newPageNeeded = pageNumber % 2;
  if ((pageNumber + newPageNeeded) % 4 !== 0) {
    newPageNeeded += 2;
  }
  for (let i = 0; i < newPageNeeded; i++) {
    newPage(doc);
  }
  if (newPageNeeded === 0) {
    //if no new page needed, add page number
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont("Arial", "bold");
    doc.setFontSize(10);
    centeredText(doc, "- " + pageNumber.toString() + " -", pageHeight - 5);
  }
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
    let respPhone;
    try {
      const respUser = allUsers.find(
        (u: any) => u._id.toString() === (ft as any).general.inCharge._id
      );
      respPhone = respUser?.phone;
    } catch (e) {
      respPhone = 0;
    }
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
  }
  doc.line(0, yCursor, pageWidth, yCursor);
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
    timeZone: "Europe/Paris",
  };
  const startDate = new Date(task.timespan.start);
  const startDateString = startDate.toLocaleDateString("fr-FR", options);
  const endDate = new Date(task.timespan.end);
  const endDateString = endDate.toLocaleDateString("fr-FR", options);
  const date = "Date : ";
  const dateWidth = makeTitle(doc, date);
  const dateText = `${startDateString} - ${endDateString}`;
  doc.text(dateText, BASE_X + dateWidth, yCursor);
  incrementY(doc, LITTLE_SPACE);

  try {
    const location = "Lieu : ";
    const locationWidth = makeTitle(doc, location);
    const locationDetail = `${(task as any).ft.details.locations[0] || ""}`;
    doc.text(locationDetail, BASE_X + locationWidth, yCursor);
    incrementY(doc, LITTLE_SPACE);
  } catch (error) {
    const location = "Lieu : non défini";
    makeTitle(doc, location);
    incrementY(doc, LITTLE_SPACE);
  }

  //RESPONSIBLE of the task
  try {
    const responsable = "Responsable : ";
    const respWidth = makeTitle(doc, responsable);
    const resp = `${(task as any).ft.general.inCharge.username} (+33${
      task.respPhone
    })`;
    doc.text(resp, BASE_X + respWidth, yCursor);
    incrementY(doc, LITTLE_SPACE);
  } catch {
    const responsable = "Responsable : non défini";
    makeTitle(doc, responsable);
    incrementY(doc, LITTLE_SPACE);
  }

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

  //CONSIGNE of the task
  const consignes = task.ft.details.description;
  const firstSplit = convert(consignes as any, { wordwrap: 100 }).replace(
    /\n+$/,
    ""
  );
  const secondSplit = firstSplit.split("\n");
  for (let i = 0; i < secondSplit.length; i++) {
    if (secondSplit[i] !== "") {
      doc.text(secondSplit[i], BASE_X, yCursor);
      incrementY(doc, LITTLE_SPACE);
    } else {
      if (i !== secondSplit.length - 1) {
        incrementY(doc, 0.7);
      }
    }
  }
  doc.line(0, yCursor, pageWidth, yCursor);
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
    newPage(doc);
    doc.setFont("Arial", "normal");
    doc.setFontSize(10);
    return;
  }
  yCursor = newY;
}

function newPage(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFont("Arial", "bold");
  doc.setFontSize(10);
  centeredText(doc, "- " + pageNumber.toString() + " -", pageHeight - 5);
  doc.addPage();
  pageNumber++;
  totalPage++;
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

function planPart(doc: jsPDF) {
  const psmapPath = "assets/psmap.jpg";
  const psmapBase64 = readFileSync(psmapPath, { encoding: "base64" });
  const imgData = "data:image/jpeg;base64," + psmapBase64;

  const planPath = "assets/plan.jpg";
  const planBase64 = readFileSync(planPath, { encoding: "base64" });
  const planData = "data:image/jpeg;base64," + planBase64;
  doc.addImage(imgData, "JPEG", 15, yCursor, 180, 100);
  doc.addImage(planData, "JPEG", 15, yCursor + 100, 180, 100);
}

function addLogo(doc: jsPDF) {
  const logoPath = "assets/logo_24.png";
  const logoBase64 = readFileSync(logoPath, { encoding: "base64" });
  const imgData = "data:image/png;base64," + logoBase64;
  doc.addImage(imgData, "JPEG", 10, 5, 20, 20);
}

function createDocument(): jsPDF {
  //Create planning
  const doc = new jsPDF({ putOnlyUsedFonts: true, compress: true });

  // check if files exists
  const arrialPath = "assets/arial.ttf";
  const arrialBoldPath = "assets/arial_bold.ttf";

  if (!existsSync(arrialPath)) {
    logger.err("Arial font not found");
    throw new Error("Arial font not found");
  }

  if (!existsSync(arrialBoldPath)) {
    logger.err("Arial bold font not found");
    throw new Error("Arial font not found");
  }

  //load file as binary
  const arialData = doc.loadFile(arrialPath, true);
  doc.addFileToVFS("Arial.ttf", arialData);

  const boldData = doc.loadFile(arrialBoldPath, true);
  doc.addFileToVFS("Arial_Bold.ttf", boldData);

  doc.addFont("Arial.ttf", "Arial", "normal");
  doc.addFont("Arial_Bold.ttf", "Arial", "bold");
  doc.setFont("Arial", "normal");

  return doc;
}
