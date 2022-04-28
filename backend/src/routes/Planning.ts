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
const BASE_X = 20;

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

  //Create planning
  const doc = new jsPDF();
  fillPDF(doc, user, sos_numbers, userAssignedFT);

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
function fillPDF(
  doc: jsPDF,
  user: any,
  sos_numbers: any,
  userAssignedFT: any[]
) {
  let yCursor = BASE_SPACE;
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
  yCursor += BIG_SPACE;
  centeredText(doc, title, yCursor);
  yCursor += BASE_SPACE;
  //SOS part with numbers
  sosPart(doc, yCursor, sos_numbers);
  yCursor += BIG_SPACE * 2;

  let tasknumber = 1;
  userAssignedFT.forEach((ft: IFT) => {
    //FT part
    singleTask(doc, yCursor, ft, tasknumber);
    tasknumber++;
    yCursor += BASE_SPACE;
  });
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
    return str.replace(/[^a-zA-Z0-9]/g, "");
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
function sosPart(doc: jsPDF, yCursor: number, sos_numbers: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const startingCursor = yCursor;
  yCursor += LITTLE_SPACE;
  doc.setFontSize(15);
  yCursor += 5;
  doc.text("SOS", 25, yCursor);
  doc.setFontSize(10);
  yCursor += LITTLE_SPACE;
  sos_numbers.forEach((sos: any) => {
    const text = `${sos.name} : ${sos.number}`;
    doc.text(text, 25, yCursor);
    yCursor += LITTLE_SPACE;
  });
  doc.rect(20, startingCursor, pageWidth - 40, yCursor - startingCursor);
}

function singleTask(doc: jsPDF, yCursor: number, ft: IFT, tasknumber: number) {
  doc.setFontSize(15);
  const title = `Tache ${tasknumber} : ${sanitizeString(ft.general.name)}`;
  doc.text(title, BASE_X, yCursor);
}
