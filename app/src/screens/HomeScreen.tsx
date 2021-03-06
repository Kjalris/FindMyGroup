import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { createSuccess } from '../helpers/toast';

export default class HomeScreen extends React.Component<{
  navigation: NativeStackNavigationProp<any>;
}> {
  render() {
    return (
      <View>
        <Button
          title="Map"
          onPress={() => {
            this.props.navigation.navigate('Map');
          }}
        />
        <Button
          title="Create group"
          onPress={() => {
            this.props.navigation.navigate('CreateGroup');
          }}
        />
        <Button
          title="Join group"
          onPress={() => {
            this.props.navigation.navigate('QRScan');
          }}
        />
        <Button
          title="Go to groups"
          onPress={() => {
            this.props.navigation.navigate('Groups');
          }}
        />
        <Button
          title="Delete local data"
          onPress={() => {
            AsyncStorage.clear()
              .catch(() => {
                // ignore error
              })
              .finally(() => {
                createSuccess('Local data', 'Deleted local data');
              });
          }}
        />
        <Toast position={'top'} ref={(ref) => Toast.setRef(ref)} />
      </View>
    );
  }
}
