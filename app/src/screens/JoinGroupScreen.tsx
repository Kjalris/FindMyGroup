import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { TextInput, StyleSheet, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { joinGroup } from '../helpers/api';
import { createWarning } from '../helpers/toast';
import { Group } from '../interfaces/group.interface';

export default class JoinGroupScreen extends React.Component<
  NativeStackScreenProps<
    {
      JoinGroup: {
        group: Group;
      };
      Group: {
        group: Group;
        isOwner: false;
      };
    },
    'JoinGroup'
  >,
  {
    nickname: string | null;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      nickname: null,
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Nickname</Text>
        <TextInput
          style={styles.input}
          onChangeText={(v) =>
            this.setState({
              nickname: v,
            })
          }
        />
        <Button
          title="Join"
          onPress={() => {
            if (this.state.nickname === null || this.state.nickname === '') {
              createWarning('Join group', 'Missing nickname');
              return;
            }

            joinGroup(this.props.route.params.group.id, this.state.nickname)
              .then(({ group }) => {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('Group', {
                  group,
                  isOwner: false,
                });
              })
              .catch((err) => {
                createWarning(
                  'Join group',
                  'Failed to join group (' + err.message + ')',
                );
              });
          }}
        />
        <Toast position={'top'} ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
  },
});
