import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
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

console.log("Current API URL:", API_URL);

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

const AddShipmentScreen = () => {
  // FIX 1: Added explicit types to useState
  const [pickup, setPickup] = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);
  const [isPickupModalVisible, setPickupModalVisible] = useState(false);
  const [isDropoffModalVisible, setDropoffModalVisible] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceKm, setDistanceKm] = useState(10.0);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState('documents');
  const [distanceError, setDistanceError] = useState('');
  const [selectedWeightKg, setSelectedWeightKg] = useState(5);

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const filteredCities = useMemo(
    () => CITIES.filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null);

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

  // FIX 2: Added types to function parameters (visible: boolean, etc.)
  const renderCityModal = (
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onSelect: (city: { name: string; lat: number; lon: number }) => void
  ) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setVisible(false)}>
        <ThemedView style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]} onStartShouldSetResponder={() => true} onResponderRelease={(e) => e.stopPropagation()}>
          <TouchableOpacity style={styles.closeButton} onPress={() => { setSearchQuery(''); setVisible(false); }}>
            <Ionicons name="close-circle" size={32} color={themeColors.icon} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for a city..."
            style={[styles.searchInput, { borderColor: themeColors.borderColor, color: themeColors.text }]}
            placeholderTextColor={themeColors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
        </ThemedView>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      {renderCityModal(isPickupModalVisible, setPickupModalVisible, (city) => { setPickup(city.name); setPickupCoords({ lat: city.lat, lon: city.lon }); })}
      {renderCityModal(isDropoffModalVisible, setDropoffModalVisible, (city) => { setDropoff(city.name); setDropoffCoords({ lat: city.lat, lon: city.lon }); })}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          <ThemedView style={[styles.locationContainer, { backgroundColor: themeColors.cardBackground }]}>
            <TouchableOpacity onPress={() => setPickupModalVisible(true)} style={styles.locationInputWrapper}>
              <Ionicons name="arrow-up-circle" size={24} color={themeColors.tint} />
              <ThemedText style={[styles.locationInput, { color: themeColors.text }]}>{pickup || 'Pick up location'}</ThemedText>
            </TouchableOpacity>
            <ThemedView style={[styles.dashedLine, { borderLeftColor: themeColors.borderColor }]} />
            <TouchableOpacity onPress={() => setDropoffModalVisible(true)} style={styles.locationInputWrapper}>
              <Ionicons name="arrow-down-circle" size={24} color={themeColors.tint} />
              <ThemedText style={[styles.locationInput, { color: themeColors.text }]}>{dropoff || 'Drop off location'}</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: themeColors.text }]}>Package Type</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['documents', 'food', 'clothes', 'other'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.packageTypeButton,
                    { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor },
                    selectedItemType === type && { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
                  ]}
                  onPress={() => setSelectedItemType(type)}
                >
                  <MaterialCommunityIcons
                    name={
                      type === 'documents'
                        ? 'file-document-outline'
                        : type === 'food'
                        ? 'food'
                        : type === 'clothes'
                        ? 'hanger'
                        : 'dots-horizontal'
                    }
                    size={24}
                    color={selectedItemType === type ? '#FFFFFF' : themeColors.icon}
                  />
                  <ThemedText style={[
                    styles.packageTypeText,
                    { color: themeColors.icon },
                    selectedItemType === type && { color: '#FFFFFF' }
                  ]}>{type.charAt(0).toUpperCase() + type.slice(1)}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: themeColors.text }]}>Package Weight</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 5, 10, 20].map((weight) => (
                <TouchableOpacity
                  key={weight}
                  style={[
                    styles.packageTypeButton, 
                    { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor },
                    selectedWeightKg === weight && { backgroundColor: themeColors.tint, borderColor: themeColors.tint },
                  ]}
                  onPress={() => setSelectedWeightKg(weight)}
                >
                  <ThemedText style={[
                    styles.packageTypeText,
                    { color: themeColors.icon },
                    selectedWeightKg === weight && { color: '#FFFFFF' }
                  ]}>
                    Up to {weight} kg
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: themeColors.text }]}>Distance (km)</ThemedText>
            <TextInput
              style={[styles.textInput, { borderColor: themeColors.borderColor, color: themeColors.text, backgroundColor: themeColors.cardBackground }]}
              placeholder="Enter distance in km"
              placeholderTextColor={themeColors.icon}
              keyboardType="numeric"
              value={distanceKm.toString()}
              onChangeText={(text) => setDistanceKm(parseFloat(text))}
            />
            {distanceError ? <ThemedText style={styles.errorText}>{distanceError}</ThemedText> : null}
          </ThemedView>
        </ThemedView>
      </ScrollView>
      <ThemedView style={[styles.bottomBar, { backgroundColor: themeColors.cardBackground, borderTopColor: themeColors.borderColor }]}>
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: themeColors.tint }]} onPress={handleGetEstimate}>
          <Text style={styles.sendButtonText}>Get Estimate</Text>
        </TouchableOpacity>
        {estimatedPrice !== null && (
          <ThemedText style={[styles.estimatedPriceText, { color: themeColors.text }]}>Estimated Price: ₹{estimatedPrice}</ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingBottom: 20,
  },
  content: {
    padding: 20,
  },
  locationContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
  },
  dashedLine: {
    height: 30,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    marginLeft: 12,
    marginVertical: 5,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  packageTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  packageTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
  },
  sendButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  estimatedPriceText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
});

export default AddShipmentScreen;