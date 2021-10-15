import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

function PersonMarker(props: {
  name: string;
  location: Location.LocationObject;
}): any {
  const description =
    'Last seen ' + props.location.timestamp.toString() + ' seconds ago';

  return (
    <Marker
      key="0"
      coordinate={{
        latitude: props.location.coords.latitude,
        longitude: props.location.coords.longitude,
      }}
      title={props.name}
      description={description}
    />
  );
}

export default class MapScreen extends React.Component<
  {
    navigation: NativeStackNavigationProp<{}>;
  },
  {
    location: Location.LocationObject;
    geoWatch: { remove: () => void };
  }
> {
  constructor(probs: any) {
    super(probs);
  }

  componentWillUnmount() {
    this.state.geoWatch?.remove();
  }

  async componentDidMount() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied: ' + status);
      return;
    }

    const geoWatch = await Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Highest,
      },
      (location) => {
        this.setState({
          location,
        });
      },
    );

    this.setState({
      geoWatch,
    });
  }

  render() {
    if (this.state === null || this.state?.location === undefined) {
      return <Text>Loading...</Text>;
    }

    const region = {
      latitude: this.state.location.coords.latitude,
      longitude: this.state.location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    return (
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Text>
          lat {this.state.location.coords.latitude} - long{' '}
          {this.state.location.coords.longitude} - time{' '}
          {this.state.location.timestamp}
        </Text>
        <MapView region={region} mapType="satellite" style={styles.map}>
          <PersonMarker name="Nicklas" location={this.state.location} />
        </MapView>
      </View>
    );
  }
}

const backgroundColor = '#fff';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
  },
});
