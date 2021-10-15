import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button } from 'react-native';

export default class TestScreen extends React.Component<{
  navigation: NativeStackNavigationProp<{}>;
}> {
  render() {
    return (
      <Button
        title="Go back"
        onPress={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }
}
