import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const AgeRangeScreen = ({ navigation, route }) => {
  const { email } = route.params;  // Get the email from the previous screen
  const progress = 1.0;

  useEffect(() => {
    // Log when the component is mounted and check if email exists
    console.log('AgeRangeScreen loaded');
    if (email) {
      console.log('Email passed from previous screen:', email);
    } else {
      console.log('No email passed!');
      Alert.alert('Error', 'No email was provided.');
    }
  }, [email]);

  const saveAgeRange = async (ageRange) => {
    console.log('Saving age range:', ageRange);  // Log the selected option

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        email: email,  // Use the email passed from the previous screen
        age_range: ageRange  // Save the selected age range
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Age range saved successfully');
        navigation.navigate('YouAreSetToGo', { email });  // Navigate to the next screen and pass the email
      } else {
        const errorMessage = await response.text();
        console.log(`Error saving age range: ${errorMessage}`);
        Alert.alert('Error', 'Failed to save your age range. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving age range:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (ageRange) => {
    console.log('Option selected:', ageRange);  // Log the selected age range
    saveAgeRange(ageRange);  // Save the selected age range to the backend
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>You fall in which age range?</Text>

      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('18-25')}>
        <Text style={styles.optionText}>18-25</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('26-35')}>
        <Text style={styles.optionText}>26-35</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('36-45')}>
        <Text style={styles.optionText}>36-45</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('46+')}>
        <Text style={styles.optionText}>46+</Text>
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

export default AgeRangeScreen;
