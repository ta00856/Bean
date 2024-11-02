import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getApiUrl = () => {
    return 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/login';
  };

  const saveAuthData = async (data) => {
    try {
      // Save all authentication related data
      const authData = {
        accessToken: data.access_token,
        email: data.email,
        onboardingCompleted: data.onboarding_completed
      };
      
      await AsyncStorage.multiSet([
        ['authData', JSON.stringify(authData)],
        ['accessToken', data.access_token],
        ['userEmail', data.email]
      ]);
      
      console.log('Auth data saved successfully');
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    console.log('Login initiated with email:', email);
    const loginData = { email, password };

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (response.ok) {
        if (!result.access_token) {
          throw new Error('No access token received');
        }

        // Save auth data
        await saveAuthData(result);

        // Navigate based on onboarding status
        if (result.onboarding_completed) {
          Alert.alert(
            'Login Successful', 
            `Welcome back, ${result.email}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ 
                      name: 'Home',
                      params: { 
                        email: result.email,
                        token: result.access_token  // Add token to params
                      }
                    }],
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Login Successful', 
            `Welcome ${result.email}. Let's complete your profile.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('Navigating to CoffeePreference with email:', result.email);
                  navigation.reset({
                    index: 0,
                    routes: [{ 
                      name: 'CoffeePreference',
                      params: { 
                        email: result.email,
                        token: result.access_token  // Add token to params
                      }
                    }],
                  });
                }
              }
            ]
          );
        }
      } else {
        handleLoginError(response.status, result.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert(
        'Error',
        'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (status, message) => {
    switch (status) {
      case 401:
        Alert.alert('Login Failed', 'Incorrect password');
        break;
      case 404:
        Alert.alert('User not found', 'Please sign up first.');
        break;
      default:
        Alert.alert(
          'Login Failed', 
          message || 'Something went wrong. Please try again.'
        );
    }
    console.log(`Login failed (${status}):`, message);
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
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
        placeholderTextColor="#666666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#666666"
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPasswordButton}
        disabled={isLoading}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 45,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666666',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default LoginScreen;