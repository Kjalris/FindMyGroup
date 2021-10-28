import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/get-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(body: CreateGroupDto): Promise<any> {
    return this.groupRepository.save(body).then((result) => {
      return {
        name: result.name,
        id: result.id,
      };
    });
  }

  get(id: string): any {
    return this.groupRepository
      .findOne({ where: { id: id } })
      .then((result) => {
        return {
          name: result.name,
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
