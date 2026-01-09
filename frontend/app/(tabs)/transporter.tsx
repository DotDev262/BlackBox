import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import TransporterItemCard, { type TransporterItem } from '@/components/transporter-item-card';
import { fetchWithAuth } from '@/lib/api';

const TransporterScreen = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState<'my' | 'find'>('my');
  const [myJobs, setMyJobs] = useState<TransporterItem[]>([]);
  const [availableJobs, setAvailableJobs] = useState<TransporterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [travellerId, setTravellerId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // 1. Get Traveller Profile
      const travellerRes = await fetchWithAuth('/travellers');
      if (travellerRes.ok) {
        const travellers = await travellerRes.json();
        let myId = null;
        if (Array.isArray(travellers) && travellers.length > 0) {
          myId = travellers[0].id;
          setTravellerId(myId);
        }

        // 2. Fetch My Jobs (Active Orders)
        // Only useful if we have a traveller ID
        if (myId) {
          const ordersRes = await fetchWithAuth('/orders');
          if (ordersRes.ok) {
            const allOrders = await ordersRes.json();
            if (Array.isArray(allOrders)) {
              const jobs = allOrders
                .filter((o: any) => o.traveller_id === myId)
                .map((o: any) => mapOrderToItem(o, 'Picked Up'));
              setMyJobs(jobs.reverse());
            } else {
              setMyJobs([]);
            }
          }
        }
      }

      // 3. Fetch Available Jobs
      const availableRes = await fetchWithAuth('/orders/available');
      if (availableRes.ok) {
        const available = await availableRes.json();
        if (Array.isArray(available)) {
          const findJobs = available.map((o: any) => mapOrderToItem(o, 'To Be Picked Up'));
          setAvailableJobs(findJobs.reverse());
        } else {
          setAvailableJobs([]);
        }
      } else {
         setAvailableJobs([]);
      }

    } catch (error) {
      console.error('Error fetching transporter data:', error);
      Alert.alert('Fetch Error', String(error));
      setAvailableJobs([]);
      setMyJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const mapOrderToItem = (o: any, status: 'Picked Up' | 'To Be Picked Up'): TransporterItem => {
    const type = o.item_type || 'Package';
    return {
      id: o.id.toString(),
      classification: type.charAt(0).toUpperCase() + type.slice(1),
      pickupStatus: status,
      deliveryDeadline: 'ASAP', // Placeholder
      dropOffCenter: `${o.dest_city}`,
      icon: (o.item_type === 'documents') ? 'folder' : 'local-shipping',
    };
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const createTravellerProfile = async () => {
    // Quick auto-create for demo/prototype purposes
    // In real app, show a form
    try {
      const res = await fetchWithAuth('/travellers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: 'Transporter',
          source_city: 'Anywhere',
          dest_city: 'Anywhere'
        })
      });
      if (res.ok) {
        fetchData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    Alert.alert(
      'Accept Job',
      'Are you sure you want to accept this shipment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              let res = await fetchWithAuth(`/orders/${orderId}/accept`, { method: 'POST' });
              
              if (res.status === 400) {
                 const data = await res.json();
                 if (data.detail === "You must create a Traveller profile first") {
                    // Try to auto-create profile
                    const created = await createTravellerProfile();
                    if (created) {
                       // Retry accept
                       res = await fetchWithAuth(`/orders/${orderId}/accept`, { method: 'POST' });
                    }
                 }
              }

              if (res.ok) {
                Alert.alert('Success', 'You have accepted the job!');
                fetchData();
                setActiveTab('my');
              } else {
                const data = await res.json();
                Alert.alert('Error', data.detail || 'Failed to accept order');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={[styles.header, { borderBottomColor: themeColors.borderColor, backgroundColor: themeColors.cardBackground }]}>
        <ThemedText style={[styles.headerTitle, { color: themeColors.text }]}>Transporter Dashboard</ThemedText>
      </ThemedView>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my' && { borderBottomColor: themeColors.tint, borderBottomWidth: 2 }]} 
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'my' ? themeColors.tint : themeColors.icon }]}>My Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'find' && { borderBottomColor: themeColors.tint, borderBottomWidth: 2 }]} 
          onPress={() => setActiveTab('find')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'find' ? themeColors.tint : themeColors.icon }]}>Find Jobs</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'my' ? myJobs : availableJobs}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={activeTab === 'find' ? 0.7 : 1}
              onPress={() => activeTab === 'find' ? handleAcceptOrder(item.id) : null}
            >
              <TransporterItemCard item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <ThemedText style={[styles.listHeader, { color: themeColors.text }]}>
              {activeTab === 'my' ? 'On Board Shipments' : 'Available Shipments'}
            </ThemedText>
          }
          ListEmptyComponent={
             <View style={styles.emptyContainer}>
               <ThemedText style={{ color: '#888' }}>
                 {activeTab === 'my' ? 'No active jobs.' : 'No available jobs found.'}
               </ThemedText>
             </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  }
});

export default TransporterScreen;
