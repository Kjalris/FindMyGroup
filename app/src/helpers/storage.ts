import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupAndMember } from '../interfaces/group-and-member.interface';

export async function saveGroup(
  groupAndMember: GroupAndMember,
): Promise<GroupAndMember> {
  const groups = await getGroups();

  groups.push(groupAndMember);

  await AsyncStorage.setItem('groups', JSON.stringify(groups));

  return groupAndMember;
}

function saveGroups(groups: GroupAndMember[]): Promise<void> {
  return AsyncStorage.setItem('groups', JSON.stringify(groups));
}

export async function deleteGroupById(id: string): Promise<void> {
  const groups = await getGroups();

  for (let i = groups.length - 1; i >= 0; i--) {
    const { group } = groups[i];

    if (group.id === id) {
      groups.splice(i, 1);
      break;
    }
  }

  return saveGroups(groups);
}

export async function deleteGroupByMemberId(memberId: string): Promise<void> {
  const groups = await getGroups();

  for (let i = groups.length - 1; i >= 0; i--) {
    const { member } = groups[i];

    if (member.id === memberId) {
      groups.splice(i, 1);
    }
  }

  return saveGroups(groups);
}

export async function getGroup(
  memberId: string,
): Promise<GroupAndMember | null> {
  const groups = await getGroups();

  const group = groups.find((v) => v.member.id === memberId);

  if (group === undefined) {
    return null;
  } else {
    return group;
  }
}

export async function getGroups(): Promise<GroupAndMember[]> {
  const result = await AsyncStorage.getItem('groups');

  if (result !== null) {
    return JSON.parse(result) as any[];
  } else {
    return [];
  }
}
