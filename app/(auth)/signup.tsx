import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useDispatch } from 'react-redux';

import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Lock, Mail, User } from 'lucide-react-native';
import {registerUser} from "../store/slices/userSlice";

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      router.replace('/login');
    } catch (error) {
      setError(error.message || 'Registration failed');
    }
  };

  return (
      <View style={styles.container}>
        <Image
            source={{ uri: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2340&auto=format&fit=crop' }}
            style={styles.backgroundImage}
        />
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Join the Journey</Text>
            <Text style={styles.subtitle}>Create your Galaxy View account</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.error}>{error}</Text>
                </View>
            ) : null}

            <View style={styles.inputContainer}>
              <User size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={name}
                  onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>Already have an account? Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});