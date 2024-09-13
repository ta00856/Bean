import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CafeOwnerDashboardScreen = ({ route }) => {
  const { menu } = route.params;
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState('');
  const [total, setTotal] = useState(0);

  const handleSelectItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
    setTotal((prevTotal) => prevTotal + parseFloat(item.price));
  };

  const handleOrder = async () => {
    // Save order statically without checking the user's existence
    try {
      await AsyncStorage.setItem('staticOrder', JSON.stringify({ total }));
      alert('Order sent to customer!');
      setSelectedItems([]);
      setEmail('');
      setTotal(0);
    } catch (error) {
      console.error('Error handling order:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Menu</Text>
      {menu.length === 0 ? (
        <Text style={styles.noMenuText}>No menu items added yet.</Text>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.item}</Text>
              <Text style={styles.menuItemPrice}>${item.price}</Text>
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <Ionicons name="add-circle-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter customer email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    minHeight: Dimensions.get('window').height, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noMenuText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    width: '100%',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    flex: 3,
  },
  menuItemPrice: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CafeOwnerDashboardScreen;
