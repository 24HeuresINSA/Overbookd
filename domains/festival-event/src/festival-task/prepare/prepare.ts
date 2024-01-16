import { FestivalTask } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";

type UpdateGeneral = {
  name?: FestivalTask["general"]["name"];
  administrator?: FestivalTask["general"]["administrator"];
  team?: FestivalTask["general"]["team"];
};

type UpdateInstructions = {
  appointment?: FestivalTask["instructions"]["appointment"];
  global?: FestivalTask["instructions"]["global"];
  inCharge?: FestivalTask["instructions"]["inCharge"]["instruction"];
};

export type FestivalTasksForPrepare = {
  findById(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
  save(task: FestivalTask): Promise<FestivalTask>;
};

export class PrepareFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForPrepare) {}

  async updateGeneralSection(
    taskId: FestivalTask["id"],
    update: UpdateGeneral,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const general = { ...task.general, ...update };
    return this.festivalTasks.save({ ...task, general });
  }

  async updateInstructionsSection(
    taskId: FestivalTask["id"],
    update: UpdateInstructions,
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const builder = Instructions.build(task.instructions);
    const instructions = builder.update(update).json;
    return this.festivalTasks.save({ ...task, instructions });
  }
}

class Instructions {
  private constructor(
    private readonly instructions: FestivalTask["instructions"],
  ) {}
  static build(instructions: FestivalTask["instructions"]) {
    return new Instructions(instructions);
  }

  update({ inCharge, ...form }: UpdateInstructions) {
    const inChargeBuilder = InCharge.build(this.instructions.inCharge);
    const updatedInCharge = inChargeBuilder.update(inCharge).json;

    return new Instructions({
      ...this.instructions,
      ...form,
      inCharge: updatedInCharge,
    });
  }

  get json(): FestivalTask["instructions"] {
    return { ...this.instructions };
  }
}

class InCharge {
  private constructor(
    private readonly inCharge: FestivalTask["instructions"]["inCharge"],
  ) {}

  static build(inCharge: FestivalTask["instructions"]["inCharge"]) {
    return new InCharge(inCharge);
  }

  update(instruction: UpdateInstructions["inCharge"]) {
    if (instruction === undefined) return this;
    return new InCharge({ ...this.inCharge, instruction });
  }

  get json(): FestivalTask["instructions"]["inCharge"] {
    return { ...this.inCharge };
  }
}
