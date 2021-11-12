import axios, { AxiosError } from 'axios';
import { LatLng } from 'react-native-maps';
import { url } from '../constants/api.constant';
import { GroupAndMember } from '../interfaces/group-and-member.interface';
import { Group } from '../interfaces/group.interface';
import {
  saveGroup as saveGroupToStorage,
  deleteGroup as deleteGroupFromStorage,
} from './storage';

export async function getGroup(groupId: string): Promise<Group> {
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
    return deleteGroupFromStorage(memberId);
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
