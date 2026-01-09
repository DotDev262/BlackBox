import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; 

// Theme Imports
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const IncomingShipmentsScreen = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background, borderBottomColor: themeColors.borderColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.profileContainer}>
            <View style={[styles.profileImage, { borderColor: themeColors.tint, backgroundColor: themeColors.cardBackground }]} />
            <View style={[styles.profileStatus, { backgroundColor: themeColors.tint, borderColor: themeColors.background }]} />
          </View>
          <View>
            <ThemedText style={styles.headerTitle}>Incoming Shipments</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: themeColors.icon }]}>TakeItAlong Receiver</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={[styles.notificationsButton, { backgroundColor: themeColors.cardBackground }]}>
          <MaterialIcons name="notifications" size={24} color={themeColors.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <MaterialIcons name="build" size={64} color={themeColors.icon} style={{ opacity: 0.5, marginBottom: 16 }} />
        <ThemedText style={styles.emptyTitle}>Under Development</ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: themeColors.icon }]}>
          The Receiver dashboard is coming soon. Stay tuned!
        </ThemedText>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  profileStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  notificationsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default IncomingShipmentsScreen;