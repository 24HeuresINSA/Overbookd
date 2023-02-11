import { Controller } from '@nestjs/common';
import { CharismaGroupService } from './charisma_group.service';

@Controller('charisma-group')
export class CharismaGroupController {
  constructor(private readonly charismaGroupService: CharismaGroupService) {}
}
