import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CafeOwnerSignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [menuItem, setMenuItem] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menu, setMenu] = useState([]);

  const handleAddMenuItem = () => {
    if (menuItem && menuPrice) {
      setMenu([...menu, { item: menuItem, price: menuPrice }]);
      setMenuItem('');
      setMenuPrice('');
    }
  };

  const handleSignup = async () => {
    const cafeOwnerData = {
      email,
      password,
      name,
      menu,
    };

    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(email, JSON.stringify(cafeOwnerData));
      } else {
        await AsyncStorage.setItem(email, JSON.stringify(cafeOwnerData));
      }
      console.log('Cafe owner data saved:', cafeOwnerData);

      navigation.navigate('CafeOwnerLogin');
    } catch (error) {
      console.log('Error saving cafe owner data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up as a Cafe Owner</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Cafe Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.subHeader}>Menu Items:</Text>
      
      <View style={styles.menuInputContainer}>
        <TextInput
          style={styles.menuInput}
          placeholder="Add Menu Item"
          value={menuItem}
          onChangeText={setMenuItem}
        />
        <TextInput
          style={[styles.menuInput, styles.priceInput]}
          placeholder="Price"
          value={menuPrice}
          onChangeText={setMenuPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMenuItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {menu.length > 0 && (
        <View style={styles.menuList}>
          {menu.map((item, index) => (
            <Text key={index} style={styles.menuItem}>
              {item.item} - ${item.price}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff', // Background color for input fields
  },
  menuInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  menuInput: {
    flex: 2,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    backgroundColor: '#ffffff', // Background color for input fields
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#ffffff', // Background color for input fields
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  menuList: {
    marginTop: 10,
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 16,
    color: '#555555',
    paddingVertical: 5,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CafeOwnerSignupScreen;
