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
import { CreateGroupDto } from './dto/group.dto';
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
  private getGroup(@Param('id', ParseUUIDPipe) id: string): Promise<Group> {
    return this.groupService.get(id);
  }

  @Delete(':id')
  private deleteGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<null> {
    return this.groupService.delete(id).then((result) => {
      if (result) {
        res.status(HttpStatus.NO_CONTENT);
      } else {
        res.status(HttpStatus.NOT_FOUND);
      }
      return null;
    });
  }
}
