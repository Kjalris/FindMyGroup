import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { GetGroupDto } from './dto/get-group.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // @Post()
  // private createGroup() {}

  @Get(':id')
  private getGroup(
    @Param(new ValidationPipe({ transform: true })) params: GetGroupDto,
  ): Promise<Group> {
    return this.groupService.get(params.id);
  }
}
