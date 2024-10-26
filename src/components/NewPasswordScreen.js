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

const NewPasswordScreen = ({ route, navigation }) => {
  const { email, otp } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    // Basic validation
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            new_password: newPassword
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        'Unable to reset password. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set New Password</Text>
      <Text style={styles.subText}>
        Create a new password for your account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
      />

      <Text style={styles.passwordRequirements}>
        Password must be at least 6 characters long
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          (!newPassword || !confirmPassword) && styles.buttonDisabled
        ]}
        onPress={handleResetPassword}
        disabled={!newPassword || !confirmPassword || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
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
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff',
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
  passwordRequirements: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10,
  }
});

export default NewPasswordScreen;   


















