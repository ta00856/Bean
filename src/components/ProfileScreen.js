import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';

const ProfileScreen = ({ navigation }) => {
  const [coffeePreferences, setCoffeePreferences] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteBean, setFavoriteBean] = useState('');
  const [coffeeFrequency, setCoffeeFrequency] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fields = [coffeePreferences, age, bio, favoriteBean, coffeeFrequency];
    const completedFields = fields.filter(field => field !== '').length;
    setProfileCompletion(completedFields / fields.length);
  }, [coffeePreferences, age, bio, favoriteBean, coffeeFrequency]);

  const handleCompleteProfile = () => {
    if (profileCompletion < 1) {
      alert('Please complete all fields to proceed.');
    } else {
      navigation.replace('YouAreSetToGo'); // Navigate to YouAreSetToGoScreen
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Complete Your Profile</Text>
      <Text style={styles.subHeader}>
        It'll take just a few minutes to complete your profile so you can fully enjoy Bean.
      </Text>

      <Progress.Circle
        size={100}
        progress={profileCompletion}
        showsText={false}
        color="#4CAF50" // Green color for the circle
        thickness={8}
        unfilledColor="#ccc"
        style={styles.progress}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your coffee preferences"
        value={coffeePreferences}
        onChangeText={setCoffeePreferences}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <TextInput
        style={styles.input}
        placeholder="Write a short bio (max 100 words)"
        multiline
        maxLength={100}
        value={bio}
        onChangeText={setBio}
      />

      <TextInput
        style={styles.input}
        placeholder="What's your favorite coffee bean?"
        value={favoriteBean}
        onChangeText={setFavoriteBean}
      />

      <TextInput
        style={styles.input}
        placeholder="How often do you drink coffee?"
        value={coffeeFrequency}
        onChangeText={setCoffeeFrequency}
      />

<TouchableOpacity 
  style={styles.button}
  onPress={handleCompleteProfile} // Updated handler
  disabled={profileCompletion < 1}
>
  <Text style={styles.buttonText}>
    {profileCompletion < 1 ? 'Complete Profile' : 'Profile Complete!'}
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  progress: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
