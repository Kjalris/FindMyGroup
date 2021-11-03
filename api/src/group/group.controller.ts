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

  //
  // Group
  //
  @Post()
  private createGroup(
    @Body()
    body: CreateGroupDto,
  ): Promise<any> {
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

  //
  // Member
  //
  @Post(':group_id/members')
  private createMember(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Body()
    body: any,
  ): Promise<any> {
    return this.memberService.createMember(
      Object.assign(body, { group_id: group_id }),
    );
  }

  @Get(':group_id/members')
  private getMembers(
    @Param('group_id', ParseUUIDPipe) group_id: string,
  ): Promise<any> {
    return this.memberService.getMembers(group_id);
  }

  @Get(':group_id/members/:id')
  private getMember(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.memberService.getMember({
      id: id,
      group_id: group_id,
    });
  }

  @Delete(':group_id/members/:id')
  private deleteMember(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<null> {
    return this.memberService
      .deleteMember({
        id: id,
        group_id: group_id,
      })
      .then((result) => {
        if (result) {
          res.status(HttpStatus.NO_CONTENT);
        } else {
          res.status(HttpStatus.NOT_FOUND);
        }
        return null;
      });
  }

  //
  // Location
  //
}
