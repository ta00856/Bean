import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Platform, 
  Alert,
  ActivityIndicator 
} from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/signup';
  
  const handleSignup = async () => {
    try {
      // Input validation
      if (!email || !password || !phone) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setIsLoading(true);

      // Format the request exactly like Postman
      const userData = {
        email: email.trim().toLowerCase(), // ensure email is trimmed and lowercase
        password: password,
        phone: phone.startsWith('+') ? phone : `+${phone}`.trim()
      };

      // Log the request data (excluding password)
      console.log('Sending request to:', apiUrl);
      console.log('Request data:', { ...userData, password: '[HIDDEN]' });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add any additional headers your API might expect
          'User-Agent': 'BeanApp/1.0',
        },
        body: JSON.stringify(userData)
      });

      // Log the raw response
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse the response if it's JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        Alert.alert('Error', 'Invalid response from server');
        return;
      }

      console.log('Parsed response data:', responseData);

      if (response.ok) {
        if (responseData.requiresVerification) {
          // Success case
          Alert.alert(
            'Success',
            'Verification code has been sent to your email',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('OtpVerification', { email: userData.email })
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Unexpected response from server');
        }
      } else {
        // Handle specific error cases
        const errorMessage = responseData.error || 'An unknown error occurred';
        if (response.status === 409) {
          Alert.alert('Account Exists', errorMessage);
        } else if (response.status === 400) {
          Alert.alert('Invalid Input', errorMessage);
        } else {
          Alert.alert('Error', `Signup failed: ${errorMessage}`);
        }
      }

    } catch (error) {
      console.error('Network or parsing error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone (e.g., +447123456789)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!isLoading}
          placeholderTextColor="#666"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, { marginTop: 20, backgroundColor: '#3b5998' }]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
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
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 45,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  }
});

export default SignUpScreen;