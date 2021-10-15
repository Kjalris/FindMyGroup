import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import QrCodeCreatorScreen from './src/screens/QRCodeGeneratorScreen';
import QrCodeScannerScreen from './src/screens/QRCodeScannerScreen';
import TestScreen from './src/screens/TestScreen';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import dk from 'javascript-time-ago/locale/en-DK.json';

TimeAgo.addLocale(en);
TimeAgo.addLocale(dk);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="QRScan" component={QrCodeScannerScreen} />
        <Stack.Screen name="QRCreate" component={QrCodeCreatorScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
