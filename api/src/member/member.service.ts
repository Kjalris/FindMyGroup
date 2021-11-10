import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async createMember(groupId: string, input: CreateMemberDto): Promise<Member> {
    const member = this.memberRepository.create({
      nickname: input.nickname,
      role: input.role,
      password: input.nickname,
      groupId,
    });

    await this.memberRepository.insert(member).catch((err) => {
      if (err.code == '23505') {
        throw new BadRequestException('Nickname already taken');
      }

      throw err;
    });

    return member;
  }

  getMembers(groupId: string): Promise<any> {
    return this.memberRepository.find({ where: { groupId } });
  }

  async getMember(groupId, id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id, groupId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  deleteMember(groupId: string, id: string): Promise<boolean> {
    return this.memberRepository
      .count({ where: { groupId, id } })
      .then((result) => {
        if (result >= 1) {
          return this.memberRepository
            .delete({
              groupId,
              id,
            })
            .then(() => {
              return true;
            });
        } else {
          return false;
        }
      });
  }
}
