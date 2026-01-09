import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Platform, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import ShipmentCard, { type Shipment } from '@/components/shipment-card';
import { fetchWithAuth } from '@/lib/api';

const SenderScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [orders, setOrders] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      // 1. Fetch current user's sender profile to get sender_id
      const senderRes = await fetchWithAuth('/senders');
      const senders = await senderRes.json();
      
      if (!Array.isArray(senders) || senders.length === 0) {
        setOrders([]);
        return;
      }
      const mySenderId = senders[0].id;

      // 2. Fetch all orders involved with this user
      const ordersRes = await fetchWithAuth('/orders');
      const allOrders = await ordersRes.json();

      // 3. Filter and map
      const myOrders = allOrders
        .filter((o: any) => o.sender_id === mySenderId)
        .map((o: any) => {
          let status: Shipment['status'] = 'Finding Traveller';
          if (o.status === 'accepted') status = 'In Transit';
          // You can map other statuses if needed

          return {
            id: o.id.toString(),
            parcelId: `BBX${o.id.toString().padStart(3, '0')}`,
            location: `${o.source_city} -> ${o.dest_city}`,
            status: status,
            estimatedTime: `${Math.ceil(o.distance_km / 60)} hours`, // Rough estimate
            icon: o.item_type === 'documents' ? 'description' : 'local-shipping',
          };
        });

      setOrders(myOrders.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

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
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={fabBackgroundColor} />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <ShipmentCard shipment={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            orders.length > 0 ? (
              <ThemedText style={[styles.listHeader, { color: textColor }]}>Active Shipments</ThemedText>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inventory-2" size={64} color="#ccc" />
              <ThemedText style={{ color: '#888', marginTop: 16 }}>No active shipments found.</ThemedText>
              <ThemedText style={{ color: '#888' }}>Tap + to create one.</ThemedText>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

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
    paddingBottom: 100,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
});

export default SenderScreen;
