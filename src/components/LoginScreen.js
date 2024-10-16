import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getApiUrl = () => {
    return 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/login';
  };

  const handleLogin = async () => {
    console.log('Login initiated with email:', email);
    const loginData = { email, password };

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login response:', result);

        if (result.onboarding_completed) {
          Alert.alert('Login Successful', `Welcome back, ${result.email}`);
          navigation.navigate('Home', { email: result.email });
        } else {
          Alert.alert('Login Successful', `Welcome ${result.email}. Let's complete your profile.`);
          console.log('Navigating to CoffeePreference with email:', result.email);
          navigation.navigate('CoffeePreference', { email: result.email });
        }
      } else if (response.status === 401) {
        Alert.alert('Login Failed', 'Incorrect password');
        console.log('Login failed: Incorrect password');
      } else if (response.status === 404) {
        Alert.alert('User not found', 'Please sign up first.');
        console.log('Login failed: User not found');
      } else {
        const errorMessage = await response.text();
        console.log(`Error during login (Status: ${response.status}):`, errorMessage);
        Alert.alert('Login Failed', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log('Error during login:', error);
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again.');
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
});

export default LoginScreen;