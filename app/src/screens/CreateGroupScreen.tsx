import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { TextInput, StyleSheet, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { createWarning } from '../helpers/toast';

export default class CreateGroupScreen extends React.Component<
  NativeStackScreenProps<{
    AreaCreator: {
      name: string;
      nickname: string;
    };
  }>,
  {
    name: string | null;
    nickname: string | null;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: null,
      nickname: null,
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Group name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(v) =>
            this.setState({
              name: v,
            })
          }
        />
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
          title="Create"
          onPress={() => {
            if (
              this.state.name === null ||
              this.state.nickname === null ||
              this.state.name === '' ||
              this.state.nickname === ''
            ) {
              createWarning('Create group', 'Missing group name or nickname');
              return;
            }

            this.props.navigation.navigate('AreaCreator', {
              name: this.state.name,
              nickname: this.state.nickname,
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
