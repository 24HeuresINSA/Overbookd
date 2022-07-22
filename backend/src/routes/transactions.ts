import logger from "@shared/Logger";
import { RequestHandler } from "express";
import { Transaction } from "../entities/transaction";
import UserService from "@services/UserService";
import TransactionService from "@services/TransactionService";
// GET

export const getAllTransactions: RequestHandler = async function (
  req,
  res,
  next
) {
  let data;
  try {
    data = await TransactionService.findAll();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next();
  }
  res.json(data);
};

export const getSgTransactions: RequestHandler = async function (req, res) {
  let data;
  try {
    data = await TransactionService.findAllSg();
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

export const getSelfTransactions: RequestHandler = async function (
  req,
  res,
  next
) {
  let data;
  try {
    const user = res.locals.auth_user;
    data = await TransactionService.findAllByUserId(user._id);
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
    next(error);
  }
  res.json(data);
};

export const getUserTransactions: RequestHandler = async function (req, res) {
  const _id = req.params.userID;
  let data;
  try {
    const mUser = await UserService.findById(_id);
    if (mUser) {
      data = await TransactionService.findAllByUserId(mUser._id);
    } else {
      throw new Error();
    }
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

// POST

export const addSgTransactions: RequestHandler = async function (req, res) {
  const newTransactions: Transaction[] = req.body;
  let data;
  try {
    data = await TransactionService.create(newTransactions);
    await Promise.all(newTransactions.map(updateUsersBalance));
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};

async function updateUserBalanceByID(
  _id: null | string,
  amount: number
): Promise<void> {
  if (_id) {
    const user = await UserService.findById(_id);
    if (user) {
      if (user.balance === undefined) {
        user.balance = 0;
      }
      if (isNaN(user.balance + amount)) {
        logger.err(`can't update balance ${user.balance} by ${amount}`);
      }
      user.balance = user.balance + amount;
      UserService.save(user);
    }
  }
}

async function updateUsersBalance(transfer: Transaction): Promise<void> {
  await updateUserBalanceByID(transfer.from, -transfer.amount);
  await updateUserBalanceByID(transfer.to, +transfer.amount);
}

export const addTransfer: RequestHandler = async function (req, res) {
  const transfer = req.body;
  const user = res.locals.auth_user;
  let data;
  try {
    // check type
    if (!transfer || transfer.type !== "transfer") {
      return res.status(403).send("wrong type");
    }

    if (user._id.toString() !== transfer.from) {
      // check user identity
      logger.info(`user ${user._id} not matching token ${transfer.from}`);
      return res.status(403).send("user not matching with token");
    }

    if (transfer.amount < 0) {
      // negative transaction
      return res.status(403).send("negative amounts are forbidden");
    }
    logger.info(
      `new transaction requested from ${transfer.from} to ${transfer.to} of ${transfer.amount}`
    );
    data = await TransactionService.create(transfer);
    // update user balance
    await updateUsersBalance(transfer);
  } catch (error) {
    logger.info(error);
    // handle the error
    res.sendStatus(500).end();
  }
  res.json(data);
};

// DELETE

export const deleteTransaction: RequestHandler = async function (req, res) {
  const id = req.params.id;
  let data;
  try {
    data = await TransactionService.findById(id);
    if (data) {
      data.amount = -data.amount;
      await updateUsersBalance(data);
      data.amount = -data.amount;
      data.isValid = false;
      TransactionService.save(data);
      logger.info(`disabling transaction ${id}`);
    }
  } catch (error) {
    logger.info(error);
    // handle the error
    res.status(500).end();
  }
  res.json(data);
};
