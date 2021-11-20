import axios, { AxiosError } from 'axios';
import { LatLng } from 'react-native-maps';
import { url } from '../constants/api.constant';
import { GroupAndMember } from '../interfaces/group-and-member.interface';
import { Group } from '../interfaces/group.interface';
import * as Location from 'expo-location';
import {
  saveGroup as saveGroupToStorage,
  deleteGroupById as deleteGroupFromStorage,
  deleteGroupByMemberId as deleteGroupByMemberFromStorage,
} from './storage';
import { GroupLocation } from '../interfaces/location.interface';

export function updateLocation(
  groupId: string,
  memberId: string,
  location: Location.LocationObject,
): Promise<void> {
  return axios({
    url: url + '/groups/' + groupId + '/members/' + memberId + '/location',
    method: 'PUT',
    data: {
      point: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    },
    responseType: 'json',
  }).then(() => {
    return;
  });
}

export function getLocations(groupId: string): Promise<GroupLocation[]> {
  return axios({
    url: url + '/groups/' + groupId + '/locations',
    method: 'GET',
    responseType: 'json',
  }).then((response) => {
    return response.data;
  });
}

export function getGroup(groupId: string): Promise<Group> {
  return axios({
    url: url + '/groups/' + groupId,
    method: 'GET',
    responseType: 'json',
  }).then((response) => {
    return response.data;
  });
}

export function deleteGroupMember(
  groupId: string,
  memberId: string,
): Promise<void> {
  return axios({
    url: url + '/groups/' + groupId + '/members/' + memberId,
    method: 'DELETE',
    responseType: 'json',
  }).then(() => {
    return deleteGroupByMemberFromStorage(memberId);
  });
}

export async function joinGroup(
  groupId: string,
  nickname: string,
): Promise<GroupAndMember> {
  return axios({
    url: url + '/groups/' + groupId + '/members',
    method: 'POST',
    data: {
      nickname,
      role: 1,
    },
    responseType: 'json',
  }).then((response) => {
    return saveGroupToStorage(response.data);
  });
}

export function createGroup(
  name: string,
  nickname: string,
  password: string,
  area: LatLng[],
): Promise<GroupAndMember> {
  return axios({
    url: url + '/groups',
    method: 'POST',
    data: {
      name,
      nickname,
      password,
      area,
    },
    responseType: 'json',
  }).then((response) => {
    return saveGroupToStorage(response.data);
  });
}

export function deleteGroup(id: string): Promise<void> {
  return axios({
    url: url + `/groups/${id}`,
    method: 'DELETE',
  })
    .then(() => {
      return deleteGroupFromStorage(id);
    })
    .catch((err: AxiosError) => {
      if (err.isAxiosError) {
        if (err.response?.status == 404) {
          return deleteGroupFromStorage(id);
        }
      }
      throw err;
    });
}
