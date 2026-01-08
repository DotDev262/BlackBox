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
            <ThemedText style={[styles.headerSubtitle, { color: themeColors.icon }]}>CarryMate Receiver</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={[styles.notificationsButton, { backgroundColor: themeColors.cardBackground }]}>
          <MaterialIcons name="notifications" size={24} color={themeColors.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentContainer}>
        
        {/* Section: Ready */}
        <ThemedText style={styles.sectionTitle}>Ready for Pickup</ThemedText>
        
        <View style={[styles.articleCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }]}>
          <View style={[styles.articleCardAccent, { backgroundColor: themeColors.tint }]} />
          
          <View style={styles.cardHeader}>
            <View style={styles.cardUserDetails}>
              <View style={[styles.userAvatar, { backgroundColor: themeColors.background }]}>
                <MaterialIcons name="person" size={24} color={themeColors.icon} />
              </View>
              <View>
                <View style={styles.userNameRating}>
                  <ThemedText style={styles.userName}>John D.</ThemedText>
                </View>
                <ThemedText style={[styles.packageDetails, { color: themeColors.icon }]}>Electronics • 2.5 kg</ThemedText>
              </View>
            </View>
            <View style={styles.cardStatusContainer}>
              <View style={[styles.cardStatus, { backgroundColor: themeColors.tint + '20' }]}> 
                {/* Fixed Icon Name: inventory_2 -> inventory */}
                <MaterialIcons name="inventory" size={14} color={themeColors.tint} /> 
                <ThemedText style={[styles.statusText, { color: themeColors.tint }]}>Ready</ThemedText>
              </View>
            </View>
          </View>

          <View style={[styles.locationInfo, { backgroundColor: themeColors.background, borderColor: themeColors.borderColor }]}>
            {/* Fixed Icon Name: location_on -> location-on */}
            <MaterialIcons name="location-on" size={18} color={themeColors.tint} />
            <ThemedText style={styles.locationText}>Central Station Locker A</ThemedText>
          </View>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: themeColors.tint }]}>
            {/* Fixed Icon Name: qr_code_scanner -> qr-code-scanner */}
            <MaterialIcons name="qr-code-scanner" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>I have reached the center</Text>
          </TouchableOpacity>
        </View>

        {/* Section: In Transit */}
        <ThemedText style={[styles.sectionTitle, styles.sectionTitleMT]}>In Transit</ThemedText>
        
        <View style={[styles.articleCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardUserDetails}>
              <View style={[styles.userAvatar, { backgroundColor: themeColors.background }]}>
                {/* Fixed Icon Name: face_3 -> face */}
                <MaterialIcons name="face" size={24} color={themeColors.icon} />
              </View>
              <View>
                <View style={styles.userNameRating}>
                  <ThemedText style={styles.userName}>Sarah L.</ThemedText>
                </View>
                <ThemedText style={[styles.packageDetails, { color: themeColors.icon }]}>Documents • 0.5 kg</ThemedText>
              </View>
            </View>
            <View style={styles.cardStatusContainer}>
              <View style={[styles.cardStatusTransit, { backgroundColor: '#3B82F620' }]}>
                {/* Fixed Icon Name: local_shipping -> local-shipping */}
                <MaterialIcons name="local-shipping" size={14} color="#3B82F6" />
                <ThemedText style={[styles.statusText, { color: '#3B82F6' }]}>In Transit</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.mapPreview}>
            <View style={[styles.mapImagePlaceholder, { backgroundColor: themeColors.text }]} /> 
            <View style={styles.mapOverlay} />
            <View style={styles.mapTextContent}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>
                2 hours <Text style={styles.etaTimeSmall}>(14:30 PM)</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.trackButton, { backgroundColor: themeColors.background, borderColor: themeColors.borderColor }]}>
            <ThemedText style={styles.trackButtonText}>Track Location</ThemedText>
            {/* Fixed Icon Name: arrow_forward -> arrow-forward */}
            <MaterialIcons name="arrow-forward" size={18} color={themeColors.text} />
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  mainContentContainer: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitleMT: {
    marginTop: 8,
  },
  articleCard: {
    position: 'relative',
    flexDirection: 'column',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  articleCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardUserDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontWeight: 'bold',
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 224, 71, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  userRatingAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  packageDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  cardStatusContainer: {
    alignItems: 'flex-end',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cardStatusTransit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mapPreview: {
    position: 'relative',
    width: '100%',
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImagePlaceholder: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  mapOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  mapTextContent: {
    position: 'absolute',
    zIndex: 10,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  etaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  etaTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaTimeSmall: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#D1D5DB',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  trackButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
});

export default IncomingShipmentsScreen;