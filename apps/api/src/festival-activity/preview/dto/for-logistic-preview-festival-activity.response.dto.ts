import { ApiProperty } from "@nestjs/swagger";
import {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  drives,
} from "@overbookd/festival-event";
import { LogisticInquiry, PreviewForLogistic } from "@overbookd/http";
import { TimeWindowResponseDto } from "../../common/dto/time-window.response.dto";

const statuses = [DRAFT, IN_REVIEW, VALIDATED, REFUSED];

type Gear = LogisticInquiry["gear"];
type Category = Gear["category"];
type Owner = Category["owner"];

class OwnerResponseDto implements Owner {
  @ApiProperty({
    description: "Owner team name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Owner team code",
    type: String,
  })
  code: string;
}

class CategoryResponseDto implements Category {
  @ApiProperty({
    description: "Category name",
    type: String,
  })
  name: Category["name"];

  @ApiProperty({
    description: "Category path",
    type: String,
  })
  path: Category["path"];

  @ApiProperty({
    description: "Category identifier",
    type: Number,
  })
  id: Category["id"];

  @ApiProperty({
    description: "Category owner details",
    type: OwnerResponseDto,
  })
  owner: Category["owner"];
}

class GearResponseDto implements Gear {
  @ApiProperty({
    description: "Gear identifier",
    type: Number,
  })
  id: Gear["id"];

  @ApiProperty({
    description: "Define if gear is used ponctually",
    type: Boolean,
  })
  isPonctualUsage: Gear["isPonctualUsage"];

  @ApiProperty({
    description: "Define if gear is consumed after it usage",
    type: Boolean,
  })
  isConsumable: Gear["isConsumable"];

  @ApiProperty({
    description: "Gear category details",
    type: CategoryResponseDto,
  })
  category: Gear["category"];
}

class LogisticInquiryResponseDto implements LogisticInquiry {
  @ApiProperty({
    description: "Inquiry gear slug",
    type: String,
  })
  slug: LogisticInquiry["slug"];

  @ApiProperty({
    description: "Inquiry gear quantity",
    type: Number,
  })
  quantity: LogisticInquiry["quantity"];

  @ApiProperty({
    description: "Inquiry gear name",
    type: String,
  })
  name: LogisticInquiry["name"];

  @ApiProperty({
    description: "Define where gear will be picked up",
    enum: drives,
  })
  drive: LogisticInquiry["drive"];

  @ApiProperty({
    description: "Gear details",
    type: GearResponseDto,
  })
  gear: LogisticInquiry["gear"];
}

export class PreviewForLogisticResponseDto implements PreviewForLogistic {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: PreviewForLogistic["id"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: PreviewForLogistic["name"];

  @ApiProperty({
    description: "The festival activity status",
    enum: statuses,
  })
  status: PreviewForLogistic["status"];

  @ApiProperty({
    description: "The festival activity rental time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: PreviewForLogistic["timeWindows"];

  @ApiProperty({
    description: "The festival activity rental gears",
    type: LogisticInquiryResponseDto,
    isArray: true,
  })
  inquiries: PreviewForLogistic["inquiries"];
}
