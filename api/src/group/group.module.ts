import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MemberModule } from '../member/member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { AreaModule } from '../area/area.module';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [TypeOrmModule.forFeature([Group]), MemberModule, AreaModule],
})
export class GroupModule {}
