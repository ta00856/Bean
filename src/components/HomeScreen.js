import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons for icons
import * as Location from 'expo-location';

const HomeScreen = ({ navigation, route }) => {
  const { email } = route.params; // Retrieve email from previous screen's route params
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [total, setTotal] = useState(0);

  const locationFetched = useRef(false);

  // Google API Key (for both Places and Geocoding)
  const googleApiKey = 'AIzaSyDtqiqQ8nZcCoFvVJE-2sOvsn7fecogtsE'; // Replace this with your Google API key

  useEffect(() => {
    const getLocationAndCoffeeShops = async () => {
      if (locationFetched.current) return;

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        const latitude = currentLocation.coords.latitude;
        const longitude = currentLocation.coords.longitude;

        fetchAddress(latitude, longitude);
        fetchCoffeeShops(latitude, longitude);

        locationFetched.current = true;
      } catch (error) {
        setErrorMsg('Unable to fetch location.');
        console.error('Error getting location:', error);
      }
    };

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

    getLocationAndCoffeeShops();
    checkOrderPlaced();

    // Log the email passed from the previous screen
    console.log('Email passed to HomeScreen:', email);

  }, [email]);

  // Function to fetch address using reverse geocoding
  const fetchAddress = async (latitude, longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.status === 'OK') {
        const addressComponents = result.results[0].address_components;
        const postalCode = addressComponents.find(component => component.types.includes('postal_code'));
        const area = addressComponents.find(component => component.types.includes('locality'));

        const readableAddress = `${postalCode ? postalCode.long_name : ''} ${area ? area.long_name : ''}`;
        setAddress(readableAddress);
      } else {
        setAddress('Unable to fetch address');
        console.error('Error fetching address:', result.status);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    }
  };

  // Haversine formula to calculate the distance between two latitude/longitude points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = degree => degree * (Math.PI / 180);

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance / 1609.34; // Convert to miles
  };

  const fetchCoffeeShops = async (latitude, longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=cafe&keyword=coffee&key=${googleApiKey}`;
      const response = await fetch(url);
      const result = await response.json();

      const coffeeShopsData = result.results.map(shop => {
        const shopLat = shop.geometry.location.lat;
        const shopLng = shop.geometry.location.lng;
        const distance = calculateDistance(latitude, longitude, shopLat, shopLng);

        return {
          id: shop.place_id,
          name: shop.name,
          distance: `${distance.toFixed(1)} miles away`,
          status: shop.opening_hours ? (shop.opening_hours.open_now ? 'Open Now' : 'Closed') : 'Unknown',
          image: shop.photos
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${shop.photos[0].photo_reference}&key=${googleApiKey}`
            : null,
        };
      });

      setCoffeeShops(coffeeShopsData);
    } catch (error) {
      console.error('Error fetching coffee shops:', error);
      Alert.alert('Error', 'Failed to fetch coffee shops. Please try again later.');
    }
  };

  const handlePayment = () => {
    alert(`Paying ${total}`);
    setTotal(0);
    setOrderPlaced(false);
    AsyncStorage.removeItem('orderPlaced');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Display email at the top */}
        

        <View style={styles.headerContainer}>
          <Text style={styles.locationText}>{address}</Text>
          <View style={styles.iconContainer}>
            {/* Add the Scan Icon here */}
            <TouchableOpacity onPress={() => navigation.navigate('ScanQRCode',{ email:email})}>
              <Ionicons name="qr-code-outline" size={30} color="black" style={styles.scanIcon} />
            </TouchableOpacity>

            {/* Loyalty Badge Icon */}
            <TouchableOpacity onPress={() => navigation.navigate('LoyaltyDetails')}>
              <Ionicons name="ribbon-outline" size={30} color="black" style={styles.loyaltyIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ReviewedCafes')}>
              <View style={styles.profileIcon}>
                <Text style={styles.profileText}>A</Text>
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
                {shop.image ? (
                  <Image
                    source={{ uri: shop.image }}
                    style={styles.shopImage}
                  />
                ) : (
                  <View style={styles.shopPlaceholderImage} />
                )}
                <View style={styles.shopDetails}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopInfo}>{shop.distance} • {shop.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};



// Add styles for the scan icon
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
  scanIcon: {
    marginRight: 15, // Adjusted margin to align with other icons
  },
  loyaltyIcon: {
    marginRight: 15, // Adjusted margin to align with profile icon
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
  locationText: {
    fontSize: 16,
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
  shopPlaceholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#cccccc',
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
