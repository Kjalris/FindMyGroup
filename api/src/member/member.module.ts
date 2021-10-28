import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';

@Module({
  providers: [MemberService],
  exports: [MemberService],
  imports: [TypeOrmModule.forFeature([Member])],
})
export class MemberModule {}
