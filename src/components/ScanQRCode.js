import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios'; // To make API requests
import AsyncStorage from '@react-native-async-storage/async-storage'; // To get the user's email

const ScanQRCode = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // Assume the QR code contains the café ID
    const cafeId = data;

    try {
      // Retrieve the logged-in user's email from AsyncStorage
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        throw new Error("User not logged in or email not found.");
      }

      // Make API call to update loyalty progress for this café
      const response = await axios.post('https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr', {
        email,
        cafe_id: cafeId,
      });

      // Fetch the loyalty progress from API response
      const loyaltyProgressData = response.data.loyalty_progress;

      // Navigate to the LoyaltyDetailsScreen and pass the loyalty data
      navigation.navigate('LoyaltyDetails', { loyaltyData: loyaltyProgressData });

    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process the QR code. Please try again.');
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

