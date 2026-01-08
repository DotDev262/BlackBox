import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export type Shipment = {
  id: string;
  parcelId: string;
  location: string;
  status: 'In Transit' | 'Finding Traveller' | 'Pending Drop Off';
  estimatedTime: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

type ShipmentCardProps = {
  shipment: Shipment;
};

const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const statusStyles = {
    'In Transit': {
      backgroundColor: themeColors.transitStatusBackground,
      color: themeColors.transitStatusText,
    },
    'Finding Traveller': {
      backgroundColor: themeColors.statusWarningBackground,
      color: themeColors.statusWarningText,
    },
    'Pending Drop Off': {
      backgroundColor: themeColors.statusInfoBackground,
      color: themeColors.statusInfoText,
    },
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: themeColors.cardBackground, shadowColor: '#000' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.borderColor }]}>
            <MaterialIcons name={shipment.icon} size={24} color={themeColors.icon} />
          </View>
          <ThemedText style={[styles.parcelId, { color: themeColors.text }]}>{shipment.parcelId}</ThemedText>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusStyles[shipment.status].backgroundColor }]}>
          <ThemedText style={[styles.status, { color: statusStyles[shipment.status].color }]}>{shipment.status}</ThemedText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoBlock}>
          <ThemedText style={[styles.infoLabel, { color: themeColors.icon }]}>Location</ThemedText>
          <ThemedText style={[styles.infoText, { color: themeColors.text }]}>{shipment.location}</ThemedText>
        </View>
        <View style={styles.infoBlock}>
          <ThemedText style={[styles.infoLabel, { color: themeColors.icon }]}>Est. Time</ThemedText>
          <ThemedText style={[styles.infoText, { color: themeColors.text }]}>{shipment.estimatedTime}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  parcelId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShipmentCard;
