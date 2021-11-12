import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../interfaces/group.interface';

export default class QrCodeCreatorScreen extends React.Component<
  NativeStackScreenProps<
    {
      QRCreate: {
        group: Group;
      };
    },
    'QRCreate'
  >,
  unknown
> {
  render() {
    return (
      <SafeAreaView>
        <QRCode
          size={Dimensions.get('window').width}
          value={this.props.route.params.group.id}
        />
        <Text style={{ padding: 10 }}>Scan this QR code to join the group</Text>
      </SafeAreaView>
    );
  }
}
