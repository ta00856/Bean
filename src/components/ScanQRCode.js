import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const ScanQRCode = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Get the email from route params
  const { email } = route.params;  // Retrieve the email passed from the previous screen

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

      // Make API call to scan the QR code and fetch loyalty rewards
      const response = await axios.post('https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/scan_qr', {
        email: email,  // Use the email passed via route params
        cafe_id: cafeId,
        reward_id: rewardId,  // Include reward_id from scanned data
      });

      // Navigate to LoyaltyDetails screen with loyalty data
      navigation.navigate('LoyaltyDetails', { loyaltyData: response.data.loyalty_progress });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      Alert.alert('Error', 'Failed to scan QR code. Please try again.');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    // Assume the QR code contains a URL with both cafe_id and reward_id
    const parsedData = new URL(data); // Parse the scanned URL
    const cafeId = parsedData.searchParams.get('cafe_id');
    const rewardId = parsedData.searchParams.get('reward_id');

    // Ensure both cafeId and rewardId exist
    if (cafeId && rewardId) {
      // Call the function to handle scanning and API request
      handleScanQRCode(cafeId, rewardId);
    } else {
      Alert.alert('Error', 'Invalid QR code.');
      setScanned(false); // Allow to scan again
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

