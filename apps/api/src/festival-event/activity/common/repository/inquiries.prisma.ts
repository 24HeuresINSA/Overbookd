import {
  BARRIERES,
  ELEC,
  InquiryOwner,
  MATOS,
} from "@overbookd/festival-event";
import { Gear, Inquiries } from "../festival-activity-common.model";
import { PrismaService } from "../../../../prisma.service";
import { SELECT_GEAR_WITH_OWNER } from "./inquiry.query";

const owners: InquiryOwner[] = [MATOS, BARRIERES, ELEC];

type DatabaseWithOwner = {
  category: {
    ownerCode: string;
  };
};

export class PrismaInquiries implements Inquiries {
  constructor(private readonly prisma: PrismaService) {}

  async find(slug: string): Promise<Gear | null> {
    const res = await this.prisma.catalogGear.findUnique({
      where: { slug },
      select: SELECT_GEAR_WITH_OWNER,
    });
    if (!res) return null;

    const owner = retrieveOwner(res);
    return { slug: res.slug, name: res.name, owner };
  }
}

function retrieveOwner({ category }: DatabaseWithOwner): InquiryOwner {
  return owners.find((owner) => owner === category.ownerCode) ?? MATOS;
}
