import { LatLong } from 'src/common/dto/latlong.dto';

export interface LocationWithLatLong {
  memberId: string;
  point: LatLong;
  timestamp: Date;
}
