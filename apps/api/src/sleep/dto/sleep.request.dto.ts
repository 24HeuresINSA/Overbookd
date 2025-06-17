import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Room, Sleeper, AboutBed } from "@overbookd/sleep";

class RoomRequestDto implements Room {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class SleeperRequestDto implements Sleeper {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  wakeupTime: Date;
}

export class AboutBedRequestDto implements AboutBed {
  @ApiProperty({ type: RoomRequestDto })
  @Type(() => RoomRequestDto)
  @ValidateNested()
  room: Room;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class UpdateBedRequestDto {
  @ApiProperty({ type: AboutBedRequestDto })
  @ValidateNested()
  @Type(() => AboutBedRequestDto)
  bed: AboutBedRequestDto;

  @ApiPropertyOptional({ type: SleeperRequestDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => SleeperRequestDto)
  sleeper?: SleeperRequestDto;
}
