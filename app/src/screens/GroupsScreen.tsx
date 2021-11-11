import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupAndMember } from '../interfaces/group-and-member.interface';
import { Group } from '../interfaces/group.interface';

export default class GroupsScreen extends React.Component<
  NativeStackScreenProps<
    {
      Group: {
        group: Group;
      };
    },
    'Group'
  >,
  {
    groups: GroupAndMember[];
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    // Get groups from storage
    AsyncStorage.getItem('groups').then((result) => {
      if (result !== null) {
        this.setState({ groups: JSON.parse(result) });
      }
    });
  }

  private renderGroup({ item }: { item: GroupAndMember }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.props.navigation.navigate('Group', {
            group: item.group,
          });
        }}
      >
        <Text>{item.group.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <Text>
          You are in {this.state.groups.length} group
          {this.state.groups.length === 1 ? '' : 's'}
        </Text>
        <FlatList
          data={this.state.groups}
          keyExtractor={(item) => item.group.id}
          renderItem={this.renderGroup.bind(this)}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
  },
});
