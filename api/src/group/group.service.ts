import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(body: any): Promise<any> {
    body.area = body.area
      .map((v) => {
        return `(${v[0]},${v[1]})`;
      })
      .toString()
      .replace(/^/, '(')
      .replace(/$/, ')');
    return this.groupRepository.save(body).then((result) => {
      return {
        name: result.name,
        id: result.id,
        area: result.area
          .substring(2, result.area.length - 2)
          .split('),(')
          .map((v) => [
            parseFloat(v.split(',')[0]),
            parseFloat(v.split(',')[1]),
          ]),
      };
    });
  }

  get(id: string): any {
    return this.groupRepository
      .findOne({ where: { id: id } })
      .then((result) => {
        return {
          name: result.name,
          area: result.area
            .substring(2, result.area.length - 2)
            .split('),(')
            .map((v) => [
              parseFloat(v.split(',')[0]),
              parseFloat(v.split(',')[1]),
            ]),
        };
      });
  }

  delete(id: string): Promise<boolean> {
    return this.groupRepository.count({ where: { id: id } }).then((result) => {
      if (result >= 1) {
        this.groupRepository.delete(id);
        return true;
      } else {
        return false;
      }
    });
  }
}
