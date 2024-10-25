import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const BioScreen = ({ navigation, route }) => {
  const { email, token } = route.params;  // Get both email and token
  const progress = 0.8;
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    'Daily',
    'A few times a week',
    'Once a week',
    'Occasionally',
    'I am more of a homebrew person',
  ];

  useEffect(() => {
    console.log('BioScreen loaded');
    if (!email || !token) {
      console.log('Missing credentials!');
      Alert.alert('Error', 'Missing required credentials.');
    } else {
      console.log('Email passed from previous screen:', email);
    }
  }, [email, token]);

  const saveVisitFrequency = async (frequency) => {
    console.log('Saving visit frequency:', frequency);

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        visit_frequency: frequency  // Remove email from request body
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
        console.log('Visit frequency saved successfully');
        navigation.navigate('AgeRange', { 
          email,
          token  // Pass token to next screen
        });
      } else {
        const errorData = await response.json();
        console.log('Error saving visit frequency:', errorData);
        Alert.alert('Error', 'Failed to save your visit frequency. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving visit frequency:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (frequency) => {
    console.log('Option selected:', frequency);
    setSelectedOption(frequency);
    saveVisitFrequency(frequency);
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>How often do you visit coffee shops?</Text>
      
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

export default BioScreen;