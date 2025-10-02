// This code block imports necessary React components and types from react-navigation and react-native
// It also imports the type for ApiEvent from the api service

import React from 'react'; // The core React library
import { StackScreenProps } from '@react-navigation/stack'; // The type for the props of a screen component in a stack navigator
import { 
  StyleSheet, // A utility for styling React components
  Text, // A component for displaying text
  View, // A component for displaying a generic container
  ScrollView // A component for displaying a scrollable container
} from 'react-native'; // The react-native library which provides components for mobile app development

import type { ApiEvent } from '../services/api'; // The type for an event object returned from the api service

export default function EventDetails({ route }: StackScreenProps<any>) {
  const { event } = (route.params || {}) as { event: ApiEvent };

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>No event data provided.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.mono}>
          lat: {event.position.latitude.toFixed(6)}{'\n'}
          lng: {event.position.longitude.toFixed(6)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  description: { fontSize: 16, color: 'purple', marginBottom: 20 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: 'gray', marginBottom: 4 },
  mono: { fontFamily: 'Courier', color: 'charcoal' },
});