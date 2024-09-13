import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      let userData;
      if (Platform.OS === 'web') {
        userData = localStorage.getItem(email);
      } else {
        userData = await AsyncStorage.getItem(email);
      }
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.password === password) {
          console.log('User logged in:', parsedData);
          navigation.navigate('CoffeePreference'); // Navigate to the next screen
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('User not found');
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      
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

      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
        <Text style={styles.socialButtonText}>Login with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
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
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  socialButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  socialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
