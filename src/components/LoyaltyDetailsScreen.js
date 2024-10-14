import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoyaltyDetailsScreen = ({ route, navigation }) => {
  const { loyaltyData } = route.params || {};

  const getStatusMessage = (purchases, threshold) => {
    if (purchases === 0) {
      return "You haven't bought any coffee yet. Start your journey to a free coffee!";
    } else if (purchases >= threshold) {
      return "Congratulations! You've earned a free coffee!";
    } else {
      const remainingCoffees = threshold - purchases;
      return `You've bought ${purchases} coffee${purchases > 1 ? 's' : ''}. ${remainingCoffees} more to go for a free coffee!`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Loyalty Progress</Text>

      {loyaltyData ? (
        <View style={styles.shopItem}>
          <Text style={styles.shopName}>Cafe ID: {loyaltyData.cafe_id}</Text>
          <Text style={styles.progress}>
            Status: {loyaltyData.loyalty_status === 'pending approval' ? 'Approval Pending' : loyaltyData.loyalty_status}
          </Text>
          <Text style={styles.purchases}>Purchases: {loyaltyData.current_purchases}</Text>
          <Text style={styles.threshold}>Threshold: {loyaltyData.threshold}</Text>
          <Text style={styles.reward}>Reward: {loyaltyData.reward_description}</Text>
          <Text style={styles.message}>
            {getStatusMessage(loyaltyData.current_purchases, loyaltyData.threshold)}
          </Text>
        </View>
      ) : (
        <Text>No loyalty progress data available.</Text>
      )}
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  shopItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progress: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  purchases: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: '#4a4a4a',
    fontStyle: 'italic',
  },
});

export default LoyaltyDetailsScreen;