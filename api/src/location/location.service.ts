import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { LatLong } from '../common/dto/latlong.dto';
import { Connection, Repository } from 'typeorm';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationWithLatLong } from './interfaces/location-lat-long.interface';
import { Member } from '../member/entities/member.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async updateLocation(
    groupId: string,
    memberId: string,
    body: UpdateLocationDto,
  ): Promise<LocationWithLatLong> {
    const location = this.locationRepository.create({
      memberId,
      point: `(${body.point.latitude},${body.point.longitude})`,
      timestamp: new Date(),
    });

    await this.locationRepository
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(location)
      .onConflict(
        '("memberId") DO UPDATE SET point = EXCLUDED.point, timestamp = EXCLUDED.timestamp',
      )
      .execute();

    return {
      memberId: location.memberId,
      point: this.convertPointToLatLong(location.point as string),
      timestamp: location.timestamp,
    };
  }

  async getLocations(groupId: string): Promise<any> {
    const locations = await this.connection
      .createQueryBuilder()
      .select()
      .from(Member, 'member')
      .innerJoin(Location, 'location', 'location.memberId = member.id')
      .addSelect([
        'member."groupId" as "groupId"',
        'member.id AS "memberId"',
        'member.nickname AS nickname',
        'location.point AS point',
        'location.timestamp AS timestamp',
      ])
      .where('member."groupId" = :groupId', {
        groupId,
      })
      .execute();

    return locations.map((v) => {
      v.point = {
        latitude: v.point.x,
        longitude: v.point.y,
      };
      return v;
    });
  }

  private convertPointToLatLong(point: string): LatLong {
    const [lat, long] = point.substring(1, point.length - 1).split(',');

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
    };
  }
}
