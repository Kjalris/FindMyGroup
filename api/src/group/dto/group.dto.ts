import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  //@IsString()
  area: any;
}
