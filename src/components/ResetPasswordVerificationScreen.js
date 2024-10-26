import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

const ResetPasswordVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/verify-otp';

      console.log('Sending request with:', { email, otp }); // Debug log

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim()
        })
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        Alert.alert(
          'Success', 
          'Code verified successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('NewPassword', {
                email: email.trim(),
                otp: otp.trim()
              })
            }
          ]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          result.error || 'Invalid verification code. Please try again.'
        );
      }
    } catch (error) {
      console.error('Full error details:', error);
      
      if (error.message === 'Server returned non-JSON response') {
        Alert.alert(
          'Server Error',
          'The server is experiencing issues. Please try again later.'
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to verify the code. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Verification Code</Text>
      <Text style={styles.subText}>Enter the 6-digit code sent to:</Text>
      <Text style={styles.emailText}>{email}</Text>

      <TextInput
        style={styles.otpInput}
        placeholder="000000"
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus={true}
      />

      <TouchableOpacity
        style={[styles.button, (!otp || otp.length !== 6) && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={!otp || otp.length !== 6 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        disabled={isLoading}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ResetPasswordVerificationScreen;