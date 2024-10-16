import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const LoyaltyDetailsScreen = ({ route, navigation }) => {
  const { email, loyaltyData: initialLoyaltyData } = route.params;
  const [loyaltyData, setLoyaltyData] = useState(initialLoyaltyData);
  const [loading, setLoading] = useState(!initialLoyaltyData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialLoyaltyData) {
      fetchLoyaltyData();
    }
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const response = await axios.get(`https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/user_loyalty_progress?email=${email}`);
      setLoyaltyData(response.data.loyalty_rewards);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching loyalty data:', err);
      setError('Failed to fetch loyalty data. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusMessage = (purchases, threshold, status) => {
    if (status === 'reward_earned') {
      return "Congratulations! You've earned a free coffee!";
    } else if (status === 'pending approval') {
      return "Your purchase is pending approval. Check back later!";
    } else if (purchases === 0) {
      return "You haven't bought any coffee yet. Start your journey to a free coffee!";
    } else {
      const remainingCoffees = threshold - purchases;
      return `You've bought ${purchases} coffee${purchases > 1 ? 's' : ''}. ${remainingCoffees} more to go for a free coffee!`;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Loyalty Progress</Text>

      {loyaltyData && Object.keys(loyaltyData).length > 0 ? (
        Object.values(loyaltyData).map((cafeData, index) => (
          <View key={index} style={styles.shopItem}>
            <Text style={styles.shopName}>Cafe ID: {cafeData.cafe_id}</Text>
            <Text style={styles.progress}>
              Status: {cafeData.status}
            </Text>
            <Text style={styles.purchases}>Purchases: {cafeData.current_purchases}</Text>
            <Text style={styles.threshold}>Threshold: {cafeData.threshold}</Text>
            <Text style={styles.reward}>Reward: {cafeData.reward_description || 'Not specified'}</Text>
            <Text style={styles.message}>
              {getStatusMessage(cafeData.current_purchases, cafeData.threshold, cafeData.status)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No loyalty progress data available.</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  threshold: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  reward: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: '#4a4a4a',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoyaltyDetailsScreen;