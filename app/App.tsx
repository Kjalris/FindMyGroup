import React from 'react';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import dk from 'javascript-time-ago/locale/en-DK.json';
import { Text, View, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';

TimeAgo.addLocale(en);
TimeAgo.addLocale(dk);

import AppIntroSlider from 'react-native-app-intro-slider';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import QrCodeScannerScreen from './src/screens/QRCodeScannerScreen';
import QrCodeCreatorScreen from './src/screens/QRCodeGeneratorScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupsScreen from './src/screens/GroupsScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import AreaCreator from './src/screens/AreaCreatorScreen';
import GroupScreen from './src/screens/GroupScreen';
import { Group } from './src/interfaces/group.interface';
import JoinGroupScreen from './src/screens/JoinGroupScreen';

interface IntroSlide {
  title: string;
  text: string;
  bg: string;
}

const data: IntroSlide[] = [
  {
    title: 'Create a group',
    text: 'Create a group by marking an area on a map and share it using a QR code',
    bg: '#59b2ab',
  },
  {
    title: 'Joining a group',
    text: "Scan a group's QR code and you're ready",
    bg: '#22bcb5',
  },
  {
    title: 'See live locations',
    text: 'See the last known location of people in your groups',
    bg: '#febe29',
  },
];

const Stack = createNativeStackNavigator<{
  Group: {
    group: Group;
  };
  JoinGroup: {
    group: Group;
    isOwner: false;
  };
  Home: any;
  CreateGroup: any;
  Map: any;
  Groups: any;
  AreaCreator: any;
  QRScan: any;
  QRCreate: any;
}>();

export default class App extends React.Component<
  unknown,
  {
    isReady: boolean;
    showRealApp: boolean;
  }
> {
  slider: AppIntroSlider | undefined;

  constructor(props: any) {
    super(props);

    this.state = {
      isReady: false,
      showRealApp: false,
    };
  }

  async componentDidMount() {
    try {
      const data = await AsyncStorage.getItem('intro');
      if (data === null) {
        return;
      }

      const parsed = JSON.parse(data);

      if (parsed.done) {
        this.setState({
          showRealApp: true,
        });
      }
    } catch {
    } finally {
      setTimeout(() => {
        this.setState({
          isReady: true,
        });
      }, 2000);
    }
  }

  private doneIntro() {
    AsyncStorage.setItem(
      'intro',
      JSON.stringify({
        done: true,
      }),
    ).finally(() => {
      this.setState({
        showRealApp: true,
      });
    });
  }

  renderItem = ({ item }: { item: IntroSlide }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  keyExtractor = (item: IntroSlide) => item.title;

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    if (this.state.showRealApp) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="CreateGroup"
              options={{
                title: 'Create group',
              }}
              component={CreateGroupScreen}
            />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Groups" component={GroupsScreen} />
            <Stack.Screen
              name="Group"
              options={({ route }) => {
                return { title: route.params.group.name };
              }}
              component={GroupScreen}
            />
            <Stack.Screen
              name="JoinGroup"
              options={({ route }) => {
                return { title: route.params.group.name };
              }}
              component={JoinGroupScreen}
            />
            <Stack.Screen
              name="AreaCreator"
              options={{
                title: 'Select area',
              }}
              component={AreaCreator}
            />
            <Stack.Screen name="QRScan" component={QrCodeScannerScreen} />
            <Stack.Screen
              name="QRCreate"
              options={{ title: 'QR code' }}
              component={QrCodeCreatorScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <AppIntroSlider
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onDone={this.doneIntro.bind(this)}
            bottomButton
            showSkipButton
            showPrevButton
            data={data}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
});
