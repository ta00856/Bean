import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in to full opacity
      duration: 1000, // 1 second fade-in duration
      useNativeDriver: true,
    }).start(() => {
      // After fade-in is complete, start fade-out after a delay
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out to zero opacity
          duration: 1000, // 1 second fade-out duration
          useNativeDriver: true,
        }).start(() => {
          // After fade-out is complete, navigate to the SignUp screen
          navigation.replace('SignUp'); // Navigate to SignUp screen
        });
      }, 2000); // Wait 2 seconds before starting fade-out
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>BEAN</Text>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.taglineText}>
            YOUR COFFEE COMPASS - DISCOVER, REWARD, CONNECT
          </Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 64, // Increased width
    height: 64, // Increased height to match text size visually
    marginLeft: 3, // Spacing between the text and the logo
  },
  brandText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  taglineText: {
    fontSize: 14,
    fontWeight: 'bold', // Made the tagline text bold
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SplashScreen;




