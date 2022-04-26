import { Request, Response } from "express";
import User from "@entities/User";
import TimeSpan from "@entities/TimeSpan";
import { Document, Packer, Paragraph, TextRun } from "docx";
import PlanningModel from "@entities/Planning";
import logger from "@shared/Logger";
import StatusCodes from "http-status-codes";

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
  //create hello world doc for test
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: "Foo Bar",
                bold: true,
              }),
              new TextRun({
                text: "\tGithub is the best",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
    creator: "Overbookd",
    description: "Planning_" + user?.firstname + "_" + user?.lastname,
    title: "Planning_" + user?.firstname + "_" + user?.lastname,
  });
  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error while creating doc",
    });
  } else {
    Packer.toBuffer(doc).then((buffer) => {
      return res.status(StatusCodes.OK).json(buffer);
    });
  }
}
