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

  // TODO
  // createMember(body: any): Promise<any> {
  //   return this.memberRepository.save(body).then((result) => {
  //     return {
  //       name: result.name,
  //       id: result.id,
  //       area: result.
  //     };
  //   });
  // }

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
