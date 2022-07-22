import TransactionModel, { Transaction } from "@entities/transaction";

import { BaseEntityService } from "@shared/BaseEntity";
import { Types } from "mongoose";

class TransactionService extends BaseEntityService<Transaction> {
  model = TransactionModel;

  //We want transactions to be sorted by reverse date
  async findAll(): Promise<Transaction[]> {
    return await this.model.find({}).sort({ createdAt: -1 });
  }

  //Find transactions of type deposit or expense sorted by reverse date
  async findAllSg(): Promise<Transaction[]> {
    return await this.model
      .find({
        $or: [{ type: "deposit" }, { type: "expense" }],
      })
      .sort({ createdAt: -1 });
  }

  //Find transactions from or to userId
  async findAllByUserId(
    userId: string | Types.ObjectId
  ): Promise<Transaction[]> {
    return await this.model
      .find({
        $or: [{ from: userId }, { to: userId }],
      })
      .sort({ createdAt: -1 });
  }
}

const TransactionServiceImplementation = new TransactionService();
export default TransactionServiceImplementation;
