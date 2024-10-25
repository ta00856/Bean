import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const CoffeeFrequencyScreen = ({ navigation, route }) => {
  const { email, token } = route.params;  // Get both email and token
  const progress = 0.6;
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    'Cozy and quiet',
    'Trendy and bustling',
    'Classic and traditional',
    'Artsy and unique',
    'I am just here for great coffee!',
  ];

  useEffect(() => {
    console.log('CoffeeFrequencyScreen loaded');
    if (!email || !token) {
      console.log('Missing credentials!');
      Alert.alert('Error', 'Missing required credentials.');
    } else {
      console.log('Email passed from previous screen:', email);
    }
  }, [email, token]);

  const saveShopVibe = async (vibe) => {
    console.log('Saving coffee shop vibe:', vibe);

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        shop_vibe: vibe  // Remove email from request body
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Add JWT token
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Coffee shop vibe saved successfully');
        navigation.navigate('Bio', { 
          email,
          token  // Pass token to next screen
        });
      } else {
        const errorData = await response.json();
        console.log('Error saving coffee shop vibe:', errorData);
        Alert.alert('Error', 'Failed to save your coffee shop vibe. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving coffee shop vibe:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (vibe) => {
    console.log('Option selected:', vibe);
    setSelectedOption(vibe);
    saveShopVibe(vibe);
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>What's your favorite coffee shop vibe?</Text>
      
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
    paddingTop: 80,
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
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
});

export default CoffeeFrequencyScreen;