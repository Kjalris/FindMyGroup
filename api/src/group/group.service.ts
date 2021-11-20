import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { LatLong } from 'src/common/dto/latlong.dto';
import { Member, MemberRoleEnum } from 'src/member/entities/member.entity';
import { Connection, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';
import { GroupWithLatLong } from './interfaces/group-with-latlong.interface';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(input: CreateGroupDto): Promise<{
    group: GroupWithLatLong;
    member: Member;
  }> {
    const area = input.area
      .map((v) => `(${v.latitude},${v.longitude})`)
      .toString()
      .replace(/^/, '(')
      .replace(/$/, ')');

    // Create transaction

    const { group, member } = await this.connection
      .createEntityManager()
      .transaction(async (entityManager) => {
        const group = entityManager.create(Group, {
          name: input.name,
          area,
          password: input.password,
        });

        // Insert new group
        await entityManager.insert(Group, group);

        // Insert group member

        const member = entityManager.create(Member, {
          nickname: input.nickname,
          password: input.nickname,
          groupId: group.id,
          role: MemberRoleEnum.OWNER,
        });
        await entityManager.insert(Member, member);

        return {
          group,
          member,
        };
      });

    return {
      group: {
        id: group.id,
        name: group.name,
        area: this.convertPolygonToLatLongArr(group.area),
      },
      member,
    };
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
