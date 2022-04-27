import { Request, Response } from "express";
import User from "@entities/User";
import TimeSpan from "@entities/TimeSpan";
import StatusCodes from "http-status-codes";
import jsPDF from "jspdf";
import fs from "fs";
import logger from "@shared/Logger";
import { sosNumbers } from "@src/temp/numbers";

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
  //Create planning
  const doc = new jsPDF();
  fillPDF(doc, user, timespans);

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
 * @param timespans
 */
function fillPDF(doc: jsPDF, user: any, timespans: any) {
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
  sosPart(doc, yCursor);
  yCursor += BIG_SPACE;

  //PS Map
  psMap(doc, yCursor);
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
function sanitizeString(str: string | undefined) {
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
function sosPart(doc: jsPDF, yCursor: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const startingCursor = yCursor;
  yCursor += LITTLE_SPACE;
  doc.setFontSize(15);
  yCursor += 5; // add a little space
  doc.text("SOS", 25, yCursor);
  doc.setFontSize(10);
  yCursor += LITTLE_SPACE;
  sosNumbers.forEach((sos) => {
    const text = `${sos.name} : ${sos.number}`;
    doc.text(text, 25, yCursor);
    yCursor += LITTLE_SPACE;
  });
  doc.rect(20, startingCursor, pageWidth - 40, yCursor - startingCursor);
}

function psMap(doc: jsPDF, yCursor: number) {
  //TODO
}
