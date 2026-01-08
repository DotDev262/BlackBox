import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import ShipmentCard, { type Shipment } from '@/components/shipment-card';

const dummyShipments: Shipment[] = [
  {
    id: '1',
    parcelId: 'BBX001',
    location: 'Mumbai, MH',
    status: 'In Transit',
    estimatedTime: '2 hours',
    icon: 'local-shipping',
  },
  {
    id: '2',
    parcelId: 'BBX002',
    location: 'Delhi, DL',
    status: 'Finding Traveller',
    estimatedTime: '5 hours',
    icon: 'person-search',
  },
  {
    id: '3',
    parcelId: 'BBX003',
    location: 'Bangalore, KA',
    status: 'Pending Drop Off',
    estimatedTime: '1 day',
    icon: 'pending',
  },
];

const SenderScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleFabPress = () => {
    router.push('/add-shipment');
  };

  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const fabBackgroundColor = Colors[colorScheme ?? 'light'].tint;
  const borderColor = Colors[colorScheme ?? 'light'].borderColor;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>Your Shipments</ThemedText>
      </ThemedView>
      <FlatList
        data={dummyShipments}
        renderItem={({ item }) => <ShipmentCard shipment={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<ThemedText style={[styles.listHeader, { color: textColor }]}>Active Shipments</ThemedText>}
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: fabBackgroundColor }]} onPress={handleFabPress}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
        <ThemedText style={styles.fabText}>Send New</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30, // Adjusted for better placement
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      },
    }),
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SenderScreen;
