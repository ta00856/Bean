import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';

const FavoriteBeanScreen = ({ navigation }) => {
  const progress = 0.4;
  const handleSelectOption = () => {
    navigation.navigate('CoffeeFrequency'); // Navigate to CoffeeFrequencyScreen
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>How do you like your coffee?</Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Strong and bold</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Smooth and creamy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Sweet and indulgent</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>Light and balanced</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
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

