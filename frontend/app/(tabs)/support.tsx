import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useState } from 'react';

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [shipmentId, setShipmentId] = useState('');
  const [issue, setIssue] = useState('');

  const handleSubmit = () => {
    if (!shipmentId || !issue) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before submitting.');
      return;
    }
    // For now, we'll just log the ticket to the console.
    // In a real app, this would send a request to a backend.
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Submit a Support Ticket</ThemedText>
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingVertical: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    paddingVertical: 5,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
