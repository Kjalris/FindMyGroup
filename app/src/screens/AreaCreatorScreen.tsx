import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, {
  LatLng,
  MapEvent,
  MAP_TYPES,
  Marker,
  Polygon,
  Region,
} from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import earcut from 'earcut';
import * as geolib from 'geolib';
import Toast from 'react-native-toast-message';
import { createError, createWarning } from '../helpers/toast';
import intersects from '../helpers/intersects';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 55.36845337818421;
const LONGITUDE = 10.42768182232976;
const LATITUDE_DELTA = 0.02835061401128769;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Editing {
  polygon: LatLng[];
  selectedCoordinate: null | number;
}

export default class AreaCreator extends React.Component<
  NativeStackScreenProps<
    {
      AreaCreator: {
        name: string;
        nickname: string;
      };
      Group: any;
    },
    'AreaCreator'
  >,
  {
    region: Region;
    editing: false | Editing;
  }
> {
  private areaCornerRadiusPerLongitudeDelta = 3000;
  private shakeAnimation = new Animated.Value(0);

  constructor(props: any) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      editing: false,
    };
  }

  private getAreaCornerRadius(): number {
    return (
      this.areaCornerRadiusPerLongitudeDelta * this.state.region.longitudeDelta
    );
  }

  private finish() {
    if (this.state.editing === false) {
      return;
    }

    const polygon = this.state.editing.polygon;

    if (polygon.length < 3) {
      createError('Area', 'Area should be made of atleast 3 points');
      return;
    }

    const vertices = polygon
      .map((coordinate: LatLng) => [coordinate.latitude, coordinate.longitude])
      .flat();

    // Detect if lines are crossing
    for (let i = 1; i <= polygon.length; i++) {
      for (let j = 1; j <= polygon.length; j++) {
        if (Math.abs(i - j) <= 1) {
          continue;
        }

        if (
          intersects(
            polygon[i % polygon.length].latitude,
            polygon[i % polygon.length].longitude,
            polygon[i - 1].latitude,
            polygon[i - 1].longitude,
            polygon[j % polygon.length].latitude,
            polygon[j % polygon.length].longitude,
            polygon[j - 1].latitude,
            polygon[j - 1].longitude,
          )
        ) {
          createError('Area', 'Area has intersecting lines');
          return;
        }
      }
    }

    // Triangulate polygon
    const triangles = earcut(
      polygon
        .map((coordinate: LatLng) => [
          coordinate.latitude,
          coordinate.longitude,
        ])
        .flat(),
      [],
      2,
    );

    // Get area deviation
    const deviation = earcut.deviation(vertices, [], 2, triangles);
    if (deviation >= 1e-10) {
      // If the deviation is too large then the polygon is either very big or
      // a weird shape
      createError('Area', 'The area is invalid');
      return;
    }

    // Send request to API to create group

    axios({
      url: 'http://192.168.1.15:3000/groups',
      method: 'POST',
      data: {
        name: this.props.route.params.name,
        nickname: this.props.route.params.nickname,
        password: '12345678',
        area: this.state.editing.polygon,
      },
      responseType: 'json',
    })
      .then((response) => {
        return this.saveGroup(response.data);
      })
      .then(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        this.props.navigation.popToTop();
        this.props.navigation.navigate('Group');
      })
      .catch((err) => {
        console.log(err?.response?.data);
        createWarning(
          'Create group',
          'Failed to create group (' + err.message + ')',
        );
        return;
      });
  }

  private async saveGroup(data: any): Promise<void> {
    const result = await AsyncStorage.getItem('groups');

    let groups = [];
    if (result !== null) {
      groups = JSON.parse(result) as any[];
    }

    groups.push(data);

    await AsyncStorage.setItem('groups', JSON.stringify(groups));
  }

  private onMarkerMoved(e: MapEvent, original: LatLng) {
    const { editing } = this.state;

    if (editing === false) {
      return;
    }

    const polygon = editing.polygon as LatLng[];

    const coordinates = [];
    for (let i = 0; i < polygon.length; i++) {
      const coordinate = polygon[i];

      if (coordinate === original) {
        coordinates.push({
          ...e.nativeEvent.coordinate,
        });
      } else {
        coordinates.push({
          ...coordinate,
        });
      }
    }

    this.setState({
      editing: {
        polygon: coordinates,
        selectedCoordinate: null,
      },
    });

    Haptics.selectionAsync();
  }

  private onLongPress(e: MapEvent) {
    const { editing } = this.state;

    if (editing === false) {
      return;
    }

    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    for (let i = 1; i <= editing.polygon.length; i++) {
      const distance = geolib.getDistanceFromLine(
        e.nativeEvent.coordinate,
        editing.polygon[i - 1],
        editing.polygon[i % editing.polygon.length],
      );

      if (closest === null || closestDistance > distance) {
        closest = i - 1;
        closestDistance = distance;
      }
    }

    if (
      closestDistance <= 100 / this.state.region.longitudeDelta &&
      closest !== null
    ) {
      const polygon = editing.polygon as LatLng[];

      // Create a copy of the polygon coordinates
      const coordinates = [];
      for (let i = 0; i < polygon.length; i++) {
        const coordinate = polygon[i];

        coordinates.push({
          ...coordinate,
        });
      }

      coordinates.splice(closest + 1, 0, e.nativeEvent.coordinate);

      // Create new point at coordinate between two points
      this.setState({
        editing: { ...editing, polygon: coordinates },
      });

      Haptics.selectionAsync();
    }
  }

  private onPress(e: MapEvent) {
    const { editing } = this.state;

    if (editing === false) {
      return;
    }

    const pressCoordinate = e.nativeEvent.coordinate;

    if (editing.selectedCoordinate !== null) {
      // We have selected a coordinate, figure out if we are moving it or
      // deleting it

      const polygon = editing.polygon as LatLng[];

      // Create a copy of the polygon coordinates
      const coordinates = [];
      for (let i = 0; i < polygon.length; i++) {
        const coordinate = polygon[i];

        coordinates.push({
          ...coordinate,
        });
      }

      // Check if we clicked on the already selected corner
      if (
        geolib.isPointWithinRadius(
          pressCoordinate,
          polygon[editing.selectedCoordinate],
          this.getAreaCornerRadius(),
        )
      ) {
        if (coordinates.length <= 3) {
          createWarning('Area', "Area can't have less than 3 points");
          return;
        }

        coordinates.splice(editing.selectedCoordinate, 1);
      }

      this.setState({
        editing: {
          polygon: coordinates,
          selectedCoordinate: null,
        },
      });
      return;
    }

    // We are editing but a corner is not selected
    // Figure out if we are trying to select a corner

    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    const radius = this.getAreaCornerRadius();

    for (let i = 0; i < editing.polygon.length; i++) {
      const coordinate = editing.polygon[i];

      const distance = geolib.getDistance(pressCoordinate, coordinate);
      if (distance > radius) {
        continue;
      }

      if (closest === null || closestDistance > distance) {
        closestDistance = distance;
        closest = i;
      }
    }

    if (closest !== null) {
      // We clicked on a corner, it is now selected
      this.setState({
        editing: {
          ...editing,
          selectedCoordinate: closest,
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          onRegionChangeComplete={(region) => this.setState({ region })}
          style={styles.map}
          mapType={MAP_TYPES.STANDARD}
          initialRegion={this.state.region}
          onPress={this.onPress.bind(this)}
          onLongPress={this.onLongPress.bind(this)}
        >
          {this.state.editing !== false &&
            this.state.editing.polygon.map((v: any, i: number) => (
              <Marker
                key={'coordinate_' + i}
                coordinate={v}
                draggable={true}
                onDragStart={() => Haptics.selectionAsync()}
                onDragEnd={(e) => this.onMarkerMoved(e, v)}
                focusable={false}
                onTouchStart={() => {
                  // do nothing
                }}
                onTouchEnd={() => {
                  // do nothing
                }}
              >
                <View
                  style={{
                    ...styles.circle,
                    backgroundColor:
                      (this.state.editing as Editing).selectedCoordinate === i
                        ? '#0F0'
                        : '#F00',
                  }}
                />
              </Marker>
            ))}

          {this.state.editing !== false && (
            <Polygon
              key={0}
              coordinates={this.state.editing.polygon}
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

          {this.state.editing !== false && (
            <TouchableOpacity
              onPress={() => {
                Toast.hide();
                this.setState({
                  editing: false,
                });
              }}
              style={[styles.bubble, styles.button]}
            >
              <Text>Clear</Text>
            </TouchableOpacity>
          )}

          {this.state.editing === false && (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  editing: {
                    polygon: [
                      {
                        latitude: 55.37129843014639,
                        longitude: 10.423922348532459,
                      },
                      {
                        latitude: 55.37129843014639,
                        longitude: 10.433958678550464,
                      },
                      {
                        latitude: 55.365503342695625,
                        longitude: 10.433894726044391,
                      },
                      {
                        latitude: 55.36543212364314,
                        longitude: 10.423922348532459,
                      },
                    ],
                    selectedCoordinate: null,
                  },
                });
              }}
              style={[styles.bubble, styles.button]}
            >
              <Text>Create</Text>
            </TouchableOpacity>
          )}
        </View>

        <Toast position={'top'} ref={(ref) => Toast.setRef(ref)} />
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
  circle: {
    backgroundColor: 'red',
    borderRadius: 30,
    height: 50,
    opacity: 0.5,
    width: 50,
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
