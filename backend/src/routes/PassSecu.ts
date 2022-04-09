import FAModel from "@entities/FA";
import logger from "@shared/Logger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getPassSecu(req: Request, res: Response) {
  logger.info("getting all Pass Secu ...");
  const FAs = await FAModel.aggregate().match({
    isValid: { $ne: false },
  });
  const result: any[] = [];
  FAs.forEach((fa) => {
    if (fa.securityPasses.length > 0) {
      fa.securityPasses.forEach((pass: any) => {
        if (Object.keys(pass).length) {
          pass.linkedFA = fa.count;
          result.push(pass);
        }
      });
    }
  });
  res.json(result);
}
