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
  Put,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { LocationService } from '../location/location.service';
import { CreateGroupDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { Response } from 'express';
import { GroupWithLatLong } from './interfaces/group-with-latlong.interface';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { UpdateLocationDto } from 'src/location/dto/update-location.dto';

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
    @Body(ValidationPipe)
    body: CreateGroupDto,
  ): Promise<GroupWithLatLong> {
    return this.groupService.create(body);
  }

  @Get(':id')
  private getGroup(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupWithLatLong> {
    return this.groupService.get(id);
  }

  @Delete(':id')
  private deleteGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.groupService.delete(id).then((result) => {
      if (result) {
        res.status(HttpStatus.NO_CONTENT);
      } else {
        res.status(HttpStatus.NOT_FOUND);
      }
    });
  }

  //
  // Member
  //
  @Post(':groupId/members')
  private createMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body(
      new ValidationPipe({
        transform: true,
      }),
    )
    body: CreateMemberDto,
  ): Promise<any> {
    return this.memberService.createMember(groupId, body);
  }

  @Get(':groupId/members')
  private getMembers(
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<any> {
    return this.memberService.getMembers(groupId);
  }

  @Get(':groupId/members/:memberId')
  private getMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ): Promise<any> {
    return this.memberService.getMember(groupId, memberId);
  }

  @Delete(':groupId/members/:memberId')
  private deleteMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<null> {
    return this.memberService.deleteMember(groupId, memberId).then((result) => {
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
  @Get(':groupId/locations')
  private async getLocations(
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<any> {
    return this.locationService.getLocations(groupId);
  }

  @Put(':groupId/members/:memberId/location')
  private updateLocation(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body(ValidationPipe)
    body: UpdateLocationDto,
  ): Promise<any> {
    return this.locationService.updateLocation(groupId, memberId, body);
  }
}
