import { ApiProperty } from "@nestjs/swagger";

export class FriendResponseDto {
    @ApiProperty({
        required: true,
        description: 'The id of the Friend',
        type: Number,
    })
    id: number;
    
    @ApiProperty({
        required: true,
        description: 'The firstname of the Friend',
        type: String,
    })
    firstname: string;

    @ApiProperty({
        required: true,
        description: 'The lastname of the Friend',
        type: String,
    })
    lastname: string;
}