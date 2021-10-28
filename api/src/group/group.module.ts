import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { AreaModule } from '../area/area.module';
import { MemberModule } from '../member/member.module';
import { LocationModule } from '../location/location.module';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [
    TypeOrmModule.forFeature([Group]),
    AreaModule,
    MemberModule,
    LocationModule,
  ],
})
export class GroupModule {}
