import React from 'react';
import * as Progress from 'react-native-progress';
import { View, StyleSheet } from 'react-native';

const ProgressCircle = ({ progress }) => (
  <View style={styles.container}>
    <Progress.Circle
      size={100}
      progress={progress}
      showsText={false}
      color="#4CAF50"
      thickness={8}
      unfilledColor="#ccc"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default ProgressCircle;
