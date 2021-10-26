import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { Circle, MAP_TYPES, Polygon } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

export default class PolygonCreator extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygon: null,
      editing: false,
      editingCoordinate: false,
    };
  }

  finish() {
    this.setState({
      editing: false,
      editingCoordinate: false,
    });
  }

  onPress(e: any) {
    const { editing, editingCoordinate, polygon } = this.state;

    if (editingCoordinate !== false) {
      const coordinates = [];

      for (let i = 0; i < polygon.coordinates.length; i++) {
        const coordinate = polygon.coordinates[i];

        coordinates.push({
          ...coordinate,
        });
      }

      let deletedCoordinate = false;

      for (let i = 0; i < polygon.coordinates.length; i++) {
        const coordinate = polygon.coordinates[i];

        const a = 0.002;
        const x = e.nativeEvent.coordinate.latitude - coordinate.latitude;
        const y = e.nativeEvent.coordinate.longitude - coordinate.longitude;

        if (a > Math.sqrt(x * x + y * y) && i == editingCoordinate) {
          coordinates.splice(editingCoordinate, 1);
          deletedCoordinate = true;
          break;
        }
      }

      if (!deletedCoordinate) {
        coordinates[editingCoordinate] = e.nativeEvent.coordinate;
      }

      this.setState({
        editingCoordinate: false,
        polygon: {
          ...polygon,
          coordinates,
        },
      });
      return;
    }

    if (!editing) {
      this.setState({
        editing: true,
        editingCoordinate: false,
        polygon: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
      for (let i = 0; i < polygon.coordinates.length; i++) {
        const coordinate = polygon.coordinates[i];

        const a = 0.002;
        const x = e.nativeEvent.coordinate.latitude - coordinate.latitude;
        const y = e.nativeEvent.coordinate.longitude - coordinate.longitude;

        if (a > Math.sqrt(x * x + y * y)) {
          this.setState({
            editingCoordinate: i,
          });
          return;
        }
      }

      this.setState({
        editingCoordinate: false,
        polygon: {
          ...polygon,
          coordinates: [...polygon.coordinates, e.nativeEvent.coordinate],
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          mapType={MAP_TYPES.HYBRID}
          initialRegion={this.state.region}
          onPress={this.onPress.bind(this)}
          scrollEnabled={this.state.editingCoordinate === false}
        >
          {this.state.editing &&
            this.state.polygon.coordinates.map((v: any, i: number) => (
              <Circle
                key={'coordinate_' + i}
                center={v}
                radius={100}
                strokeColor={
                  i === this.state.editingCoordinate ? '#0F0' : '#F00'
                }
                fillColor={
                  i === this.state.editingCoordinate
                    ? 'rgba(0,255,0,0.5)'
                    : 'rgba(255,0,0,0.5)'
                }
                strokeWidth={1}
              />
            ))}
          {this.state.polygon && (
            <Polygon
              key={0}
              coordinates={this.state.polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    width: 80,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginVertical: 20,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
