import {Body, Controller, Get, Param, Put} from "@nestjs/common";
import {UserService} from "./user.service";
import {User} from "@prisma/client";


@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('user')
    getUsers(): Promise<User[]> {
        return this.userService.users({});
    }

    @Put('user/:id')
    updateUserById(
        @Param('id') id: number,
        @Body() userData: Partial<User>
    ): Promise<User> {
        return this.userService.updateUser({
                where: {id: Number(id)},
                data: userData
            }
        )
    }


}
