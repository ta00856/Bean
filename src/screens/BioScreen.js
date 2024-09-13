import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const BioScreen = ({ navigation }) => {
  const progress = 0.8;
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    'Daily',
    'A few times a week',
    'Once a week',
    'Occasionally',
    'I’m more of a homebrew person',
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    // Navigate to AgeRangeScreen after selecting an option
    navigation.navigate('AgeRange'); 
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

export default BioScreen;
