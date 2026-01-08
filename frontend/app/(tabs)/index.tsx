import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal, FlatList, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';

const { width } = Dimensions.get('window');

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'
];

const RapidoParcelHomeScreen = () => {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [isPickupModalVisible, setPickupModalVisible] = useState(false);
  const [isDropoffModalVisible, setDropoffModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = useMemo(() => 
    CITIES.filter(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const renderCityModal = (visible, setVisible, onSelect) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => { setSearchQuery(''); setVisible(false); }}>
            <Ionicons name="close-circle" size={32} color="#9CA3AF" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for a city..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => {
                  onSelect(item);
                  setSearchQuery('');
                  setVisible(false);
                }}
              >
                <Text style={styles.cityText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderCityModal(isPickupModalVisible, setPickupModalVisible, setPickup)}
      {renderCityModal(isDropoffModalVisible, setDropoffModalVisible, setDropoff)}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rapido Parcel</Text>
        <Ionicons name="person-circle-outline" size={32} color="#4B5563" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.locationContainer}>
            <TouchableOpacity onPress={() => setPickupModalVisible(true)} style={styles.locationInputWrapper}>
              <Ionicons name="arrow-up-circle" size={24} color="#F59E0B" style={styles.locationIcon} />
              <Text style={styles.locationInput}>{pickup || 'Pick up location'}</Text>
            </TouchableOpacity>
            <View style={styles.dashedLine} />
            <TouchableOpacity onPress={() => setDropoffModalVisible(true)} style={styles.locationInputWrapper}>
              <Ionicons name="arrow-down-circle" size={24} color="#10B981" style={styles.locationIcon} />
              <Text style={styles.locationInput}>{dropoff || 'Drop off location'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Map View Placeholder</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Package Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packageTypeScrollView}>
              <TouchableOpacity style={[styles.packageTypeButton, styles.packageTypeButtonActive]}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color="#FFFFFF" />
                <Text style={[styles.packageTypeText, styles.packageTypeTextActive]}>Documents</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.packageTypeButton}>
                <MaterialCommunityIcons name="food" size={24} color="#4B5563" />
                <Text style={styles.packageTypeText}>Food</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.packageTypeButton}>
                <MaterialCommunityIcons name="hanger" size={24} color="#4B5563" />
                <Text style={styles.packageTypeText}>Clothes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.packageTypeButton}>
                <MaterialCommunityIcons name="dots-horizontal" size={24} color="#4B5563" />
                <Text style={styles.packageTypeText}>Other</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Package Weight</Text>
            <View style={styles.weightSelector}>
              <Text style={styles.weightText}>Up to 5 kg</Text>
              <Ionicons name="chevron-down" size={20} color="#4B5563" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Get Estimate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    padding: 20,
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  locationIcon: {
    marginRight: 15,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  dashedLine: {
    height: 30,
    width: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
    borderStyle: 'dashed',
    marginLeft: 12,
    marginVertical: 5,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  packageTypeScrollView: {
    flexDirection: 'row',
  },
  packageTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  packageTypeButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  packageTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  packageTypeTextActive: {
    color: '#FFFFFF',
  },
  weightSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
  },
  weightText: {
    fontSize: 16,
    color: '#1F2937',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sendButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cityText: {
    fontSize: 18,
  },
});

export default RapidoParcelHomeScreen;