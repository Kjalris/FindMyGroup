import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { LatLong } from '../../common/dto/latlong.dto';

export class UpdateLocationDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => LatLong)
  point: LatLong;
}
