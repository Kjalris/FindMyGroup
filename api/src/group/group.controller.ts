import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { LocationService } from '../location/location.service';
import { CreateGroupDto, GetGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { Response } from 'express';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberService: MemberService,
    private readonly locationService: LocationService,
  ) {}

  @Post()
  private createGroup(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateGroupDto,
  ): Promise<Group> {
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
