import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   Alert,
   ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../components/ProgressBar';

const CoffeePreferenceScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { email, token } = route.params;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedEmail = await AsyncStorage.getItem('userEmail');

        console.log('CoffeePreferenceScreen loaded with email:', email);
        
        if (!email || !token || !storedToken || email !== storedEmail) {
          console.log('Auth verification failed:', { 
            hasEmail: !!email, 
            hasToken: !!token, 
            hasStoredToken: !!storedToken 
          });
          
          Alert.alert(
            'Authentication Error',
            'Please log in again.',
            [
              {
                text: 'OK',
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }]
                })
              }
            ]
          );
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        });
      }
    };

    verifyAuth();
  }, [email, token, navigation]);

  const savePreference = async (coffeeType) => {
    setIsLoading(true);
    console.log('Saving preference:', coffeeType);
    
    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';
      
      const data = {
        coffee_type: coffeeType
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      // Get response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }

      if (response.ok) {
        console.log('Preference saved successfully');
        navigation.navigate('FavoriteBean', {
          email,
          token
        });
      } else {
        handleApiError(response.status, responseData?.error || responseText);
      }
    } catch (error) {
      console.error('Network error while saving preference:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (status, message) => {
    switch (status) {
      case 401:
        // Token expired or invalid
        Alert.alert(
          'Session Expired',
          'Please log in again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.multiRemove(['accessToken', 'userEmail', 'authData']);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }]
                });
              }
            }
          ]
        );
        break;
      case 400:
        Alert.alert('Invalid Request', message || 'Please try again.');
        break;
      case 500:
        Alert.alert('Server Error', 'Something went wrong. Please try again later.');
        break;
      default:
        Alert.alert('Error', 'Failed to save your coffee preference. Please try again.');
    }
  };

  const handleSelectOption = (coffeeType) => {
    if (isLoading) return;
    console.log('Option selected:', coffeeType);
    savePreference(coffeeType);
  };

  const coffeeOptions = [
    'Espresso',
    'Latte',
    'Cappuccino',
    'Americano'
  ];

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.2} />
      <Text style={styles.header}>Which kind of coffee do you like?</Text>

      {coffeeOptions.map((coffee) => (
        <TouchableOpacity
          key={coffee}
          style={[styles.optionButton, isLoading && styles.disabledButton]}
          onPress={() => handleSelectOption(coffee)}
          disabled={isLoading}
        >
          <Text style={styles.optionText}>{coffee}</Text>
        </TouchableOpacity>
      ))}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CoffeePreferenceScreen;