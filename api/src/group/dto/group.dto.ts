import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { LatLong } from '../../common/dto/latlong.dto';

export class CreateGroupDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  nickname: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({
    each: true,
  })
  @Type(() => LatLong)
  area: LatLong[];
}
