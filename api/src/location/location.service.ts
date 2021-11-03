import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  updateLocation(body: any): Promise<any> {
    return this.locationRepository
      .count({ where: { member_id: body.member_id } })
      .then((result) => {
        if (result >= 1) {
          this.locationRepository.update({ member_id: body.member_id }, body);
        } else {
          this.locationRepository.save({ member_id: body.member_id }, body);
        }
      })
      .then(() => {
        return this.locationRepository
          .findOne({
            where: { member_id: body.member_id },
          })
          .then((result) => {
            return {
              member_id: body.member_id,
              timestamp: result.timestamp,
              point: [result.point['x'], result.point['y']],
            };
          });
      });
  }
}
