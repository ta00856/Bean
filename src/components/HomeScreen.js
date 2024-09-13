import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [firstNameLetter, setFirstNameLetter] = useState('');
  const [total, setTotal] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const checkOrderPlaced = async () => {
      try {
        const orderData = await AsyncStorage.getItem('orderPlaced');
        if (orderData) {
          const parsedData = JSON.parse(orderData);
          setTotal(parsedData.total);
          setOrderPlaced(true);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    checkOrderPlaced();
  }, []);

  const handlePayment = () => {
    alert(`Paying ${total}`);
    setTotal(0);
    setOrderPlaced(false);
    AsyncStorage.removeItem('orderPlaced');
  };

  const coffeeShops = [
    {
      id: '1',
      name: 'Black Sheep',
      distance: '0.5 miles away',
      status: 'Open Now',
      image: require('../../assets/images/blacksheep.jpg'),
      menu: ['Espresso', 'Cappuccino', 'Latte', 'Mocha'],
    },
    {
      id: '2',
      name: 'Muffin Break',
      distance: '0.8 miles away',
      status: 'Open Now',
      image: require('../../assets/images/muffin.png'),
      menu: ['Americano', 'Flat White', 'Macchiato', 'Hot Chocolate'],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.locationText}>HP13 6A2</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={30} color="black" style={styles.notificationIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ReviewedCafes')}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileText}>{firstNameLetter}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Button */}
      {orderPlaced && (
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Coffee Shops"
          />
        </View>

        <TouchableOpacity style={styles.adContainer}>
          <Image
            source={require('../../assets/images/ad.jpg')}
            style={styles.adImage}
          />
        </TouchableOpacity>

        <View style={styles.shopContainer}>
          <Text style={styles.sectionTitle}>Nearest Coffee Shops</Text>

          {coffeeShops.map(shop => (
            <TouchableOpacity
              key={shop.id}
              style={styles.shopItem}
              onPress={() => navigation.navigate('Menu', { shopName: shop.name, menu: shop.menu })}
            >
              <Image
                source={shop.image}
                style={styles.shopImage}
              />
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopInfo}>{shop.distance} • {shop.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationIcon: {
    marginRight: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#f1f1f1',
  },
  adContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  adImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  shopContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shopInfo: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
