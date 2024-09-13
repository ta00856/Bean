import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const YouAreSetToGoScreen = ({ navigation }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1 (fully visible)

  useEffect(() => {
    // Fade out the text after 1 second
    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0, // Fade out to zero opacity
        duration: 1000, // 1 second fade-out duration
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Home'); // Navigate to Home screen after fade-out
      });
    }, 1000); // Wait 1 second before starting fade-out
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: opacityAnim }]}>
        You are set to go!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000', // Black text color
  },
});

export default YouAreSetToGoScreen;

