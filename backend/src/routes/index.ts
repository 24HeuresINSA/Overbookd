import { Request, Response, Router } from "express";
import { getConfig, setConfig } from "./Config";
import mCors from "../cors";
import {
  addAvailabilities,
  removeAvailability,
  addNotificationByFullName,
  addNotificationByID,
  broadcastNotification,
  createFriendship,
  getAllUsersName,
  getPP,
  getUser,
  getUserByID,
  getUsers,
  updateUserByID,
  uploadPP,
} from "./Users";
import {
  createFA,
  deleteFA,
  getFAByCount,
  getFAs,
  getFAsNumber,
  setFA,
} from "./FA";
import * as EquipmentHandler from "./Equipment";
import * as TimeslotHandler from "./Timeslot";
import {
  createFT,
  deleteFT,
  getAllFTs,
  getFTByID,
  getFTsNumber,
  myPlanning,
  getOrgaRequis,
  makeFTReady,
  unassign,
  updateFT,
} from "./FT";
import * as TransactionHandlers from "./transactions";
import * as AuthHandlers from "./Auth";
import issueHandler from "./Issue";
import * as authMiddleware from "@src/middleware/auth";
// import * as AssignmentHandlers from "./Assignment";
import * as LocationHandlers from "./Location";
import * as ConflictHandlers from "./Conflict";
// @ts-ignore
import * as TimeSpanHandlers from "./TimeSpan";
import { getPassSecu } from "./PassSecu";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require("multer");

function ping(req: Request, res: Response) {
  return res.send("pong");
}

// User-route
const userRouter = Router();
userRouter.get("/", authMiddleware.protect(), getUsers);
userRouter.get("/me", authMiddleware.protect(), getUser);
userRouter.get("/all", authMiddleware.protect(), getAllUsersName);
userRouter.get("/:userID", authMiddleware.protect(), getUserByID);
userRouter.put("/:userID", authMiddleware.protect(), updateUserByID);
userRouter.put(
  "/notification/:lastname/:firstname",
  authMiddleware.protect(),
  addNotificationByFullName
);
userRouter.put(
  "/notificationKeycloakID/:id",
  authMiddleware.protect(),
  addNotificationByID
);
userRouter.post("/broadcast", authMiddleware.protect(), broadcastNotification);
userRouter.post("/friends", authMiddleware.protect(), createFriendship);
userRouter.post("/availabilities", authMiddleware.protect(), addAvailabilities);
userRouter.post(
  "/removeAvailability",
  authMiddleware.protect(),
  removeAvailability
);
const imageUpload = multer({
  dest: "images",
});

userRouter.post(
  "/pp",
  authMiddleware.protect(),
  imageUpload.array("files"),
  uploadPP
);
userRouter.get("/pp/:filename", getPP);

// Config-route
const configRouter = Router();
configRouter.get("/", getConfig);
configRouter.put(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("admin"),
  setConfig
);
configRouter.use(mCors);

// FA-routes
const FArouter = Router();
FArouter.get("/", authMiddleware.protect(), getFAs);
FArouter.get("/count", authMiddleware.protect(), getFAsNumber);
FArouter.get("/:id", authMiddleware.protect(), getFAByCount);
FArouter.post(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  createFA
);
FArouter.put(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  setFA
);
FArouter.delete(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  deleteFA
);

// FT-routes
const FTrouter = Router();
FTrouter.get("/", authMiddleware.protect(), getAllFTs);
FTrouter.get("/count", authMiddleware.protect(), getFTsNumber);
FTrouter.get("/orga-requis/:userID", authMiddleware.protect(), myPlanning);
FTrouter.get("/orga-requis", authMiddleware.protect(), getOrgaRequis);
FTrouter.get("/:FTID([0-9]+)", authMiddleware.protect(), getFTByID);
FTrouter.post(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  createFT
);
FTrouter.put(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  updateFT
);
FTrouter.put(
  "/unassign",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("humain"),
  unassign
);
FTrouter.post(
  "/:count/ready",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("humain"),
  makeFTReady
);
FTrouter.delete(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  deleteFT
);

// Equipment-routes
const equipmentRouter = Router();
equipmentRouter.get(
  "/",
  authMiddleware.protect(),
  EquipmentHandler.getEquipment
);
equipmentRouter.put(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  EquipmentHandler.setEquipment
);
equipmentRouter.post(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  EquipmentHandler.createEquipment
);

const equipmentProposalRouter = Router();
equipmentProposalRouter.get(
  "/",
  authMiddleware.protect(),
  EquipmentHandler.getEquipmentProposals
);
equipmentProposalRouter.post(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  EquipmentHandler.createEquipmentProposal
);
equipmentProposalRouter.delete(
  "/:id",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  EquipmentHandler.deleteEquipmentProposal
);
equipmentProposalRouter.put(
  "/:id/validate",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  EquipmentHandler.validateEquipmentProposal
);

// Availabilities routes
const timeslotRouter = Router();
timeslotRouter.get("/", authMiddleware.protect(), TimeslotHandler.getTimeslot);
timeslotRouter.post(
  "/",
  authMiddleware.protect(),
  TimeslotHandler.createTimeslot
);
timeslotRouter.put(
  "/",
  authMiddleware.protect(),
  TimeslotHandler.updateTimeslot
);
timeslotRouter.get(
  "/:id",
  authMiddleware.protect(),
  TimeslotHandler.getTimeslotById
);
timeslotRouter.post(
  "/many",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TimeslotHandler.createManyTimeslots
);
timeslotRouter.put(
  "/:id/:charisma",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TimeslotHandler.updateTimeslotCharisma
);
timeslotRouter.delete(
  "/:id",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TimeslotHandler.deleteTimeslot
);
timeslotRouter.delete(
  "/groupTitle/:groupTitle",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TimeslotHandler.deleteManyTimeslotsByGroupTitle
);
// Transactions routes

