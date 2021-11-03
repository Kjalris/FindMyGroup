import { Injectable } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  createMember(body: any): Promise<any> {
    return this.memberRepository.save(body).then((result) => {
      return {
        name: result.nickname,
        id: result.id,
        group_id: result.group_id,
        role: result.role,
      };
    });
  }

  getMembers(group_id: string): Promise<any> {
    return this.memberRepository
      .find({ where: { group_id: group_id } })
      .then((result) => {
        return result.map((v) => {
          return {
            nickname: v.nickname,
            id: v.id,
            group_id: group_id,
            role: v.role,
          };
        });
      });
  }

  getMember(parems: any): Promise<any> {
    return this.memberRepository
      .findOne({ where: { id: parems.id, group_id: parems.group_id } })
      .then((result) => {
        return {
          nickname: result.nickname,
          id: result.id,
          group_id: parems.group_id,
          role: result.role,
        };
      });
  }

  deleteMember(parems: any): Promise<boolean> {
    return this.memberRepository
      .count({ where: { id: parems.id, group_id: parems.group_id } })
      .then((result) => {
        if (result >= 1) {
          this.memberRepository.delete(parems.id);
          return true;
        } else {
          return false;
        }
      });
  }
}
