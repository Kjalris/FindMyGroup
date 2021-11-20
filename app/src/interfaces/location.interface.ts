import { LatLng } from 'react-native-maps';

export interface GroupLocation {
  groupId: string;
  memberId: string;
  nickname: string;
  point: LatLng;
  timestamp: string;
}
