import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoyaltyDetailsScreen = ({ navigation }) => {
  // Dummy data for loyalty progress at different coffee shops
  const loyaltyData = [
    { id: '1', shopName: 'Black Sheep', progress: '3/5', message: '2 more to go for a free coffee!' },
    { id: '2', shopName: 'Muffin Break', progress: '800/1000', message: '200 more points needed to get a free cup.' },
    // Add more shops and their loyalty progress here
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('ReviewedCafes')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Loyalty Progress</Text>
      
      <FlatList
        data={loyaltyData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.shopItem}>
            <Text style={styles.shopName}>{item.shopName}</Text>
            <Text style={styles.progress}>{item.progress}</Text>
            <Text style={styles.message}>{item.message}</Text>
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


