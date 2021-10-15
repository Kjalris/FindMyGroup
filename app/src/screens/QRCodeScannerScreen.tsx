import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';

export default class QrScreen extends React.Component<
  {},
  { scanned: boolean }
> {
  handleBarCodeScanned(result: BarCodeScannerResult) {
    if (!this.state?.scanned) {
      const { type, data } = result;
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      this.setState({
        scanned: true,
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
