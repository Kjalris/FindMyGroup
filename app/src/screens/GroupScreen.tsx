import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Group } from '../interfaces/group.interface';

export default class GroupScreen extends React.Component<
  {
    navigation: NativeStackNavigationProp<any>;
  },
  {
    groups: Group[];
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

  render() {
    return (
      <View>
        <Text>
          You are in {this.state.groups.length} group
          {this.state.groups.length === 1 ? '' : 's'}
        </Text>
        <Text>{JSON.stringify(this.state.groups, undefined, 4)}</Text>
        <Toast position={'top'} ref={(ref) => Toast.setRef(ref)} />
      </View>
    );
  }
}
