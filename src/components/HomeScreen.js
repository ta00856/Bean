import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [address, setAddress] = useState('Fetching location...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [registeredCafes, setRegisteredCafes] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const locationFetched = useRef(false);

  const googleApiKey = 'AIzaSyDtqiqQ8nZcCoFvVJE-2sOvsn7fecogtsE';

  useEffect(() => {
    const getLocationAndCafes = async () => {
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
        await fetchRegisteredCafes(latitude, longitude);

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

    getLocationAndCafes();
    checkOrderPlaced();
  }, [email]);

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
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRadians = degree => degree * (Math.PI / 180);

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance / 1609.34;
  };

  const fetchCafePhoto = async (location, cafeName) => {
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(cafeName)}&inputtype=textquery&locationbias=point:${location.latitude},${location.longitude}&fields=photos&key=${googleApiKey}`;
      const response = await fetch(searchUrl);
      const result = await response.json();

      if (result.candidates && result.candidates[0] && result.candidates[0].photos) {
        const photoReference = result.candidates[0].photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching cafe photo:', error);
      return null;
    }
  };



  const getCoordinatesFromAddress = async (address) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === 'OK') {
      const { lat, lng } = result.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.error(`Geocoding error: ${result.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

const fetchRegisteredCafes = async (latitude, longitude) => {
  try {
    setIsLoading(true);
    const response = await fetch('https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/get_all_cafe_owners');
    const cafes = await response.json();

    const approvedCafes = cafes.filter(cafe => cafe.status === 'approved');

    const enhancedCafes = await Promise.all(
      approvedCafes.map(async (cafe) => {
        // Fetch coordinates for the cafe location
        const cafeCoords = await getCoordinatesFromAddress(cafe.location);

        if (cafeCoords) {
          const distance = calculateDistance(latitude, longitude, cafeCoords.latitude, cafeCoords.longitude);
          const photoUrl = await fetchCafePhoto({ latitude, longitude }, cafe.cafe_name);

          return {
            id: cafe.owner_id,
            name: cafe.cafe_name,
            distance: `${distance.toFixed(1)} miles away`,
            status: 'Open Now',
            image: photoUrl,
            location: cafe.location
          };
        } else {
          console.error(`Could not fetch coordinates for cafe: ${cafe.cafe_name}`);
          return null;
        }
      })
    );

    const sortedCafes = enhancedCafes
      .filter(cafe => cafe !== null)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    setRegisteredCafes(sortedCafes);
    setIsLoading(false);
  } catch (error) {
    console.error('Error fetching registered cafes:', error);
    Alert.alert('Error', 'Failed to fetch coffee shops. Please try again later.');
    setIsLoading(false);
  }
};


  const handleManualLocationSearch = async () => {
    if (!manualLocation) return;
    Keyboard.dismiss();
    
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${manualLocation}&key=${googleApiKey}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.status === 'OK') {
        const { lat, lng } = result.results[0].geometry.location;
        setLocation({ coords: { latitude: lat, longitude: lng } });
        await fetchRegisteredCafes(lat, lng);
      } else {
        setErrorMsg('Location not found. Please try another address.');
      }
    } catch (error) {
      console.error('Error fetching geocode data:', error);
      setErrorMsg('Unable to search for the entered location.');
    }
  };

  const handlePayment = () => {
    alert(`Paying ${total}`);
    setTotal(0);
    setOrderPlaced(false);
    AsyncStorage.removeItem('orderPlaced');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout",
          onPress: async () => {
            try {
              setIsLoading(true);
              
              const authDataStr = await AsyncStorage.getItem('authData');
              if (!authDataStr) {
                throw new Error('No authentication data found');
              }
              
              const authData = JSON.parse(authDataStr);
              
              const response = await fetch(
                'https://7wxy3171va.execute-api.eu-west-2.amazonaws.com/dev/logout',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.accessToken}`
                  }
                }
              );
  
              if (response.ok) {
                await AsyncStorage.multiRemove(['authData', 'accessToken', 'orderPlaced']);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                const result = await response.json();
                if (response.status === 401) {
                  await AsyncStorage.multiRemove(['authData', 'accessToken', 'orderPlaced']);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                } else {
                  throw new Error(result.error || 'Failed to logout');
                }
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
              
              if (error.message.includes('authentication') || error.message.includes('token')) {
                await AsyncStorage.multiRemove(['authData', 'accessToken', 'orderPlaced']);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.locationText}>{address}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              onPress={handleLogout}
              disabled={isLoading}
            >
              <Ionicons 
                name="log-out-outline" 
                size={30} 
                color={isLoading ? "#cccccc" : "black"} 
                style={styles.logoutIcon} 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ScanQRCode', { email: email })}>
              <Ionicons name="qr-code-outline" size={30} color="black" style={styles.scanIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LoyaltyDetails', { email: email })}>
              <Ionicons name="ribbon-outline" size={30} color="black" style={styles.loyaltyIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {orderPlaced && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay ${total.toFixed(2)}</Text>
          </TouchableOpacity>
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nearby Coffee Shops by Postcode/Location"
              value={manualLocation}
              onChangeText={setManualLocation}
              onSubmitEditing={handleManualLocationSearch}
            />
            <TouchableOpacity onPress={handleManualLocationSearch}>
              <Text style={styles.searchButton}>Search</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.adContainer}>
            <Image
              source={require('../../assets/images/ad.jpg')}
              style={styles.adImage}
            />
          </TouchableOpacity>

          <View style={styles.shopContainer}>
            <Text style={styles.sectionTitle}>Nearest Coffee Shops registered on Bean</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text>Loading cafes...</Text>
              </View>
            ) : registeredCafes.length === 0 ? (
              <Text style={styles.noCafesText}>No registered cafes found nearby</Text>
            ) : (
              registeredCafes.map(shop => (
                <TouchableOpacity
                  key={shop.id}
                  style={styles.shopItem}
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
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


// Add styles for the manual search functionality
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
  logoutIcon: {
    marginRight: 15,
    opacity: 0.8, // Makes the icon slightly softer
  },
  scanIcon: {
    marginRight: 15,
  },
  loyaltyIcon: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#f1f1f1',
  },
  searchButton: {
    paddingLeft: 10,
    color: '#007BFF',
    fontWeight: 'bold',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noCafesText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  }
});

export default HomeScreen;  
