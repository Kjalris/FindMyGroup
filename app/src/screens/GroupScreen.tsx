import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../interfaces/group.interface';

export default class GroupScreen extends React.Component<
  NativeStackScreenProps<
    {
      Group: {
        group: Group;
      };
    },
    'Group'
  >,
  { group: Group }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      group: this.props.route.params.group,
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Hello</Text>
      </SafeAreaView>
    );
  }
}
