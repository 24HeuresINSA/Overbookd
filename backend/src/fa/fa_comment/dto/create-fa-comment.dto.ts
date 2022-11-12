import {IsEnum, IsInt, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

enum SUBJECT_TYPE {
    COMMENT = 'COMMENT',
    VALIDATED = 'VALIDATED',
    REFUSED = 'REFUSED',
}

export class CreateFaCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The content of the comment',
    })
    comment: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(Object.keys(SUBJECT_TYPE))
    @ApiProperty({
        required: true,
        description: 'The subject of the comment',
    })
    subject: SUBJECT_TYPE;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The id of the author of the comment',
    })
    author: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'The id of the team of the author of the comment',
    })
    team_id: number;
}