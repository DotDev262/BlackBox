import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal, FlatList, SafeAreaView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useMemo, useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import Constants from "expo-constants";

const { width } = Dimensions.get('window');

// Get the IP address of the machine running 'npx expo start'
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(":")[0];

const API_URL = localhost 
  ? `http://${localhost}:8000` 
  : "https://api.your-production-url.com";

const CITIES = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Surat', lat: 21.1702, lon: 72.8311 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
];

interface Sender {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

const AddShipmentScreen = () => {
  const [pickup, setPickup] = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);
  const [isPickupModalVisible, setPickupModalVisible] = useState(false);
  const [isDropoffModalVisible, setDropoffModalVisible] = useState(false);
  const [isSenderModalVisible, setSenderModalVisible] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceKm, setDistanceKm] = useState(10.0);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState('documents');
  const [distanceError, setDistanceError] = useState('');
  const [selectedWeightKg, setSelectedWeightKg] = useState(5);

  const [senders, setSenders] = useState<Sender[]>([]);
  const [selectedSender, setSelectedSender] = useState<Sender | null>(null);
  const [loadingSenders, setLoadingSenders] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  // Define a consistent Primary Color (Emerald Green for Logistics vibe)
  const PRIMARY_COLOR = '#059669'; 
  const PRIMARY_LIGHT = '#D1FAE5';

  const filteredCities = useMemo(
    () => CITIES.filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch senders on component mount
  useEffect(() => {
    const fetchSenders = async () => {
      try {
        setLoadingSenders(true);
        const response = await fetch(`http://${localhost}:8000/senders`);
        const data = await response.json();
        setSenders(data);
      } catch (error) {
        console.error('Error fetching senders:', error);
      } finally {
        setLoadingSenders(false);
      }
    };
    fetchSenders();
  }, []);

  const handleGetEstimate = async () => {
    setDistanceError('');
    if (!pickupCoords || !dropoffCoords) {
      setDistanceError('Please select both pickup and dropoff cities.');
      setEstimatedPrice(null);
      return;
    }
    try {
      const url = `http://${localhost}:8000/calculate-price?lat1=${pickupCoords.lat}&lon1=${pickupCoords.lon}&lat2=${dropoffCoords.lat}&lon2=${dropoffCoords.lon}&weight_kg=${selectedWeightKg}&item_type=${selectedItemType}`;
      const response = await fetch(url);
      const data = await response.json();
      setEstimatedPrice(data.price);
    } catch (error) {
      console.error('Error fetching price estimate:', error);
      setEstimatedPrice(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedSender || !pickup || !dropoff || !pickupCoords || !dropoffCoords || estimatedPrice === null) {
      setDistanceError('Please complete all fields and get an estimate first.');
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        sender_id: selectedSender.id,
        source_city: pickup,
        dest_city: dropoff,
        weight_kg: selectedWeightKg,
        item_type: selectedItemType,
        source_lat: pickupCoords.lat,
        source_lon: pickupCoords.lon,
        dest_lat: dropoffCoords.lat,
        dest_lon: dropoffCoords.lon,
      };

      const response = await fetch(`http://${localhost}:8000/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Order created:', data);
        alert('Order placed successfully!');
        // Reset form
        setPickup(null);
        setDropoff(null);
        setPickupCoords(null);
        setDropoffCoords(null);
        setEstimatedPrice(null);
        setSelectedSender(null);
        setSelectedItemType('documents');
        setSelectedWeightKg(5);
      } else {
        alert(`Error: ${data.detail || 'Failed to place order'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderSenderModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSenderModalVisible}
      onRequestClose={() => setSenderModalVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setSenderModalVisible(false)}>
        <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Select Sender</Text>
            <TouchableOpacity onPress={() => setSenderModalVisible(false)}>
              <Ionicons name="close" size={24} color={themeColors.icon} />
            </TouchableOpacity>
          </View>

          {loadingSenders ? (
            <ActivityIndicator size="large" color="#059669" />
          ) : (
            <FlatList
              data={senders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, { borderBottomColor: themeColors.borderColor }]}
                  onPress={() => {
                    setSelectedSender(item);
                    setSenderModalVisible(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.senderName, { color: themeColors.text }]}>{item.name}</Text>
                    <Text style={styles.senderEmail}>{item.email || item.phone || 'No contact'}</Text>
                  </View>
                  {selectedSender?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );

  const renderCityModal = (
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onSelect: (city: { name: string; lat: number; lon: number }) => void
  ) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
        <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Select City</Text>
            <TouchableOpacity onPress={() => { setSearchQuery(''); setVisible(false); }}>
              <Ionicons name="close" size={24} color={themeColors.icon} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }]}>
            <Ionicons name="search" size={20} color={themeColors.icon} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search city..."
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholderTextColor={themeColors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.cityItem, { borderBottomColor: themeColors.borderColor }]}
                onPress={() => {
                  onSelect(item);
                  setSearchQuery('');
                  setVisible(false);
                }}
              >
                <ThemedText style={{ color: themeColors.text }}>{item.name}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      {renderSenderModal()}
      {renderCityModal(isPickupModalVisible, setPickupModalVisible, (city) => { setPickup(city.name); setPickupCoords({ lat: city.lat, lon: city.lon }); })}
      {renderCityModal(isDropoffModalVisible, setDropoffModalVisible, (city) => { setDropoff(city.name); setDropoffCoords({ lat: city.lat, lon: city.lon }); })}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={[styles.screenTitle, { color: themeColors.text }]}>New Shipment</Text>
            <Text style={styles.screenSubtitle}>Fill details to get an estimate</Text>
          </View>

          {/* Sender Selection Card */}
          <TouchableOpacity
            onPress={() => setSenderModalVisible(true)}
            style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
          >
            <View style={styles.locationRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="person" size={20} color="#4F46E5" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.labelSmall}>Sender</Text>
                <Text style={[styles.locationValue, { color: selectedSender ? themeColors.text : '#9CA3AF' }]}>
                  {selectedSender ? selectedSender.name : 'Select Sender'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Location Card with Shadow */}
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
            <TouchableOpacity onPress={() => setPickupModalVisible(true)} style={styles.locationRow}>
              <View style={[styles.iconContainer, { backgroundColor: PRIMARY_LIGHT }]}>
                <Ionicons name="navigate" size={20} color={PRIMARY_COLOR} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.labelSmall}>Pickup Location</Text>
                <Text style={[styles.locationValue, { color: pickup ? themeColors.text : '#9CA3AF' }]}>
                  {pickup || 'Select City'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.connectorContainer}>
               <View style={styles.verticalLine} />
            </View>

            <TouchableOpacity onPress={() => setDropoffModalVisible(true)} style={styles.locationRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="location" size={20} color="#EF4444" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.labelSmall}>Drop off Location</Text>
                <Text style={[styles.locationValue, { color: dropoff ? themeColors.text : '#9CA3AF' }]}>
                  {dropoff || 'Select City'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Package Type Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>What are you sending?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 5 }}>
              {['documents', 'food', 'clothes', 'other'].map(type => {
                const isSelected = selectedItemType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.packageTypeButton,
                      { 
                        backgroundColor: isSelected ? PRIMARY_COLOR : themeColors.cardBackground,
                        borderColor: isSelected ? PRIMARY_COLOR : themeColors.borderColor 
                      }
                    ]}
                    onPress={() => setSelectedItemType(type)}
                  >
                    <MaterialCommunityIcons
                      name={
                        type === 'documents' ? 'file-document-outline' :
                        type === 'food' ? 'food-variant' :
                        type === 'clothes' ? 'tshirt-crew-outline' : 'package-variant-closed'
                      }
                      size={24}
                      color={isSelected ? '#FFFFFF' : themeColors.icon}
                    />
                    <Text style={[
                      styles.packageTypeText,
                      { color: isSelected ? '#FFFFFF' : themeColors.text }
                    ]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Weight Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Package Weight</Text>
            <View style={styles.weightGrid}>
              {[1, 5, 10, 20].map((weight) => {
                const isSelected = selectedWeightKg === weight;
                return (
                  <TouchableOpacity
                    key={weight}
                    style={[
                      styles.weightButton,
                      { 
                        backgroundColor: isSelected ? PRIMARY_LIGHT : themeColors.cardBackground,
                        borderColor: isSelected ? PRIMARY_COLOR : themeColors.borderColor,
                      }
                    ]}
                    onPress={() => setSelectedWeightKg(weight)}
                  >
                    <Text style={[
                      styles.weightText,
                      { color: isSelected ? PRIMARY_COLOR : themeColors.text, fontWeight: isSelected ? '700' : '500' }
                    ]}>
                      &lt; {weight} kg
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={16} color={PRIMARY_COLOR} style={styles.checkIcon} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: themeColors.cardBackground }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Estimated Cost</Text>
          <Text style={[styles.priceValue, { color: themeColors.text }]}>
            {estimatedPrice !== null ? `₹${estimatedPrice}` : '--'}
          </Text>
        </View>
        {estimatedPrice === null ? (
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: PRIMARY_COLOR }]} onPress={handleGetEstimate}>
            <Text style={styles.sendButtonText}>Get Price</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: PRIMARY_COLOR, opacity: isPlacingOrder ? 0.6 : 1 }]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text style={styles.sendButtonText}>Place Order</Text>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // Card Styles
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  locationTextContainer: {
    flex: 1,
  },
  labelSmall: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectorContainer: {
    paddingLeft: 20, // Center with the icons (40px width / 2)
    height: 24,
    justifyContent: 'center',
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Package Type Buttons
  packageTypeButton: {
    flexDirection: 'column', // Stack icon and text
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  packageTypeText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },

  // Weight Grid
  weightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  weightButton: {
    flex: 1,
    minWidth: '45%', // 2 columns
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
    position: 'relative',
  },
  weightText: {
    fontSize: 15,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '60%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    fontSize: 13,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  senderEmail: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

export default AddShipmentScreen;