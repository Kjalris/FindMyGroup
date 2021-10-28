import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';

@Module({
  providers: [LocationService],
  exports: [LocationService],
  imports: [TypeOrmModule.forFeature([Location])],
})
export class LocationModule {}
