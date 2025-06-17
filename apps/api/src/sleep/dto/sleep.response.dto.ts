import { ApiProperty } from "@nestjs/swagger";
import {
  EmptyBed,
  Room,
  OccupiedBed,
  Sleeper,
  AboutBed,
} from "@overbookd/sleep";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

class RoomResponseDto implements Room {
  @ApiProperty()
  label: string;
}

class SleeperResponseDto implements Sleeper {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  comment?: string;

  @ApiProperty({ type: Date })
  wakeupTime: Date;
}

class AboutBedResponseDto implements AboutBed {
  @ApiProperty({ type: RoomResponseDto })
  @Type(() => RoomResponseDto)
  @ValidateNested()
  room: Room;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class EmptyBedResponseDto implements EmptyBed {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: AboutBedResponseDto })
  @Type(() => AboutBedResponseDto)
  @ValidateNested()
  bed: AboutBedResponseDto;
}

export class OccupiedBedResponseDto
  extends EmptyBedResponseDto
  implements OccupiedBed
{
  @ApiProperty({ type: SleeperResponseDto })
  sleeper: Sleeper;
}

export type BedResponseDto = OccupiedBedResponseDto | EmptyBedResponseDto;
