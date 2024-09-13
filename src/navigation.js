import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons or use your own icons

import HomeScreen from './components/HomeScreen';
import SplashScreen from './components/SplashScreen';
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import YouAreSetToGoScreen from './components/YouAreSetToGoScreen';
import CoffeePreferenceScreen from './screens/CoffeePreferenceScreen';
import AgeRangeScreen from './screens/AgeRangeScreen';
import BioScreen from './screens/BioScreen';
import FavoriteBeanScreen from './screens/FavoriteBeanScreen';
import CoffeeFrequencyScreen from './screens/CoffeeFrequencyScreen';
import ReviewedCafesScreen from './components/ReviewedCafesScreen'; 
import LoyaltyDetailsScreen from './components/LoyaltyDetailsScreen'; 
import MenuScreen from './components/MenuScreen'; 
import CafeOwnerSignupScreen from './screens/CafeOwnerSignupScreen';
import CafeOwnerLoginScreen from './components/CafeOwnerLoginScreen';
import CafeOwnerDashboardScreen from './components/CafeOwnerDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create a Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Grocery') {
            iconName = 'basket';
          } else if (route.name === 'Browse') {
            iconName = 'search';
          } else if (route.name === 'Account') {
            iconName = 'person';
          } else if (route.name === 'Orders') {
            iconName = 'list';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Grocery" component={HomeScreen} />
      <Tab.Screen name="Browse" component={HomeScreen} />
      <Tab.Screen name="Account" component={HomeScreen} />
      <Tab.Screen name="Orders" component={HomeScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="YouAreSetToGo" 
          component={YouAreSetToGoScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CoffeePreference" 
          component={CoffeePreferenceScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgeRange" 
          component={AgeRangeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Bio" 
          component={BioScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="FavoriteBean" 
          component={FavoriteBeanScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CoffeeFrequency" 
          component={CoffeeFrequencyScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home"
          component={MainTabs} // Replace HomeScreen with MainTabs to include the bottom tabs
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ headerShown: true, title: 'Menu' }} 
        />
        <Stack.Screen 
          name="ReviewedCafes" 
          component={ReviewedCafesScreen} // Add the new screen here
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LoyaltyDetails" 
          component={LoyaltyDetailsScreen} 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="CafeOwnerSignup" 
          component={CafeOwnerSignupScreen}  // Register the new screen
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CafeOwnerLogin" 
          component={CafeOwnerLoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CafeOwnerDashboard" 
          component={CafeOwnerDashboardScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
