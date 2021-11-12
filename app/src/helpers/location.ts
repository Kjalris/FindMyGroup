import * as Location from 'expo-location';
import { updateLocation } from './api';
import { getGroups } from './storage';

export async function saveLocationToGroups(
  location: Location.LocationObject,
): Promise<void> {
  const groups = await getGroups();

  const promises = groups.map((v) =>
    updateLocation(v.group.id, v.member.id, location),
  );

  await Promise.all(promises);
}
