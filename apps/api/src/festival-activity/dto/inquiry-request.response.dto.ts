import { ApiProperty } from "@nestjs/swagger";
import {
  BACKLINE,
  BENNE_COLLETTE_BESSON,
  BENNE_PARKING_K_FET,
  BaseInquiryRequest,
  CAVE_E,
  CLUB_ROCK,
  CONTENEUR_KARNA,
  CONTENEUR_PARKING_K_FET,
  CONTENEUR_SCENE_ROOTS,
  CONTENUR_24H,
  CREUX_GCU,
  CREUX_GM,
  Drive,
  HALL_DES_HUMANITES,
  InquiryRequest,
  LIVRE_PAR_COM,
  LIVRE_PAR_LOGISTIQUE,
  LOCAL_24H,
  MAGASIN,
  MDE,
  NON_STOCKE,
  PARKING_EIFFEL,
  QG_ORGA,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
} from "@overbookd/festival-activity";

export class UnassignedInquiryRequestResponseDto implements BaseInquiryRequest {
  @ApiProperty({})
  slug: string;

  @ApiProperty({})
  quantity: number;

  @ApiProperty({})
  name: string;
}

type InquiryRequestAssigned = Extract<InquiryRequest, { drive: Drive }>;

const drives: Drive[] = [
  BENNE_COLLETTE_BESSON,
  BENNE_PARKING_K_FET,
  PARKING_EIFFEL,
  CREUX_GCU,
  CREUX_GM,
  CAVE_E,
  CLUB_ROCK,
  CONTENUR_24H,
  CONTENEUR_KARNA,
  CONTENEUR_PARKING_K_FET,
  CONTENEUR_SCENE_ROOTS,
  HALL_DES_HUMANITES,
  LOCAL_24H,
  MAGASIN,
  MDE,
  SALLE_MONTREAL,
  SALLE_RENE_CHAR,
  NON_STOCKE,
  QG_ORGA,
  BACKLINE,
  LIVRE_PAR_LOGISTIQUE,
  LIVRE_PAR_COM,
];

export class AssignedInquiryRequestResponseDto
  extends UnassignedInquiryRequestResponseDto
  implements InquiryRequestAssigned
{
  @ApiProperty({ required: true, enum: drives, example: MAGASIN, type: String })
  drive: Drive;
}
