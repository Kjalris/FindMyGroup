import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Circle,
  LatLng,
  MapEvent,
  MAP_TYPES,
  Polygon,
  Region,
} from 'react-native-maps';
import earcut from 'earcut';
import * as geolib from 'geolib';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 55.36845337818421;
const LONGITUDE = 10.42768182232976;
const LATITUDE_DELTA = 0.02835061401128769;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class PolygonCreator extends React.Component<
  unknown,
  {
    region: Region;
    editing:
      | false
      | {
          polygon: LatLng[];
          selectedCoordinate: null | number;
        };
    triangles: LatLng[][] | null;
    polygon: LatLng[] | null;
  }
> {
  private areaCornerRadiusPerLongitudeDelta = 3000;

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
      triangles: null,
      polygon: null,
    };
  }

  private getAreaCornerRadius(): number {
    return (
      this.areaCornerRadiusPerLongitudeDelta * this.state.region.longitudeDelta
    );
  }

  onRegionChangeComplete(region: Region) {
    this.setState({ region });
  }

  finish() {
    if (this.state.editing === false) {
      return;
    }

    const polygon = this.state.editing.polygon;

    if (polygon.length < 3) {
      alert('Area should be made of atleast 3 points');
      return;
    }

    const vertices = polygon
      .map((coordinate: LatLng) => [coordinate.latitude, coordinate.longitude])
      .flat();

    // TODO: Detect if edges are crossing

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
      alert('Area is invalid');
      return;
    }

    // We want to store triangles as LatLng[], so first convert it to coordinates
    const trianglesWithCoordinates = triangles.map((index) => {
      return polygon[index];
    });

    // Chunk coordinates into arrays of length 3
    const trianglesChunked: LatLng[][] = [];
    for (let i = 0, j = trianglesWithCoordinates.length; i < j; i += 3) {
      const triangle = trianglesWithCoordinates.slice(i, i + 3);
      trianglesChunked.push(triangle);
    }

    this.setState({
      editing: false,
      triangles: trianglesChunked,
    });
  }

  onPress(e: MapEvent) {
    const { editing } = this.state;
    const pressCoordinate = e.nativeEvent.coordinate;

    this.setState({
      triangles: null,
      polygon: null,
    });

    if (editing === false) {
      // We are not editing, start editing
      this.setState({
        editing: {
          polygon: [pressCoordinate],
          selectedCoordinate: null,
        },
      });
      return;
    }

    // We are editing
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

      let deletedCoordinate = false;

      const radius = this.getAreaCornerRadius();

      for (let i = 0; i < polygon.length; i++) {
        const coordinate = polygon[i];

        // Check if we clicked on the already selected corner
        if (geolib.isPointWithinRadius(pressCoordinate, coordinate, radius)) {
          // We clicked on it, remove it from the coordinates list
          coordinates.splice(editing.selectedCoordinate, 1);
          deletedCoordinate = true;
          break;
        }
      }

      if (!deletedCoordinate) {
        // We didn't click on the already selected coordinate, move it to where
        // we clicked.
        coordinates[editing.selectedCoordinate] = pressCoordinate;
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
    // Figure out if we are trying to select a corner, or if we are trying
    // to create a new corner

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
    } else {
      // We didn't click on a corner, create a new corner
      this.setState({
        editing: {
          ...editing,
          polygon: [...editing.polygon, pressCoordinate],
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          style={styles.map}
          mapType={MAP_TYPES.HYBRID}
          initialRegion={this.state.region}
          onPress={this.onPress.bind(this)}
        >
          {this.state.editing !== false &&
            this.state.editing.polygon.map((v: any, i: number) => (
              <Circle
                key={'coordinate_' + i}
                center={v}
                radius={this.getAreaCornerRadius()}
                strokeColor={
                  this.state.editing !== false &&
                  this.state.editing.selectedCoordinate === i
                    ? '#0F0'
                    : '#F00'
                }
                fillColor={
                  this.state.editing !== false &&
                  this.state.editing.selectedCoordinate === i
                    ? 'rgba(0,255,0,0.5)'
                    : 'rgba(255,0,0,0.5)'
                }
                strokeWidth={1}
              />
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
          {this.state.triangles &&
            this.state.triangles.map((v: any, i: number) => (
              <Polygon
                key={i}
                coordinates={v}
                strokeColor="#F00"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={1}
              />
            ))}
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
