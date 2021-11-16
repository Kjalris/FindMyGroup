import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import MapView, { LatLng, MAP_TYPES, Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ReactTimeAgo from 'react-time-ago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupAndMember } from '../interfaces/group-and-member.interface';
import * as geolib from 'geolib';
import { getLocations } from '../helpers/api';
import { saveLocationToGroups } from '../helpers/location';
import { GroupLocation } from '../interfaces/location.interface';
import { SafeAreaView } from 'react-native-safe-area-context';

function PersonMarker(props: {
  name: string;
  location: LatLng;
  timestamp: number;
}): any {
  function PersonMarkerWithTime({ children }: { children: string }) {
    return (
      <Marker
        key={props.name + ' ' + props.timestamp}
        coordinate={{
          latitude: props.location.latitude,
          longitude: props.location.longitude,
        }}
        draggable={false}
        focusable={true}
        title={props.name}
        description={children}
      />
    );
  }

  return (
    <ReactTimeAgo
      date={new Date(props.timestamp)}
      component={PersonMarkerWithTime}
      timeStyle={'round'}
    />
  );
}

export default class MapScreen extends React.Component<
  {
    navigation: NativeStackNavigationProp<any>;
  },
  {
    selected: GroupAndMember | null;
    selectedLocation: GroupLocation;
    groups: GroupAndMember[];
    location: Location.LocationObject;
    locations: { [key: string]: GroupLocation[] };
    geoWatch: { remove: () => void };
  }
> {
  constructor(probs: any) {
    super(probs);
  }

  componentWillUnmount() {
    this.state.geoWatch?.remove();
  }

  private updateLocations() {
    // Get locations for each group
    const promises = this.state.groups.map((v) => getLocations(v.group.id));

    Promise.all(promises).then((locations) => {
      const mappedLocations: { [key: string]: GroupLocation[] } = {};

      locations.forEach((v, i) => {
        mappedLocations[this.state.groups[i].group.id] = v;

        this.setState({
          locations: mappedLocations,
        });
      });
    });
  }

  async componentDidMount() {
    AsyncStorage.getItem('groups').then((result) => {
      if (result !== null) {
        this.setState({ groups: JSON.parse(result) });

        this.updateLocations();
      } else {
        this.setState({
          groups: [],
          locations: {},
        });
      }
    });

    const { status } = await Location.requestForegroundPermissionsAsync();
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

        // Save location to all groups
        saveLocationToGroups(location);
      },
    );

    this.setState({
      geoWatch,
    });
  }

  private renderGroup({ item }: { item: GroupAndMember }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.setState({
            selected: item,
          });
        }}
      >
        <Text>{item.group.name}</Text>
      </TouchableOpacity>
    );
  }

  private renderMemberLocation({ item }: { item: GroupLocation }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.setState({
            selectedLocation: item,
          });
        }}
        onLongPress={() => {
          Alert.alert('Remove member', 'Are you sure?', [
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => {
                // TODO: Implement this
                throw new Error('Not implemented');
              },
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ]);
        }}
      >
        <Text>{item.nickname}</Text>
      </TouchableOpacity>
    );
  }

  private getSelectedGroup(): GroupAndMember | null {
    if (!this.state.selected) {
      return null;
    }

    const selectedGroup = this.state.groups.find(
      (v) => v.member.id === this.state.selected?.member.id,
    );

    if (!selectedGroup) {
      return null;
    }

    return selectedGroup;
  }

  render() {
    if (
      this.state === null ||
      this.state?.location === undefined ||
      this.state?.groups === undefined
    ) {
      return <Text>Loading...</Text>;
    }

    const selectedGroup = this.getSelectedGroup();

    let region = {
      latitude: this.state.location.coords.latitude,
      longitude: this.state.location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    if (this.state.selectedLocation) {
      region = {
        latitude: this.state.selectedLocation.point.latitude,
        longitude: this.state.selectedLocation.point.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
    } else if (selectedGroup) {
      const center = geolib.getCenter(selectedGroup.group.area);

      if (center !== false) {
        region = {
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
      }
    }

    const locations = this.state.selected
      ? this.state.locations[this.state.selected.group.id]
      : [];

    return (
      <View style={styles.container}>
        <MapView
          region={region}
          style={styles.map}
          showsUserLocation={true}
          mapType={MAP_TYPES.STANDARD}
        >
          {locations.map((v) => {
            return (
              <PersonMarker
                key={v.nickname + ' ' + v.timestamp}
                name={v.nickname}
                location={{
                  latitude: v.point.latitude,
                  longitude: v.point.longitude,
                }}
                timestamp={new Date(v.timestamp).getTime()}
              />
            );
          })}

          {selectedGroup && (
            <Polygon
              key={0}
              coordinates={selectedGroup.group.area}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            ></Polygon>
          )}
        </MapView>

        {!this.state.selected && (
          <FlatList
            data={this.state.groups}
            keyExtractor={(item) => item.member.id}
            renderItem={this.renderGroup.bind(this)}
          />
        )}

        {this.state.selected && (
          <FlatList
            data={this.state.locations[this.state.selected.group.id]}
            keyExtractor={(item) => item.groupId + '_' + item.memberId}
            renderItem={this.renderMemberLocation.bind(this)}
          />
        )}

        <SafeAreaView>
          {this.state.selected && (
            <Button
              title="Deselect group"
              onPress={() => {
                this.setState({
                  selected: null,
                });
              }}
            />
          )}
          <Button
            title="Refresh locations"
            onPress={() => {
              this.updateLocations();
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
  },
  map: {
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width,
  },
});
