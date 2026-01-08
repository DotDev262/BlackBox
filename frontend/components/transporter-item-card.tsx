import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export type TransporterItem = {
  id: string;
  classification: string;
  pickupStatus: 'Picked Up' | 'To Be Picked Up';
  deliveryDeadline: string;
  dropOffCenter: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

type TransporterItemCardProps = {
  item: TransporterItem;
};

const TransporterItemCard = ({ item }: TransporterItemCardProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const statusStyles = {
    'Picked Up': {
      backgroundColor: themeColors.tint,
      color: '#FFFFFF',
    },
    'To Be Picked Up': {
      backgroundColor: themeColors.statusWarningBackground,
      color: themeColors.statusWarningText,
    },
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: themeColors.cardBackground, shadowColor: '#000' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.borderColor }]}>
            <MaterialIcons name={item.icon} size={24} color={themeColors.icon} />
          </View>
          <ThemedText style={[styles.classification, { color: themeColors.text }]}>{item.classification}</ThemedText>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusStyles[item.pickupStatus].backgroundColor }]}>
          <ThemedText style={[styles.status, { color: statusStyles[item.pickupStatus].color }]}>{item.pickupStatus}</ThemedText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoBlock}>
          <ThemedText style={[styles.infoLabel, { color: themeColors.icon }]}>Deliver By</ThemedText>
          <ThemedText style={[styles.infoText, { color: themeColors.text }]}>{item.deliveryDeadline}</ThemedText>
        </View>
        <View style={styles.infoBlock}>
          <ThemedText style={[styles.infoLabel, { color: themeColors.icon }]}>Drop-off Center</ThemedText>
          <ThemedText style={[styles.infoText, { color: themeColors.text }]}>{item.dropOffCenter}</ThemedText>
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
  classification: {
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

export default TransporterItemCard;
