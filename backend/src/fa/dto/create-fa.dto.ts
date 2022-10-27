import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

export class CreateFaDto {
  @ApiProperty({
    required: true,
    description: 'The name of the fa',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The creation date of the fa',
  })
  created_at: Date;

  @ApiProperty({
    required: true,
    description: 'The type of the fa',
  })
  type: string;

  @ApiProperty({
    required: true,
    description: 'The id of the team whos responsible of the fa',
  })
  team_id: number;

  @ApiProperty({
    required: true,
    description: 'The id of the user who is responsible of the fa',
  })
  in_charge: number;

  @ApiProperty({
    required: true,
    description: 'The id of the location of the fa',
  })
  location_id: number;

  @ApiProperty({
    required: true,
    description: 'The status of the fa',
    enum: [Status.DRAFT, Status.SUBMITTED, Status.VALIDATED, Status.REFUSED],
  })
  status: Status;

  @ApiProperty({
    required: true,
    description: 'The description of the fa',
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Is the activity publishable on the website',
  })
  is_publishable: boolean;

  @ApiProperty({
    required: true,
    description: 'Is the activty a major activity',
  })
  is_major: boolean;

  @ApiProperty({
    required: true,
    description: 'Is the activity for kids',
  })
  is_kids: boolean;

  @ApiProperty({
    required: false,
    description: 'The id of the users who validated the fa',
  })
  validated_by: number[];

  @ApiProperty({
    required: false,
    description: 'The id of the users who refused the fa',
  })
  refused_by: number[];

  @ApiProperty({
    required: false,
    description: 'The security needs',
  })
  security_needs: string;

  @ApiProperty({
    required: false,
    description: 'All of the collaborators ids',
  })
  collaborator_id: number[];

  @ApiProperty({
    required: false,
    description: 'The waterflow needed',
  })
  waterflow_required: number;
}
