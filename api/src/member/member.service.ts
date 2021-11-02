import { Injectable } from '@nestjs/common';
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

  // TODO
  // getMembers(id: string): any {
  //   return this.memberRepository
  //     .findOne({ where: { id: id } })
  //     .then((result) => {
  //       return {
  //         name: result.name,
  //         area: result.
  //       };
  //     });
  // }

  // TODO
  // getMember(id: string): any {
  //   return this.memberRepository
  //     .findOne({ where: { id: id } })
  //     .then((result) => {
  //       return {
  //         name: result.name,
  //         area: result.
  //       };
  //     });
  // }

  // TODO
  // deleteMember(id: string): Promise<boolean> {
  //   return this.memberRepository.count({ where: { id: id } }).then((result) => {
  //     if (result >= 1) {
  //       this.memberRepository.delete(id);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // }
}
