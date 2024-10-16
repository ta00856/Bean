import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log('Scanned QR code data:', data);

    try {
      const parsedUrl = new URL(data);
      const queryParams = new URLSearchParams(parsedUrl.search);
      const cafeId = queryParams.get('cafe_id');
      const rewardId = queryParams.get('reward_id');

      if (!cafeId || !rewardId) {
        throw new Error('Invalid QR code format - missing parameters');
      }

      console.log('Sending request to:', 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr');
      console.log('Request payload:', { email, cafe_id: cafeId, reward_id: rewardId });

      const response = await axios.post('https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr', {
        email: email,
        cafe_id: cafeId,
        reward_id: rewardId,
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.loyalty_rewards) {
        navigation.navigate('LoyaltyDetails', { 
          email: email,
          loyaltyData: response.data.loyalty_rewards 
        });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      Alert.alert('Error', 'Failed to scan QR code. Please try again.');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
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
});

export default ScanQRCode;