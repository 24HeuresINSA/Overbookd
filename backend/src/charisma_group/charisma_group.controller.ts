import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CharismaGroupService } from './charisma_group.service';
import { CharismaGroupResponseDto } from './dto/charismaGroupResponse.dto';
import { CreateCharismaGroupDto } from './dto/createCharsimaGroup.dto';
import { UpdateCharismaGroupDto } from './dto/updateCharismaGroup.dto';
@ApiBearerAuth()
@ApiTags('charisma-group')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('charisma-group')
export class CharismaGroupController {
  constructor(private readonly charismaGroupService: CharismaGroupService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('validated-user')
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all Charisma Group',
    isArray: true,
    type: CharismaGroupResponseDto,
  })
  findAll(): Promise<CharismaGroupResponseDto[]> {
    return this.charismaGroupService.findAllCharismaGroups();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('validated-user')
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get one Charisma Group',
    type: CharismaGroupResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Charisma Group id',
    type: Number,
  })
  @ApiNotFoundResponse({ description: 'Charisma Group not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CharismaGroupResponseDto> {
    return this.charismaGroupService.findOneCharismaGroup(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('affect-team')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The Charisma Group has been successfully created.',
    type: CharismaGroupResponseDto,
  })
  @ApiBody({
    description: 'Charisma Group to create',
    type: CreateCharismaGroupDto,
  })
  create(
    @Body() charismaGroup: CreateCharismaGroupDto,
  ): Promise<CharismaGroupResponseDto> {
    return this.charismaGroupService.createCharismaGroup(charismaGroup);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('affect-team')
  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The Charisma Group has been successfully updated.',
    type: CharismaGroupResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Charisma Group id',
    type: Number,
  })
  @ApiBody({
    description: 'Charisma Group to update',
    type: UpdateCharismaGroupDto,
  })
  @ApiNotFoundResponse({ description: 'Charisma Group not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() charismaGroup: UpdateCharismaGroupDto,
  ): Promise<CharismaGroupResponseDto> {
    return this.charismaGroupService.updateCharismaGroup(id, charismaGroup);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('affect-team')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The Charisma Group has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'Charisma Group id',
    type: Number,
  })
  @ApiNotFoundResponse({ description: 'Charisma Group not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.charismaGroupService.deleteCharismaGroup(id);
  }
}
