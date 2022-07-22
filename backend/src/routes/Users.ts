import StatusCodes from "http-status-codes";
import { Request, RequestHandler } from "express";
import logger from "@shared/Logger";
import path from "path";
import * as fs from "fs";
import { Types } from "mongoose";
import UserService from "@services/UserService";
import TimeslotService from "@services/TimeslotService";

export const getUsers: RequestHandler = async function (req, res) {
  const users = await UserService.findAll();
  return res.json(users);
};

export const getUser: RequestHandler = async function (req, res) {
  return res.json(res.locals.auth_user);
};

export const getUserByID: RequestHandler = async function (req, res) {
  const _id = req.params.userID;
  const user = await UserService.findById(_id);
  if (user) {
    res.json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "User not found",
    });
  }
};

export const updateUserByID: RequestHandler = async function (req, res) {
  const user = await UserService.update(req.params.userID, req.body);
  if (user) {
    res.json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "User not found",
    });
  }
};

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const getAllUsersName: RequestHandler = async function (req, res) {
  const users = await UserService.findAll();
  res.json(
    users.map((user) => {
      return {
        _id: user._id,
        username: `${capitalizeFirstLetter(
          user.firstname
        )} ${user.lastname.toUpperCase()}`,
      };
    })
  );
};

export const getAllUsernamesWithCP: RequestHandler = async function (req, res) {
  const users = await UserService.getAllUsersWithCP();
  res.json(
    users.map((user) => {
      return {
        _id: user._id,
        username: `${capitalizeFirstLetter(
          user.firstname
        )} ${user.lastname.toUpperCase()}`,
      };
    })
  );
};

export const addAvailabilities: RequestHandler = async function (req, res) {
  const id = res.locals.auth_user._id;
  const timeslotIds: Types.ObjectId[] = req.body;
  try {
    const user = await UserService.findById(id);
    let totalCharisma = 0;
    if (user) {
      if (user.availabilities) {
        const toAdd = timeslotIds.filter((e) => {
          return !user.availabilities!.includes(e);
        });
        const timeslot = await TimeslotService.findManyByIds(toAdd);
        totalCharisma = timeslot.reduce((acc, cur) => acc + cur.charisma, 0);
        user.availabilities.push(...toAdd);
      } else {
        const timeslot = await TimeslotService.findManyByIds(timeslotIds);
        totalCharisma = timeslot.reduce((acc, cur) => acc + cur.charisma, 0);
        user.availabilities = timeslotIds;
      }
      if (user.charisma) {
        0;
        user.charisma += totalCharisma;
      } else {
        user.charisma = totalCharisma;
      }
      if (!user.notifications) {
        user.notifications = [];
      }
      user.notifications.push({
        type: "broadcast",
        message: `Tu as reçu ${totalCharisma} points de charisme pour ta disponibilité.`,
        date: new Date(),
        team: "hard",
        link: "",
      });
      await UserService.save(user);
      res.status(StatusCodes.OK).json(user);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND).json({
        msg: "User not found",
      });
    }
  } catch (e) {
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error, contact your admin",
    });
  }
};

export const addAvailabilityToUser: RequestHandler = async function (req, res) {
  const id = req.body.userID;
  const timeslotId = req.body.timeslotID;
  const timeslotIds = [timeslotId];
  try {
    const user = await UserService.findById(id);
    let totalCharisma = 0;
    if (user) {
      if (user.availabilities) {
        const toAdd = timeslotIds.filter((e) => {
          return !user.availabilities!.includes(e);
        });
        const timeslot = await TimeslotService.findManyByIds(timeslotIds);
        totalCharisma = timeslot.reduce((acc, cur) => acc + cur.charisma, 0);
        user.availabilities.push(...toAdd);
      } else {
        const timeslot = await TimeslotService.findManyByIds(timeslotIds);
        totalCharisma = timeslot.reduce((acc, cur) => acc + cur.charisma, 0);
        user.availabilities = timeslotIds;
      }
      if (user.charisma) {
        user.charisma += totalCharisma;
      } else {
        user.charisma = totalCharisma;
      }
      if (!user.notifications) {
        user.notifications = [];
      }
      user.notifications.push({
        type: "broadcast",
        message: `Tu as reçu ${totalCharisma} points de charisme pour ta disponibilité.`,
        date: new Date(),
        team: "hard",
        link: "",
      });
      await UserService.save(user);
      res.status(StatusCodes.OK).json(user);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND).json({
        msg: "User not found",
      });
    }
  } catch (e) {
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error, contact your admin",
    });
  }
};

