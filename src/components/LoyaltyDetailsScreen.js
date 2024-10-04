import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoyaltyDetailsScreen = ({ route, navigation }) => {
  const { loyaltyData } = route.params; // Get loyalty data passed from ScanQRCode

  // Convert the loyalty data object into an array for easy mapping in FlatList
  const loyaltyDataArray = Object.keys(loyaltyData).map((cafeId) => {
    return {
      cafeId,
      purchases: loyaltyData[cafeId].purchases,
      threshold: loyaltyData[cafeId].threshold,
    };
  });

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Loyalty Progress</Text>
      
      <FlatList
        data={loyaltyDataArray}
        keyExtractor={(item) => item.cafeId}
        renderItem={({ item }) => (
          <View style={styles.shopItem}>
            <Text style={styles.shopName}>Cafe ID: {item.cafeId}</Text>
            <Text style={styles.progress}>
              {item.purchases}/{item.threshold} purchases made
            </Text>
            <Text style={styles.message}>
              {item.purchases >= item.threshold
                ? 'Congratulations! You earned a free coffee!'
                : `${item.threshold - item.purchases} more purchases needed to get a free coffee.`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Ensure padding to avoid overlap with status bar
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust based on your needs
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20, // Add margin to prevent overlap with next item
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
  message: {
    fontSize: 14,
    color: '#888',
  },
});

export default LoyaltyDetailsScreen;

