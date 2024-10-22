import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Platform  // Add this import
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerificationScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { email } = route.params;

  const verifyUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/verify-email';

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending verification request:', { email, otp });

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        }),
      });

      const responseData = await response.json();
      console.log('Verification response:', responseData);

      if (responseData.verified) {
        try {
          await AsyncStorage.setItem('userEmail', email);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (storageError) {
          console.log('Storage error:', storageError);
        }
      } else {
        Alert.alert('Verification Failed', responseData.error || 'Invalid verification code');
      }
    } catch (error) {
      console.log('Verification error:', error);
      Alert.alert(
        'Error',
        'Failed to connect to the server. Please check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Enter Verification Code</Text>
        <Text style={styles.subText}>Enter the code sent to:</Text>
        <Text style={styles.emailText}>{email}</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="000000"
          value={otp}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            if (numericText.length <= 6) {
              setOtp(numericText);
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity 
          style={[styles.button, otp.length !== 6 && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    padding: 10,
    letterSpacing: 5,
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
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#666',
  }
});

export default OtpVerificationScreen;