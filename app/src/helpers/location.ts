import * as Location from 'expo-location';
import { updateLocation } from './api';
import { getGroups } from './storage';
import earcut from 'earcut';
import { LatLng } from 'react-native-maps';
import * as geolib from 'geolib';

export async function saveLocationToGroups(
  location: Location.LocationObject,
): Promise<void> {
  const groups = await getGroups();

  const isInsideArea = groups.filter(({ group }) => {
    const triangulated = earcut(
      group.area
        .map((coordinate: LatLng) => [
          coordinate.latitude,
          coordinate.longitude,
        ])
        .flat(),
      [],
      2,
    ).map((index) => {
      return group.area[index];
    });

    for (let i = 0; i < triangulated.length / 3; i++) {
      // Detect if location is within area
      const isInside = geolib.isPointInPolygon(
        location.coords,
        triangulated.slice(i * 3, i * 3 + 3),
      );

      if (isInside) {
        return true;
      }

      continue;
    }
  });

  const promises = isInsideArea.map((v) =>
    updateLocation(v.group.id, v.member.id, location),
  );

  await Promise.all(promises);
}
