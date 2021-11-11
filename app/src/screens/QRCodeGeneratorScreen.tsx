import React from 'react';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default class QrCodeCreatorScreen extends React.Component {
  render() {
    return <QRCode size={Dimensions.get('window').width} value="testest" />;
  }
}
