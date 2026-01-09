import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert('Error', error.message);
    else if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.verticallySpaced}>
        <ThemedText type="title" style={styles.header}>BlackBox</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in or create an account</ThemedText>
      </View>
      
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor={themeColors.icon}
          autoCapitalize={'none'}
          style={[
            styles.input, 
            { 
              borderColor: themeColors.borderColor,
              color: themeColors.text,
              backgroundColor: themeColors.cardBackground
            }
          ]}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={themeColors.icon}
          autoCapitalize={'none'}
          style={[
            styles.input, 
            { 
              borderColor: themeColors.borderColor,
              color: themeColors.text,
              backgroundColor: themeColors.cardBackground
            }
          ]}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity 
          disabled={loading} 
          onPress={() => signInWithEmail()} 
          style={[styles.button, { backgroundColor: themeColors.tint }]}
        >
          <ThemedText style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity 
          disabled={loading} 
          onPress={() => signUpWithEmail()} 
          style={[styles.button, styles.secondaryButton, { borderColor: themeColors.tint }]}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.tint }]}>Sign Up</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
