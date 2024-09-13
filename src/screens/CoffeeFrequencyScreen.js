import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const CoffeeFrequencyScreen = ({ navigation }) => {
  const progress = 0.6;
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    'Cozy and quiet',
    'Trendy and bustling',
    'Classic and traditional',
    'Artsy and unique',
    'I’m just here for great coffee!',
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    // Navigate to BioScreen after selecting an option
    navigation.navigate('Bio'); 
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
