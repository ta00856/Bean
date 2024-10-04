import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const CoffeePreferenceScreen = ({ navigation, route }) => {
  const { email } = route.params;  // Get the email from navigation props

  useEffect(() => {
    // Log the received email when the screen is loaded
    console.log('CoffeePreferenceScreen loaded with email:', email);
    if (!email) {
      Alert.alert('Error', 'No email provided.');
      console.log('Error: No email provided');
    }
  }, [email]);

  const savePreference = async (coffeeType) => {
    console.log('Saving preference:', coffeeType);  // Log the coffee type selected
    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        email: email,  // Use the email passed from the login screen
        coffee_type: coffeeType
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Preference saved successfully');
        navigation.navigate('FavoriteBean', { email });  // Navigate to the next screen and pass the email
      } else {
        const errorMessage = await response.text();
        console.log(`Error saving preference: ${errorMessage}`);
        Alert.alert('Error', 'Failed to save your coffee preference. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving preference:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (coffeeType) => {
    console.log('Option selected:', coffeeType);
    savePreference(coffeeType);
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.2} />
      <Text style={styles.header}>Which kind of coffee do you like?</Text>

      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Espresso')}>
        <Text style={styles.optionText}>Espresso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Latte')}>
        <Text style={styles.optionText}>Latte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Cappuccino')}>
        <Text style={styles.optionText}>Cappuccino</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Americano')}>
        <Text style={styles.optionText}>Americano</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
});

export default CoffeePreferenceScreen;
