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

  create(body: CreateGroupDto): Promise<Group> {
    return this.groupRepository.save(body);
  }

  get(id: string): Promise<Group> {
    return this.groupRepository.findOne({ where: { id: id } });
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
