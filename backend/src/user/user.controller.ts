import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { RequestWithUserPayload } from 'src/app.controller';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';
import { UserService, UserWithoutPassword } from './user.service';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }




  @Post()
  @ApiBody({
    description: 'Add new user',
    type: UserCreationDto,
  })
  createUser(@Body() userData: UserCreationDto): Promise<UserWithoutPassword> {
    return this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('validated-user')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: Array,
  })
  getUsers(): Promise<Partial<User>[]> {
    return this.userService.users({});
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get a current user',
  })
  async getCurrentUser(
    @Request() req: RequestWithUserPayload,
  ): Promise<UserWithoutPassword> {
    return this.userService.user({ id: req.user.userId ?? req.user.id });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('cp')
  @ApiBearerAuth()
  @Get('all/cp')
  @ApiResponse({
    status: 200,
    description: 'Get all usernames with valid CP',
    type: Array,
  })
  async getUsernamesWithValidCP(): Promise<Username[]> {
    const users = await this.userService.users({
      where: {
        team: {
          some: {
            team: {
              permissions: {
                some: {
                  permission: {
                    name: 'cp',
                  },
                },
              },
            },
          },
        },
      },
      select: {
        firstname: true,
        lastname: true,
        id: true,
      },
    });
    return users
      .map(this.userService.getUsername)
      .sort((a, b) => (a.username > b.username ? 1 : -1));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-cp')
  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all usernames',
    type: Array,
  })
  async getAllUsernames(): Promise<Username[]> {
    const users = await this.userService.users({
      select: {
        firstname: true,
        lastname: true,
        id: true,
      },
    });
    return users.map(this.userService.getUsername);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserWithoutPassword> {
    return this.userService.user({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Post('availabilities')
  @ApiBody({
    description: 'Add availabilities to current user',
    type: Array,
  })
  addAvailabilitiesToCurrentUser(
    @Body('availabilities') availabilities: number[],
  ): Promise<User> {
    return null;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Put(':id')
  @ApiBody({
    description: 'Update a user by id',
    type: UserModificationDto,
  })
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<User>,
    @Request() req: Express.Request,
  ): Promise<UserWithoutPassword> {
    return this.userService.updateUser(
      {
        where: { id: Number(id) },
        data: userData,
      },
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Post('pp')
  @UseInterceptors(FileInterceptor('files', {
    storage: diskStorage({
      destination: __dirname + '/../../../public',
      filename: (req, file, cb) => {
        const filename: string = file.originalname.split('.')[0] + '-' + Date.now();
        const extension: string = file.originalname.split('.')[1];
        cb(null, `${filename}-${Date.now()}.${extension}`);
      }
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add a profile picture to a user',
    type: UserModificationDto,
  })
  async(
    @Body('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserWithoutPassword> {
    return this.userService.uploadPP({ id: Number(id) }, file.filename);
  }

  @Get('pp/:name')
  @ApiResponse({
    status: 200,
    description: 'Get a users pp',
    type: StreamableFile,
  })
  getPP(
    @Param('name') name: string,
  ): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'public', name));
    return new StreamableFile(file);
  }
}