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
  });
  // Check if planning already exists
  let planning = await PlanningModel.findOne({ user_id: userID });
  if (planning) {
    planning.plannning = doc;
    planning.save();
    res.status(StatusCodes.OK).json(planning);
  }
  //Create new planning
  else {
    planning = await PlanningModel.create({
      user_id: userID,
      plannning: doc,
    });
    res.status(StatusCodes.OK).json(planning);
  }
}
