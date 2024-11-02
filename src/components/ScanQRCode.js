import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanQRCode = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { email } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const getAuthToken = async () => {
    try {
      // Try to get token from both places
      const accessToken = await AsyncStorage.getItem('accessToken');
      const authData = await AsyncStorage.getItem('authData');
      
      if (accessToken) {
        return accessToken;
      } else if (authData) {
        const parsedAuthData = JSON.parse(authData);
        return parsedAuthData.accessToken;
      }
      
      throw new Error('No authentication token found');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log('Scanned QR code data:', data);

    try {
      // Get token with new method
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      const parsedUrl = new URL(data);
      const queryParams = new URLSearchParams(parsedUrl.search);
      const cafeId = queryParams.get('cafe_id');
      const rewardId = queryParams.get('reward_id');

      if (!cafeId || !rewardId) {
        Alert.alert('Invalid QR Code', 'This QR code is not valid for Bean App');
        setScanned(false);
        return;
      }

      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr';
      console.log('Making request to:', apiUrl);
      console.log('With payload:', { cafe_id: cafeId, reward_id: rewardId });
      console.log('Token present:', !!token);

      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: {
          cafe_id: cafeId,
          reward_id: rewardId
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Scan response:', response.data);

      if (response.data && response.data.loyalty_rewards) {
        Alert.alert(
          'Success',
          'QR Code scanned successfully!',
          [
            {
              text: 'View Rewards',
              onPress: () => navigation.navigate('LoyaltyDetails', {
                email: email,
                loyaltyData: response.data.loyalty_rewards
              })
            }
          ]
        );
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      
      if (error.response?.status === 401) {
        // Handle token expiration
        await AsyncStorage.multiRemove(['accessToken', 'authData', 'userToken']);
        Alert.alert(
          'Session Expired',
          'Please login again',
          [
            {
              text: 'OK',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Failed to scan QR code. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => setScanned(false)
            }
          ]
        );
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity 
          style={styles.scanAgainButton} 
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  scanAgainButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
  scanAgainText: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default ScanQRCode;