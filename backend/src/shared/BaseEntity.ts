import {
  isDocument,
  ModelOptions,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Model, Types } from "mongoose";

@ModelOptions({
  schemaOptions: {
    timestamps: { updatedAt: "modifiedAt" },
    toObject: { virtuals: true },
  },
})
export class BaseEntity implements Base {
  @prop()
  _id: Types.ObjectId;

  @prop()
  id: string;

  @prop()
  public modifiedAt!: Date;

  @prop()
  public createdAt!: Date;
}

export abstract class BaseEntityService<T extends BaseEntity> {
  protected abstract model: any;

  public async findAll(): Promise<T[]> {
    return this.model.find();
  }

  public async findById(id: string | Types.ObjectId): Promise<T> {
    const entity = await this.model.findById(id);
    if (!entity) {
      throw new Error(`Entity not found for id: ${id}`);
    }
    return entity;
  }

  public async findManyByIds(ids: string[] | Types.ObjectId[]): Promise<T[]> {
    const entities = await this.model.find({ _id: { $in: ids } });
    if (entities.length !== ids.length) {
      throw new Error("Entities not found");
    }
    return entities;
  }

  public async save(entity: T): Promise<void> {
    if (isDocument(entity)) {
      console.log(entity);
      await entity.save();
      return;
    } else {
      throw new Error("Entity is not a document");
    }
  }

  public async create(entity: T | T[]): Promise<T> {
    return this.model.create(entity);
  }

  public async update(
    id: string | Types.ObjectId,
    entity: Partial<T>
  ): Promise<T> {
    const updatedEntity = await this.model.findByIdAndUpdate(id, entity, {
      new: true,
    });
    if (!updatedEntity) {
      throw new Error("Entity not found");
    }
    return updatedEntity;
  }

  public async delete(id: string | Types.ObjectId): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
