import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { MemberRoleEnum } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @MinLength(1)
  nickname: string;

  @IsEnum(MemberRoleEnum)
  @IsNumber()
  role: MemberRoleEnum;
}
