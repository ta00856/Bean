import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  // New state for success message

  // Determine the correct API URL based on the platform
  const getApiUrl = () => {
    if (Platform.OS === 'web') {
      return 'http://127.0.0.1:5001/signup';  // Web localhost
    } else {
      return 'http://192.168.1.250:5001/signup';  // Replace with your computer's local IP address for mobile
    }
  };

  const handleSignup = async () => {
    const userData = { email, password, phone };
    try {
      const response = await fetch(getApiUrl(), {  // Use the dynamic API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User data saved:', userData);
        if (Platform.OS === 'web') {
          localStorage.setItem('userEmail', email);
        } else {
          await AsyncStorage.setItem('userEmail', email);
        }

        // Show success message for 2 seconds
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigation.navigate('Login');
        }, 2000); // 2 seconds
      } else {
        const errorMessage = await response.text();
        console.log(`Error saving user data (Status: ${response.status}):`, errorMessage);
      }
    } catch (error) {
      console.log('Network error saving user data:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Sign Up</Text>

        {showSuccessMessage ? (
          <Text style={styles.successMessage}>Signup successful! Redirecting...</Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('CafeOwnerSignup')}
              style={[styles.button, { marginTop: 20 }]}
            >
              <Text style={styles.buttonText}>Sign Up as Cafe Owner</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginBottom: 21,
  },
});

export default SignUpScreen;



