import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const CoffeeFrequencyScreen = ({ navigation, route }) => {
  const { email } = route.params;  // Get the email from the previous screen
  const progress = 0.6;
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    'Cozy and quiet',
    'Trendy and bustling',
    'Classic and traditional',
    'Artsy and unique',
    'I’m just here for great coffee!',
  ];

  useEffect(() => {
    // Log when the component is mounted and check if email exists
    console.log('CoffeeFrequencyScreen loaded');
    if (email) {
      console.log('Email passed from previous screen:', email);
    } else {
      console.log('No email passed!');
      Alert.alert('Error', 'No email was provided.');
    }
  }, [email]);

  const saveShopVibe = async (vibe) => {
    console.log('Saving coffee shop vibe:', vibe);  // Log the selected option

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        email: email,  // Use the email passed from the previous screen
        shop_vibe: vibe  // Save the selected coffee shop vibe
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Coffee shop vibe saved successfully');
        navigation.navigate('Bio', { email });  // Navigate to the next screen and pass the email
      } else {
        const errorMessage = await response.text();
        console.log(`Error saving coffee shop vibe: ${errorMessage}`);
        Alert.alert('Error', 'Failed to save your coffee shop vibe. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving coffee shop vibe:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (vibe) => {
    console.log('Option selected:', vibe);  // Log the selected option
    setSelectedOption(vibe);
    saveShopVibe(vibe);  // Save the selected shop vibe to the backend
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>What’s your favorite coffee shop vibe?</Text>
      
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option && styles.selectedOptionButton,
          ]}
          onPress={() => handleSelectOption(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Padding to avoid overlapping with status bar
    backgroundColor: '#ffffff',
    justifyContent: 'center',
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
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#000', // Highlight the selected option
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff', // White text for the selected option
  },
});

export default CoffeeFrequencyScreen;
