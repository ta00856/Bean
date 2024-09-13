// src/components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.filler, { width: `${progress * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  filler: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green color for the filled part
    borderRadius: 5,
  },
});

export default ProgressBar;
