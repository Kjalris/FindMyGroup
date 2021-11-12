import axios, { AxiosError } from 'axios';
import { LatLng } from 'react-native-maps';
import { url } from '../constants/api.constant';
import { GroupAndMember } from '../interfaces/group-and-member.interface';
import {
  saveGroup as saveGroupToStorage,
  deleteGroup as deleteGroupFromStorage,
} from './storage';

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
