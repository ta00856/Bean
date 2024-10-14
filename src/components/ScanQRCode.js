import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const ScanQRCode = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { email } = route.params;

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleScanQRCode = async (cafeId, rewardId) => {
    try {
      if (!email) {
        Alert.alert('Error', 'Email not found, please log in first.');
        return;
      }

      const response = await axios.post('https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr', {
        email: email,
        cafe_id: cafeId,
        reward_id: rewardId,
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.loyalty_status) {
        navigation.navigate('LoyaltyDetails', { loyaltyData: response.data });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      Alert.alert('Error', 'Failed to scan QR code. Please try again.');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log('Scanned QR code data:', data);

    try {
      if (data && data.startsWith('http')) {
        const parsedUrl = new URL(data);
        const queryParams = new URLSearchParams(parsedUrl.search);
        const cafeId = queryParams.get('cafe_id');
        const rewardId = queryParams.get('reward_id');

        if (cafeId && rewardId) {
          handleScanQRCode(cafeId, rewardId);
        } else {
          throw new Error('Invalid QR code format - missing parameters');
        }
      } else {
        throw new Error('Invalid QR code format - not a valid URL');
      }
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      Alert.alert('Error', 'Failed to parse QR code. Invalid QR code format.');
      setScanned(false);
    }
  };

  if (hasPermission === null) return <Text>Requesting for camera permission</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanQRCode;