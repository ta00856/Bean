import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const CoffeePreferenceScreen = ({ navigation }) => {
  const progress = 0.2;
  const handleSelectOption = () => {
    navigation.navigate('FavoriteBean'); // Navigate to FavoriteBeanScreen
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>
        Hey there! We're excited to help you find your perfect coffee spots. Let's get to know your coffee style—this will only take a moment! 
        Which kind of coffee do you like?
      </Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Espresso</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Latte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Cappuccino</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Americano</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>I like to try different things!</Text>
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
