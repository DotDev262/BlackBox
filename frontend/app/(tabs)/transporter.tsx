import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import TransporterItemCard, { type TransporterItem } from '@/components/transporter-item-card';

const dummyItems: TransporterItem[] = [
  {
    id: '1',
    classification: 'Electronics',
    pickupStatus: 'Picked Up',
    deliveryDeadline: 'Today, 5:00 PM',
    dropOffCenter: 'Mumbai Central Hub',
    icon: 'devices',
  },
  {
    id: '2',
    classification: 'Documents',
    pickupStatus: 'To Be Picked Up',
    deliveryDeadline: 'Tomorrow, 12:00 PM',
    dropOffCenter: 'Delhi South Hub',
    icon: 'folder',
  },
  {
    id: '3',
    classification: 'Fragile',
    pickupStatus: 'Picked Up',
    deliveryDeadline: 'Today, 8:00 PM',
    dropOffCenter: 'Bangalore East Hub',
    icon: 'bug-report',
  },
];

const TransporterScreen = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={[styles.header, { borderBottomColor: themeColors.borderColor, backgroundColor: themeColors.cardBackground }]}>
        <ThemedText style={[styles.headerTitle, { color: themeColors.text }]}>Transporter Dashboard</ThemedText>
      </ThemedView>
      <FlatList
        data={dummyItems}
        renderItem={({ item }) => <TransporterItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<ThemedText style={[styles.listHeader, { color: themeColors.text }]}>On Board Shipments</ThemedText>}
      />
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
});

export default TransporterScreen;
