import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LatLong } from 'src/common/dto/latlong.dto';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';
import { GroupWithLatLong } from './interfaces/group-with-latlong.interface';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(group: CreateGroupDto): Promise<GroupWithLatLong> {
    const area = group.area
      .map((v) => `(${v.latitude},${v.longitude})`)
      .toString()
      .replace(/^/, '(')
      .replace(/$/, ')');

    return this.groupRepository
      .save({
        name: group.name,
        password: group.password,
        area,
      })
      .then((result) => {
        return {
          id: result.id,
          name: result.name,
          area: this.convertPolygonToLatLongArr(result.area),
        };
      });
  }

  async get(id: string): Promise<GroupWithLatLong> {
    const result = await this.groupRepository.findOne({
      where: {
        id,
      },
    });

    if (result === undefined) {
      throw new NotFoundException('Group not found');
    }

    return {
      id: result.id,
      name: result.name,
      area: this.convertPolygonToLatLongArr(result.area),
    };
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.groupRepository.count({ where: { id: id } });

    if (count === 0) {
      return false;
    }

    await this.groupRepository.delete(id);

    return true;
  }

  private convertPolygonToLatLongArr(polygon: string): LatLong[] {
    return polygon
      .substring(2, polygon.length - 2)
      .split('),(')
      .map((v) => {
        const [lat, long] = v.split(',');

        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(long),
        };
      });
  }
}
