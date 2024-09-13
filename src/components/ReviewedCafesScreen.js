import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewedCafesScreen = ({ navigation }) => {
  const reviewedCafes = [
    { id: '1', name: 'Cafe Mocha', review: 'Great ambiance and coffee!' },
    { id: '2', name: 'Espresso House', review: 'Strong coffee, just the way I like it.' },
    { id: '3', name: 'Latte Lounge', review: 'Lovely place for a relaxed coffee.' },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Cafes You've Reviewed</Text>

      <FlatList
        data={reviewedCafes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cafeItem}>
            <Text style={styles.cafeName}>{item.name}</Text>
            <Text style={styles.cafeReview}>{item.review}</Text>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.badgeContainer} onPress={() => navigation.navigate('LoyaltyDetails')}>
            <Ionicons name="trophy-outline" size={50} color="#FFD700" />
            <Text style={styles.badgeText}>Your Loyalty Badge</Text>
          </TouchableOpacity>
        }
      />
    </View>
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
  badgeContainer: {
    marginTop: 30, // Space between the last review and the badge
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 18,
    marginTop: 10, // Space between the icon and the text
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cafeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cafeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cafeReview: {
    fontSize: 14,
    color: '#555',
  },
});

export default ReviewedCafesScreen;

