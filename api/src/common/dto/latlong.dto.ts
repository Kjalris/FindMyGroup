import { IsNumber } from 'class-validator';

export class LatLong {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
