import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [shipmentId, setShipmentId] = useState('');
  const [issue, setIssue] = useState('');
  const { signOut, user } = useAuth();

  const handleSubmit = () => {
    if (!shipmentId || !issue) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before submitting.');
      return;
    }
    console.log('Support Ticket Submitted:', { shipmentId, issue });
    Alert.alert(
      'Ticket Submitted',
      `Your support ticket for shipment ID ${shipmentId} has been submitted. We will get back to you shortly.`,
      [{ text: 'OK', onPress: () => {
        setShipmentId('');
        setIssue('');
      }}]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Account & Support</ThemedText>
          
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }]}>
             <View style={styles.accountHeader}>
                <View style={[styles.avatar, { backgroundColor: themeColors.tint }]}>
                   <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View>
                   <ThemedText style={styles.userName}>Active User</ThemedText>
                   <Text style={{ color: themeColors.icon }}>{user?.email}</Text>
                </View>
             </View>
             
             <TouchableOpacity 
                style={[styles.logoutButton, { borderColor: '#EF4444' }]} 
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.logoutButtonText}>Sign Out</Text>
             </TouchableOpacity>
          </View>

          <ThemedText style={styles.sectionTitle}>Submit a Support Ticket</ThemedText>
          <ThemedText style={styles.subtitle}>
            If you have an issue with a shipment, such as a lost item or non-receipt, please let us know.
          </ThemedText>

          <View style={styles.form}>
            <ThemedText style={[styles.label, { color: themeColors.text }]}>Shipment ID</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: themeColors.borderColor, color: themeColors.text, backgroundColor: themeColors.cardBackground }]}
              placeholder="Enter the Shipment ID"
              placeholderTextColor={themeColors.icon}
              value={shipmentId}
              onChangeText={setShipmentId}
            />

            <ThemedText style={[styles.label, { color: themeColors.text }]}>Describe the Issue</ThemedText>
            <TextInput
              style={[styles.textArea, { borderColor: themeColors.borderColor, color: themeColors.text, backgroundColor: themeColors.cardBackground }]}
              placeholder="Describe the problem with your shipment..."
              placeholderTextColor={themeColors.icon}
              value={issue}
              onChangeText={setIssue}
              multiline
              numberOfLines={6}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: themeColors.tint }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
