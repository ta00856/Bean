import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const FavoriteBeanScreen = ({ navigation, route }) => {
  const { email } = route.params || {};  // Get email from previous screen, fallback to empty object if undefined

  useEffect(() => {
    // Log when the component is mounted and check if email exists
    console.log('FavoriteBeanScreen loaded');
    if (email) {
      console.log('Email passed from previous screen:', email);
    } else {
      console.log('No email passed!');
      Alert.alert('Error', 'No email was provided.');
    }
  }, [email]);

  const saveFavoriteBean = async (favoriteBean) => {
    console.log('Saving favorite bean:', favoriteBean);  // Log the selected option

    try {
      const apiUrl = 'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/save_preferences';

      const data = {
        email: email,  // Use the email passed from the login screen
        coffee_strength: favoriteBean  // Save the selected coffee strength
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Favorite bean saved successfully');
        navigation.navigate('CoffeeFrequency', { email });  // Navigate to the next screen and pass the email
      } else {
        const errorMessage = await response.text();
        console.log(`Error saving favorite bean: ${errorMessage}`);
        Alert.alert('Error', 'Failed to save your favorite bean. Please try again.');
      }
    } catch (error) {
      console.log('Network error while saving favorite bean:', error);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handleSelectOption = (favoriteBean) => {
    console.log('Option selected:', favoriteBean);  // Log the selected coffee strength
    saveFavoriteBean(favoriteBean);
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.4} />
      <Text style={styles.header}>How do you like your coffee?</Text>

      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Strong and bold')}>
        <Text style={styles.optionText}>Strong and bold</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Smooth and creamy')}>
        <Text style={styles.optionText}>Smooth and creamy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Sweet and indulgent')}>
        <Text style={styles.optionText}>Sweet and indulgent</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('Light and balanced')}>
        <Text style={styles.optionText}>Light and balanced</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => handleSelectOption('I’m open to all flavors!')}>
        <Text style={styles.optionText}>I’m open to all flavors!</Text>
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

export default FavoriteBeanScreen;
