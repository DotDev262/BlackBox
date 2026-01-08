import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialSymbolsOutlined are typically MaterialIcons in Expo

const IncomingShipmentsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImage} />
            <View style={styles.profileStatus} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Incoming Shipments</Text>
            <Text style={styles.headerSubtitle}>CarryMate Receiver</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationsButton}>
          <MaterialIcons name="notifications" size={24} color="#4B5563" style={styles.notificationsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentContainer}>
        <Text style={styles.sectionTitle}>Ready for Pickup</Text>
        <View style={styles.articleCard}>
          <View style={styles.articleCardAccent} />
          <View style={styles.cardHeader}>
            <View style={styles.cardUserDetails}>
              <View style={styles.userAvatar}>
                <MaterialIcons name="person" size={24} color="#6B7280" />
              </View>
              <View>
                <View style={styles.userNameRating}>
                  <Text style={styles.userName}>John D.</Text>
                  <Text style={styles.userRating}>
                    <MaterialIcons name="star" size={10} color="#F59E0B" /> 4.9
                  </Text>
                </View>
                <Text style={styles.packageDetails}>Electronics • 2.5 kg</Text>
              </View>
            </View>
            <View style={styles.cardStatusContainer}>
              <Text style={styles.cardStatus}>
                <MaterialIcons name="inventory_2" size={14} /> Ready
              </Text>
            </View>
          </View>
          <View style={styles.locationInfo}>
            <MaterialIcons name="location_on" size={18} color="#10B981" />
            <Text style={styles.locationText}>Central Station Locker A</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="qr_code_scanner" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>I have reached the center</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleMT]}>In Transit</Text>
        <View style={styles.articleCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardUserDetails}>
              <View style={styles.userAvatar}>
                <MaterialIcons name="face_3" size={24} color="#6B7280" />
              </View>
              <View>
                <View style={styles.userNameRating}>
                  <Text style={styles.userName}>Sarah L.</Text>
                  <Text style={styles.userRatingAlt}>
                    <MaterialIcons name="star" size={10} color="#6B7280" /> 4.5
                  </Text>
                </View>
                <Text style={styles.packageDetails}>Documents • 0.5 kg</Text>
              </View>
            </View>
            <View style={styles.cardStatusContainer}>
              <Text style={styles.cardStatusTransit}>
                <MaterialIcons name="local_shipping" size={14} /> In Transit
              </Text>
            </View>
          </View>
          <View style={styles.mapPreview}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx67eb9hn3w2mAR3lb_2b7-ByOHgQ-w3waOQMTQcpfYX7lQv4VgQB2UmifYJ5nkFxSutElUdgzfF2xys6iyKBom7O9y_ae-GX_qd_y6Savt0VrNuIdK2ftj9flfe2vTvAxLXvfa3H4Cqs7w6ppfBLHSZMQOh05z45Igs80SMPGBeL9koVJz-dIB2e66Xrit51nSVCjOS3Vd5XjCpb1z6oCQH6EvGiCIBgesnPWUfdnZ2bDRMpTsM8e4h896hKiy6LJFZvoZdA1Dko' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
            <View style={styles.mapTextContent}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>
                2 hours <Text style={styles.etaTimeSmall}>(14:30 PM)</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Location</Text>
            <MaterialIcons name="arrow_forward" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-background-light
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // px-4
    paddingTop: 24, // pt-6
    paddingBottom: 8, // pb-2
    backgroundColor: '#F3F4F6', // bg-background-light/95
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 40, // size-10
    height: 40,
    borderRadius: 9999, // rounded-full
    backgroundColor: '#ccc', // Placeholder, replace with actual image
    borderWidth: 2,
    borderColor: '#10b77f', // border-primary
    // backgroundImage: url('...'), // Not directly supported in RN style, use <Image> component
  },
  profileStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12, // size-3
    height: 12,
    backgroundColor: '#10b77f', // bg-primary
    borderRadius: 9999, // rounded-full
    borderWidth: 2,
    borderColor: '#10221c', // border-background-dark
  },
  headerTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    lineHeight: 28, // leading-tight
    color: '#1F2937', // text-slate-900
  },
  headerSubtitle: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-slate-500
    fontWeight: '500',
    marginTop: 2, // mt-0.5
  },
  notificationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 9999, // rounded-full
    backgroundColor: '#FFFFFF', // bg-white
    // hover:bg-gray-100
  },
  notificationsIcon: {
    color: '#4B5563', // text-slate-700
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16, // px-4
    paddingTop: 24, // pt-6
  },
  mainContentContainer: {
    paddingBottom: 80, // for fixed bottom nav
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#1F2937', // text-slate-900
    marginBottom: 16, // Assuming some margin for sections
  },
  sectionTitleMT: {
    marginTop: 8, // mt-2
  },
  articleCard: {
    position: 'relative',
    flexDirection: 'column',
    gap: 16, // gap-4
    padding: 20, // p-5
    borderRadius: 16, // rounded-2xl
    backgroundColor: '#FFFFFF', // bg-white
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#F3F4F6', // border-gray-100
    overflow: 'hidden',
    marginBottom: 16, // Added for spacing between cards
  },
  articleCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6, // w-1.5
    backgroundColor: '#10b77f', // bg-primary
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardUserDetails: {
    flexDirection: 'row',
    gap: 12, // gap-3
  },
  userAvatar: {
    width: 40, // size-10
    height: 40,
    borderRadius: 9999, // rounded-full
    backgroundColor: '#E5E7EB', // bg-slate-100
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userNameRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
  },
  userName: {
    fontWeight: 'bold',
    color: '#1F2937', // text-slate-900
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 10, // text-[10px]
    fontWeight: 'bold',
    backgroundColor: 'rgba(253, 224, 71, 0.2)', // bg-yellow-400/20
    color: '#D97706', // text-yellow-600
    paddingHorizontal: 6, // px-1.5
    paddingVertical: 2, // py-0.5
    borderRadius: 9999, // rounded
  },
  userRatingAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 10, // text-[10px]
    fontWeight: 'bold',
    backgroundColor: '#E5E7EB', // bg-slate-200
    color: '#4B5563', // text-slate-600
    paddingHorizontal: 6, // px-1.5
    paddingVertical: 2, // py-0.5
    borderRadius: 9999, // rounded
  },
  packageDetails: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-slate-500
    marginTop: 2, // mt-0.5
  },
  cardStatusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 4, // py-1
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(16, 185, 129, 0.15)', // bg-primary/15
    color: '#10B981', // text-primary
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    textTransform: 'uppercase', // uppercase
  },
  cardStatusTransit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 4, // py-1
    borderRadius: 9999, // rounded-full
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // bg-blue-500/10
    color: '#3B82F6', // text-blue-500
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    textTransform: 'uppercase', // uppercase
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // bg-slate-50
    padding: 16, // p-4
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#E5E7EB', // border-slate-100
    gap: 8, // gap-2
  },
  locationText: {
    fontSize: 14, // text-sm
    fontWeight: '500',
    color: '#1F2937', // text-slate-800
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    width: '100%', // w-full
    height: 48, // h-12
    backgroundColor: '#10B981', // bg-primary
    // hover:bg-green-600
    color: '#FFFFFF', // text-white
    fontWeight: 'bold',
    borderRadius: 12, // rounded-xl
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(16, 185, 129, 0.25)',
      },
      default: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mapPreview: {
    position: 'relative',
    width: '100%', // w-full
    height: 96, // h-24
    borderRadius: 12, // rounded-xl
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7, // opacity-70
    // transition-transform group-hover:scale-105
  },
  mapOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(16, 34, 28, 0.9)', // bg-gradient-to-r from-background-dark/90
  },
  mapTextContent: {
    position: 'absolute',
    zIndex: 10,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 16, // px-4
  },
  etaLabel: {
    fontSize: 12, // text-xs
    color: '#9CA3AF', // text-slate-400
    textTransform: 'uppercase', // uppercase
    fontWeight: '600', // font-semibold
  },
  etaTime: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: '#FFFFFF', // text-white
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  etaTimeSmall: {
    fontSize: 14, // text-sm
    fontWeight: 'normal',
    color: '#D1D5DB', // text-slate-300
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    width: '100%', // w-full
    height: 40, // h-10
    backgroundColor: '#F3F4F6', // bg-slate-100
    // hover:bg-slate-200
    color: '#1F2937', // text-slate-900
    fontWeight: '500', // font-medium
    fontSize: 14, // text-sm
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: 'transparent', // border-transparent
  },
  trackButtonText: {
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default IncomingShipmentsScreen;