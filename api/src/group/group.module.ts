import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MemberModule } from '../member/member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [TypeOrmModule.forFeature([Group]), MemberModule],
})
export class GroupModule {}
