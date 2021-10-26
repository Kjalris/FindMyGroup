import { IsUUID } from 'class-validator';

export class GetGroupDto {
  @IsUUID()
  id: string;
}
