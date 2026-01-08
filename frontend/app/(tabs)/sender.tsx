import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

const SenderScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleFabPress = () => {
    router.push('/add-shipment');
  };

  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const subtitleColor = Colors[colorScheme ?? 'light'].icon; // Using icon color for subtitle
  const fabBackgroundColor = Colors[colorScheme ?? 'light'].tint; // Using tint for FAB

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ThemedView style={styles.container}>
        <ThemedText style={[styles.title, { color: textColor }]}>Sender Screen</ThemedText>
        <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>Your shipments will appear here.</ThemedText>

        <TouchableOpacity style={[styles.fab, { backgroundColor: fabBackgroundColor }]} onPress={handleFabPress}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <ThemedText style={styles.fabText}>Send New</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 80, // Adjusted to prevent overlap with bottom navigation
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignSelf: 'center', // Center horizontally
  },
  fabText: {
    color: '#FFFFFF', // FAB text is always white on the colored background
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SenderScreen;
