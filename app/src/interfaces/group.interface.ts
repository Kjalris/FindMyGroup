import { LatLng } from 'react-native-maps';

export interface Group {
  id: string;
  name: string;
  area: LatLng[];
}
