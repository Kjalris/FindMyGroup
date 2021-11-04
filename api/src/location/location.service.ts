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
    const pointReturnFormat = body.point; // Save backup of old format.
    body.point = `(${body.point[0]},${body.point[1]})`;
    this.locationRepository.delete(body.member_id);
    return this.locationRepository.save(body).then((result) => {
      return {
        member_id: body.member_id,
        timestamp: result.timestamp,
        point: pointReturnFormat,
      };
    });
  }

  getLocations(body: any): Promise<any> {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.member_id', 'member')
      .where(`member.group_id = '${body.group_id}'`)
      .getMany()
      .then((result) => {
        return result.map((v) => {
          return {
            member_id: v.member_id.id,
            group_id: body.group_id,
            timestamp: v.timestamp,
            point: [v.point['x'], v.point['y']],
          };
        });
      });
  }
}
