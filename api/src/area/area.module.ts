import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaService } from './area.service';
import { Area } from './entities/area.entity';

@Module({
  providers: [AreaService],
  exports: [AreaService],
  imports: [TypeOrmModule.forFeature([Area])],
})
export class AreaModule {}
