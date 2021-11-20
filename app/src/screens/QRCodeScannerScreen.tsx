import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { getGroup } from '../helpers/api';
import { createWarning } from '../helpers/toast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Group } from '../interfaces/group.interface';

export default class QrCodeScannerScreen extends React.Component<
  NativeStackScreenProps<{
    JoinGroup: {
      group: Group;
      isOwner: false;
    };
  }>,
  { scanned: boolean; hasPermission: boolean }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      scanned: false,
      hasPermission: false,
    };
  }

  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    this.setState({
      hasPermission: status === 'granted',
    });
  }

  handleBarCodeScanned(result: BarCodeScannerResult) {
    if (!this.state?.scanned) {
      const { data } = result;
      this.setState({
        scanned: true,
      });

      // Join group

      getGroup(data)
        .then((group) => {
          // Go to join group page
          this.props.navigation.navigate('JoinGroup', {
            group,
            isOwner: false,
          });
        })
        .catch((err) => {
          createWarning(
            'Join group',
            'Failed to get group (' + err.message + ')',
          );
        });
    }
  }

  renderButton() {
    if (this.state?.scanned) {
      return (
        <Button
          title="Scan again"
          onPress={() => {
            this.setState({ scanned: false });
          }}
        />
      );
    } else {
      return null;
    }
  }

  renderAnimation() {
    if (!this.state?.scanned) {
      return <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />;
    }

    return null;
  }

  render() {
    if (!this.state.hasPermission) {
      return <Text>App needs permission to use camera</Text>;
    }

    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned.bind(this)}
          type="back"
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFillObject, styles.scanner]}
        >
          {this.renderAnimation()}
        </BarCodeScanner>

        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanner: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
