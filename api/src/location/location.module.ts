import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { Member } from '../member/entities/member.entity';

@Module({
  providers: [LocationService],
  exports: [LocationService],
  imports: [
    TypeOrmModule.forFeature([Location]),
    TypeOrmModule.forFeature([Member]),
  ],
})
export class LocationModule {}
