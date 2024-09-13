import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons if you haven't

const MenuScreen = ({ route, navigation }) => {
  const { shopName, menu } = route.params; // Get shop name and menu from navigation params

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>{shopName} Menu</Text>
        {/* Local QR Code Image */}
        <Image
          source={require('../../assets/images/QR.png')} // Adjust the path based on the location of MenuScreen.js
          style={styles.qrCode}
        />
      </View>
      <FlatList
        data={menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1, // Added to center the title text
    textAlign: 'center', // Align the title in the center
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
  },
});

export default MenuScreen;