// const assignmentRouter = Router();
// assignmentRouter.get(
//   "/",
//   authMiddleware.protect(),
//   AssignmentHandlers.getAssignments
// );
// assignmentRouter.post(
//   "/",
//   authMiddleware.protect(),
//   AssignmentHandlers.createAssignment
// );
// assignmentRouter.put(
//   "/",
//   authMiddleware.protect(),
//   AssignmentHandlers.updateAssignment
// );
// assignmentRouter.get(
//   "/user/:id",
//   authMiddleware.protect(),
//   AssignmentHandlers.getAssignmentsByUserId
// );
// assignmentRouter.get(
//   "/ft/:id",
//   authMiddleware.protect(),
//   AssignmentHandlers.getAssignmentsByFTId
// );

const transactionRouter = Router();
transactionRouter.get(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.getAllTransactions
);
transactionRouter.get(
  "/sg",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.getSgTransactions
);
transactionRouter.get(
  "/user",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.getSelfTransactions
);
transactionRouter.get(
  "/user/:userID",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.getUserTransactions
);
transactionRouter.post(
  "/sg",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("admin"),
  TransactionHandlers.addSgTransactions
);
transactionRouter.post(
  "/transfer",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.addTransfer
);
transactionRouter.delete(
  "/:id",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TransactionHandlers.deleteTransaction
);

const conflictRouter = Router();

conflictRouter.get(
  "/",
  authMiddleware.protect(),
  ConflictHandlers.getTFConflicts
);
conflictRouter.get(
  "/all",
  authMiddleware.protect(),
  ConflictHandlers.getConflicts
);
conflictRouter.get(
  "/computeAll",
  authMiddleware.protect(),
  ConflictHandlers.computeAllConflicts
);
conflictRouter.get(
  "/user/:id",
  authMiddleware.protect(),
  ConflictHandlers.getConflictsByUserId
);
conflictRouter.get("/detectAll", ConflictHandlers.detectAllTFConflictsHandler);

const TFConflictRouter = Router();
TFConflictRouter.get(
  "/",
  authMiddleware.protect(),
  ConflictHandlers.getTFConflicts
);

TFConflictRouter.get(
  "/:FTCount",
  authMiddleware.protect(),
  ConflictHandlers.getTFConflictsByFTCount
);

const locationRouter = Router();
locationRouter.get(
  "/",
  authMiddleware.protect(),
  LocationHandlers.getLocations
);
locationRouter.post(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  LocationHandlers.createLocation
);
locationRouter.put(
  "/",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  LocationHandlers.setLocation
);
locationRouter.delete(
  "/:id",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  LocationHandlers.deleteLocation
);
locationRouter.get(
  "/:id",
  authMiddleware.protect(),
  LocationHandlers.getLocationById
);
locationRouter.post(
  "/many",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  LocationHandlers.createManyLocations
);

// Timespan routes
const timespanRouter = Router();
timespanRouter.get(
  "/",
  authMiddleware.protect(),
  TimeSpanHandlers.getAllTimeSpan
);
timespanRouter.get(
  "/:id",
  authMiddleware.protect(),
  TimeSpanHandlers.getTimeSpanById
);
timespanRouter.get(
  "/user/:id",
  authMiddleware.protect(),
  TimeSpanHandlers.getTimeSpanByAssigned
);
timespanRouter.get(
  "/available/:userId",
  authMiddleware.protect(),
  TimeSpanHandlers.getAvailableTimeSpan
);
timespanRouter.post(
  "/:id/assigned/:userId",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  TimeSpanHandlers.assignUserToTimeSpan
);
timespanRouter.post(
  "/:id/unassign",
  authMiddleware.protect(),
  TimeSpanHandlers.unassignUserFromTimeSpan
);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/user", userRouter);
baseRouter.use("/config", configRouter);
baseRouter.use("/FA", FArouter);
baseRouter.use("/FT", FTrouter);
baseRouter.use("/equipment/proposal", equipmentProposalRouter);
baseRouter.use("/equipment", equipmentRouter);
baseRouter.use("/timeslot", timeslotRouter);
baseRouter.use("/transaction", transactionRouter);
// baseRouter.use("/assignment", assignmentRouter);
baseRouter.use("/location", locationRouter);
baseRouter.use("/conflict", conflictRouter);
baseRouter.use("/conflict/ft", TFConflictRouter);
baseRouter.use("/timespan", timespanRouter);
baseRouter.get("/passsecu", authMiddleware.protect(), authMiddleware.verifyRoles("hard"), getPassSecu);

baseRouter.post("/issue", issueHandler);

//auth
baseRouter.post("/signup", AuthHandlers.signup);
baseRouter.post("/login", AuthHandlers.login);
baseRouter.post("/migrate", AuthHandlers.migrate);
baseRouter.post("/forgot", AuthHandlers.forgot);
baseRouter.post("/reset", AuthHandlers.recoverPassword);

baseRouter.get("/test", authMiddleware.protect(), (req, res) => {
  res.status(200).json({ msg: "it wooooorks !" });
});

baseRouter.get(
  "/testRoles",
  authMiddleware.protect(),
  authMiddleware.verifyRoles("hard"),
  (req, res) => {
    res.status(200).json({ msg: "it wooooorks !" });
  }
);

// ping
baseRouter.get("/ping", authMiddleware.protect(), ping);

baseRouter.use(mCors);

export default baseRouter;
