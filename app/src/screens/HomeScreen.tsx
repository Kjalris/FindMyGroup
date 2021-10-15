import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, View } from 'react-native';

export default class HomeScreen extends React.Component<{
  navigation: NativeStackNavigationProp<{}>;
}> {
  render() {
    return (
      <View>
        <Button
          title="Go to Map"
          onPress={() => {
            this.props.navigation.navigate('Map');
          }}
        />
        <Button
          title="Go to QR"
          onPress={() => {
            this.props.navigation.navigate('QR');
          }}
        />
        <Button
          title="Go to Test"
          onPress={() => {
            this.props.navigation.navigate('Test');
          }}
        />
      </View>
    );
  }
}
