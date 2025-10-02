import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import customMapStyle from '../../map-style.json';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';

// import MapView, { Marker, UrlTile } from 'react-native-maps';
//Removed the google maps api provider for android testing
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getEvents, type ApiEvent } from '../services/api';


export default function EventsMap(props: StackScreenProps<any>) {
  const { navigation } = props;
  const authenticationContext = useContext(AuthenticationContext);
  const mapViewRef = useRef<MapView>(null);

  // ADD hooks inside the component
  const [events, setEvents] = useState<ApiEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const eventsData = await getEvents();
        if (mounted) setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleNavigateToCreateEvent = () => {
    console.log('Navigate to create event');
  };

  // Accept the selected event and navigate to details
  const handleNavigateToEventDetails = (event: ApiEvent) => {
    navigation.navigate('EventDetails', { event });
  };

  const handleLogout = async () => {
    AsyncStorage.multiRemove(['userInfo', 'accessToken']).then(() => {
      authenticationContext?.setValue(undefined);
      navigation.navigate('Login');
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={MapSettings.DEFAULT_REGION}
        style={styles.mapStyle}
        customMapStyle={Platform.OS === 'android' ? customMapStyle : undefined}
        showsMyLocationButton={false}
        showsUserLocation={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={() => {
          console.log('Map is ready with', events.length, 'events');
          setTimeout(() => {
            if (mapViewRef.current && events.length > 0) {
              mapViewRef.current.fitToCoordinates(
                events.map(({ position }) => ({
                  latitude: position.latitude,
                  longitude: position.longitude,
                })),
                {
                  edgePadding: MapSettings.EDGE_PADDING,
                  animated: true,
                }
              );
            }
          }, 1000);
        }}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.position.latitude,
              longitude: event.position.longitude,
            }}
            onPress={() => handleNavigateToEventDetails(event)}
          >
            <Image
              resizeMode="contain"
              style={{ width: 48, height: 54 }}
              source={mapMarkerImg}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{events.length} event(s) found</Text>
        <RectButton
          style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
          onPress={handleNavigateToCreateEvent}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </RectButton>
      </View>

      <RectButton
        style={[styles.logoutButton, styles.smallButton, { backgroundColor: '#4D6F80' }]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#FFFFFF" />
      </RectButton>
    </View>
  );
}



const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    mapStyle: {
        ...StyleSheet.absoluteFillObject,
    },

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


