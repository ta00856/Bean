import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CafeOwnerLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      let storedData;
      if (Platform.OS === 'web') {
        storedData = localStorage.getItem(email);
      } else {
        storedData = await AsyncStorage.getItem(email);
      }

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (parsedData.password === password) {
          navigation.navigate('CafeOwnerDashboard', { menu: parsedData.menu });
        } else {
          setError('Incorrect password');
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.log('Error during login:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cafe Owner Login</Text>

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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
    backgroundColor: '#ffffff', // Background color for input fields
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CafeOwnerLoginScreen;
