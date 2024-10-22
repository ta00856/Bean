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
    if (!email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    const userData = { email, password, phone };
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.requiresVerification) {
          navigation.navigate('OtpVerification', { email });
          Alert.alert('Success', 'Please check your email for verification code');
        }
      } else {
        if (response.status === 409) {
          Alert.alert('Signup Failed', responseData.error);
        } else {
          Alert.alert('Error', 'Failed to sign up. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to connect to the server.');
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
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!isLoading}
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