export const removeAvailability: RequestHandler = async function (req, res) {
  const id = req.body.userID;
  const timeslotId = req.body.timeslotID;
  try {
    const user = await UserService.findById(id);
    let charismaToRemove = 0;
    if (user) {
      if (user.availabilities) {
        const index = user.availabilities.indexOf(timeslotId);
        user.availabilities.splice(index, 1);
        const deletedTimeslot = [await TimeslotService.findById(timeslotId)];
        charismaToRemove = deletedTimeslot.reduce(
          (acc, cur) => acc + cur.charisma,
          0
        );
      }
      if (user.charisma) {
        user.charisma -= charismaToRemove;
      }
      await UserService.save(user);
      res.json(user);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND).json({
        msg: "User not found",
      });
    }
  } catch (e) {
    logger.err(e);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error, contact your admin",
    });
  }
};

export const addNotificationByID: RequestHandler = async function (req, res) {
  const query = req.params;
  if (!query.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide id" });
  } else {
    const user = await UserService.findById(query.id);
    if (user) {
      const mUser = user;
      if (mUser.notifications === undefined) {
        mUser.notifications = [];
      }
      mUser.notifications.push(req.body);

      await UserService.update(user._id, {
        notifications: mUser.notifications,
      });
      res.sendStatus(StatusCodes.OK);
    } else {
      res
        .sendStatus(StatusCodes.NOT_FOUND)
        .json({ msg: "Did not find the user" });
    }
  }
};

export const broadcastNotification: RequestHandler = async function (req, res) {
  const users = await UserService.findAll();
  await Promise.all(
    users.map(async (user) => {
      const mUser = user;
      if (mUser.notifications === undefined) {
        mUser.notifications = [];
      }
      mUser.notifications.push(req.body);
      await UserService.update(mUser._id, {
        notifications: mUser.notifications,
      });
    })
  );
  res.sendStatus(StatusCodes.OK);
};

export const uploadPP: RequestHandler = async function (req: Request, res) {
  const id = res.locals.auth_user._id;
  const user = await UserService.findById(id);
  if (user) {
    const oldUser = user;
    if (oldUser.pp) {
      const filename = oldUser.pp;
      const dirname = path.resolve();
      if (fs.existsSync(`${dirname}/images/${filename}`)) {
        fs.unlinkSync(`${dirname}/images/${filename}`);
        logger.info(`deleted ${filename} 🗑`);
      }
    }
    await UserService.update(id, {
      pp: (req as any).files[0].filename,
    });
    logger.info("pp updated");

    res.json("/image api");
  }
};

export const getPP: RequestHandler = async function (req, res) {
  const filename = req.params.filename;
  const dirname = path.resolve();
  logger.info("getting image " + filename);
  return res.sendFile(`${dirname}/images/${filename}`);
};

interface friendRequest {
  from: string;
  to: {
    id: string;
    username: string;
  };
}

//todo
/* To rework
export const createFriendship: RequestHandler = async function (req, res) {
  // check if
  const friends = <friendRequest>req.body;

  logger.info("creating friendships ❤️ " + friends + " ...");

  const [fromUser, toUser] = await Promise.all([
    UserModel.findById(friends.from),
    UserModel.findById(friends.to.id),
  ]);

  if (fromUser && toUser) {
    const MFromUser = <IUser>fromUser.toObject();
    const MToUser = <IUser>toUser.toObject();

    let mFriends: { id: string; username: string }[] = [];
    const notifications = MFromUser.notifications;
    notifications?.shift();
    if (MFromUser.friends) {
      // @ts-ignore
      mFriends = MFromUser.friends;
    }
    mFriends.push(friends.to);
    // @ts-ignore
    await UserModel.findByIdAndUpdate(friends.from, {
      friends: mFriends,
      notifications,
    });

    mFriends = [];
    if (MToUser.friends) {
      // @ts-ignore
      mFriends = MToUser.friends;
    }
    mFriends.push({
      username: `${capitalizeFirstLetter(
        MFromUser.firstname
      )} ${MFromUser.lastname.toUpperCase()}`,
      // @ts-ignore
      id: MFromUser._id,
    });

    // @ts-ignore
    await UserModel.findByIdAndUpdate(friends.to.id, {
      friends: mFriends,
    });
  }

  return res.sendStatus(200);
};*/
