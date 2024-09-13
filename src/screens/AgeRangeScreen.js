import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';


const AgeRangeScreen = ({ navigation }) => {
  const progress = 1.0;
  const handleSelectOption = () => {
    navigation.navigate('YouAreSetToGo'); // Navigate to the next screen
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.header}>You fall in which age range?</Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>18-25</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>26-35</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
        <Text style={styles.optionText}>36-45</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleSelectOption}>
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
