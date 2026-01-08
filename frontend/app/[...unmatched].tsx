import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { NetworkInfo } from 'react-native-network-info';


export default function UnmatchedScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const getIp = async () => {
      try {
        const ip = await NetworkInfo.getIPV4Address();
        setIpAddress(ip);
      } catch (error) {
        console.error('Error getting IP address:', error);
      }
    };

    getIp();
  }, []);

  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Route Not Found</ThemedText>
      <ThemedText style={styles.subtitle}>
        The page you are looking for does not exist.
      </ThemedText>

      <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <ThemedText style={styles.cardTitle}>How to Access the App</ThemedText>
        
        <ThemedText style={styles.sectionTitle}>For Mobile (Expo Go)</ThemedText>
        <ThemedText style={styles.instructions}>
          If you are trying to open the app on your mobile device using Expo Go, please use the following URL format. You will need to replace `[YOUR_IP_ADDRESS]` with the IP address of the machine running this application.
        </ThemedText>
        {ipAddress ? (
          <Text selectable style={[styles.url, { color: themeColors.tint }]}>
            exp://{ipAddress}:19000
          </Text>
        ) : (
          <ThemedText style={styles.instructions}>
            Run `ipconfig` (Windows) or `ifconfig` (macOS/Linux) in your terminal to find your local IP address.
          </ThemedText>
        )}
      </View>

      {isMobile && ( // Only show link on mobile platforms
        <Link href="/sender" style={styles.link}>
          <ThemedText style={[styles.linkText, { color: themeColors.tint }]}>
            Go to the Sender screen
          </ThemedText>
        </Link>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  url: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
