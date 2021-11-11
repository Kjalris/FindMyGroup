import { LatLong } from '../../common/dto/latlong.dto';

export interface GroupWithLatLong {
  id: string;
  name: string;
  area: LatLong[];
}
