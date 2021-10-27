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

  async delete(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
