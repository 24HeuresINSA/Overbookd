import { ContractorNotFound } from "../../festival-activity.error";
import {
  PrepareContractorCreation,
  PrepareContractorUpdate,
} from "../prepare-festival-activity.model";
import { Contractor } from "../../sections/in-charge";
import { updateItemToList } from "@overbookd/list";

export class Contractors {
  private constructor(private readonly contractors: Contractor[]) {}

  get entries(): Contractor[] {
    return this.contractors;
  }

  static build(contractors: Contractor[]): Contractors {
    return new Contractors(contractors);
  }

  add(form: PrepareContractorCreation): Contractors {
    const id = this.generateContractorId();
    const contractor = {
      ...form,
      id,
      email: form.email ?? null,
      company: form.company ?? null,
      comment: form.comment ?? null,
    };

    return new Contractors([...this.contractors, contractor]);
  }

  update(contractor: PrepareContractorUpdate): Contractors {
    const currentContractorIndex = this.contractors.findIndex(
      (c) => c.id === contractor.id,
    );
    const currentContractor = this.contractors.at(currentContractorIndex);
    if (currentContractorIndex === -1 || !currentContractor) {
      throw new ContractorNotFound();
    }

    const updatedContractor = this.generateUpdatedContractor(
      currentContractor,
      contractor,
    );

    const contractors = updateItemToList(
      this.contractors,
      currentContractorIndex,
      updatedContractor,
    );
    return new Contractors(contractors);
  }

  remove(id: Contractor["id"]): Contractors {
    return new Contractors(this.contractors.filter((c) => c.id !== id));
  }

  private generateContractorId(): Contractor["id"] {
    const lastContractorId = this.contractors.at(-1)?.id ?? 0;
    return lastContractorId + 1;
  }

  private generateUpdatedContractor(
    previousContractor: Contractor,
    form: PrepareContractorUpdate,
  ): Contractor {
    const updatedContractor = {
      ...previousContractor,
      firstname: form.firstname ?? previousContractor.firstname,
      lastname: form.lastname ?? previousContractor.lastname,
      phone: form.phone ?? previousContractor.phone,
      email: form.email === undefined ? previousContractor.email : form.email,
      company:
        form.company === undefined ? previousContractor.company : form.company,
      comment:
        form.comment === undefined ? previousContractor.comment : form.comment,
    };

    return updatedContractor;
  }
}
