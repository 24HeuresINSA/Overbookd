import { IProvidePeriod } from "@overbookd/time";
import {
  Assignment,
  Contact,
  Task,
  Volunteer,
  AppointmentLocation,
} from "../domain/task.model";
import { ApiProperty } from "@nestjs/swagger";
import { GeoLocation } from "@overbookd/geo-location";
import { PeriodResponseDto } from "../../../common/dto/period.response.dto";
import { ToPrintTask } from "../domain/storedTask";

class VolunteerRepresentation implements Volunteer {
  @ApiProperty({
    name: "id",
    description: "volunteer id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: "name",
    description: "volunteer name",
    type: String,
  })
  name: string;
}

class AssignmentRepresentation implements Assignment {
  @ApiProperty({
    name: "period",
    description: "period volunteers are assigned",
    type: PeriodResponseDto,
  })
  period: IProvidePeriod;

  @ApiProperty({
    name: "volunteers",
    description: "volunteer's assigned during the period",
    type: VolunteerRepresentation,
    isArray: true,
  })
  volunteers: Volunteer[];
}

class ContactRepresentation implements Contact {
  @ApiProperty({
    name: "id",
    description: "contact id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: "name",
    description: "contact name",
    type: String,
  })
  name: string;

  @ApiProperty({
    name: "phone",
    description: "contact phone",
    type: String,
  })
  phone: string;
}

class AppointmentLocationResponseDto implements AppointmentLocation {
  @ApiProperty({
    name: "name",
    description: "appointment location name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The coordinates of the location",
    example: {
      type: "POINT",
      geoLocation: { lat: 1, lng: 2 },
    },
    required: false,
  })
  geoLocation: GeoLocation;
}

export class TaskResponseDto implements Task {
  @ApiProperty({
    name: "name",
    description: "task name",
    type: String,
  })
  name: string;

  @ApiProperty({
    name: "instructions",
    description: "task instructions",
    type: String,
  })
  instructions: string;

  @ApiProperty({
    name: "period",
    description: "task period",
    type: PeriodResponseDto,
  })
  period: IProvidePeriod;

  @ApiProperty({
    name: "location",
    description: "task location",
    type: AppointmentLocationResponseDto,
  })
  location: AppointmentLocation;

  @ApiProperty({
    name: "assignments",
    description: "other volunteers assigned during similar periods",
    type: AssignmentRepresentation,
    isArray: true,
  })
  assignments: Assignment[];

  @ApiProperty({
    name: "contacts",
    description: "task contacts",
    type: ContactRepresentation,
    isArray: true,
  })
  contacts: Contact[];
}

export class ToPrintTaskResponseDto implements ToPrintTask {
  @ApiProperty({
    name: "id",
    description: "task id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: "name",
    description: "task name",
    type: String,
  })
  name: string;

  @ApiProperty({
    name: "instructions",
    description: "task instructions",
    type: String,
  })
  instructions: string;

  @ApiProperty({
    name: "location",
    description: "task location",
    type: AppointmentLocationResponseDto,
  })
  location: AppointmentLocation;

  // @ApiProperty({
  //   name: "assignments",
  //   description: "other volunteers assigned during similar periods",
  //   type: AssignmentRepresentation,
  //   isArray: true,
  // })
  // assignments: Assignment[];

  @ApiProperty({
    name: "contacts",
    description: "task contacts",
    type: ContactRepresentation,
    isArray: true,
  })
  contacts: Contact[];
}
