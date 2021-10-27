import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class GetGroupDto {
  @IsUUID()
  id: string;
}

export class CreateGroupDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
