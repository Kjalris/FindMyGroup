import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AreaService } from '../area/area.service';
import { CreateGroupDto, GetGroupDto } from './dto/get-group.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { Response } from 'express';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly areaService: AreaService,
  ) {}

  @Post()
  private createGroup(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateGroupDto,
  ) {
    return this.groupService.create(body);
  }

  @Get(':id')
  private getGroup(
    @Param(new ValidationPipe({ transform: true })) params: GetGroupDto,
  ): Promise<Group> {
    return this.groupService.get(params.id);
  }

  @Delete(':id')
  private deleteGroup(
    @Param(new ValidationPipe({ transform: true })) params: GetGroupDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<null> {
    return this.groupService.delete(params.id).then((result) => {
      if (result) {
        res.status(HttpStatus.NO_CONTENT);
      } else {
        res.status(HttpStatus.NOT_FOUND);
      }
      return null;
    });
  }

  @Get(':group_id/area')
  private getArea(
    @Param('group_id', ParseUUIDPipe) group_id: string,
  ): Promise<number[][]> {
    return this.areaService.get(group_id);
  }
}
