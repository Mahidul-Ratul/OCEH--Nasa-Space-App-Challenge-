import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.1)); // Start very small
  const [rotateAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log('🚀 SplashScreen: Starting dramatic animations!');
    
    // Dramatic animation sequence
    Animated.sequence([
      // Logo scales up dramatically
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2, // Overshoot for bounce effect
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      
      // Scale down to normal size
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      
      // Rotation animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      
      // Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      console.log('✅ SplashScreen: All animations completed!');
    });

    // Navigate after 5 seconds to see all animations
    const timer = setTimeout(() => {
      console.log('⏰ SplashScreen: Timer finished, calling onFinish');
      onFinish();
    }, 5000);

    return () => {
      console.log('👋 SplashScreen: Component unmounting');
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, rotateAnim, progressAnim, onFinish]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f1419', '#1a2332', '#2d4a5c']}
        style={styles.gradient}
      >
        {/* Main logo container with animations */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Rotating Earth logo */}
          <Animated.View 
            style={[
              styles.logoPlaceholder,
              {
                transform: [{ rotate: rotation }],
              }
            ]}
          >
            <Text style={styles.earthEmoji}>🌍</Text>
          </Animated.View>
          
          {/* App name with fade */}
          <Animated.Text 
            style={[
              styles.appName,
              { opacity: fadeAnim }
            ]}
          >
            OCEH
          </Animated.Text>
          
          {/* Tagline with fade */}
          <Animated.Text 
            style={[
              styles.tagline,
              { opacity: fadeAnim }
            ]}
          >
            Orbital Circular Economy Hub
          </Animated.Text>
          
          {/* Version with fade */}
          <Animated.View 
            style={[
              styles.versionContainer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.version}>v1.0.0</Text>
          </Animated.View>
        </Animated.View>

        {/* Animated loading section */}
        <Animated.View 
          style={[
            styles.loadingContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                { width: progressWidth }
              ]}
            />
          </View>
          <Text style={styles.loadingText}>
            Initializing Space Debris Tracking...
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoPlaceholder: {
    width: 150, // Bigger for more impact
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3, // Thicker border
    borderColor: 'rgba(100, 200, 255, 0.5)',
    shadowColor: '#64c8ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8, // More visible glow
    shadowRadius: 30,
    elevation: 15,
  },
  earthEmoji: {
    fontSize: 80, // Bigger emoji
  },
  appName: {
    fontSize: 52, // Bigger text
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 10,
    textShadowColor: 'rgba(100, 200, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 18, // Bigger tagline
    color: '#b0c4de',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    letterSpacing: 1,
  },
  versionContainer: {
    marginTop: 20,
  },
  version: {
    fontSize: 14,
    color: '#708090',
    fontWeight: '400',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    width: width - 80,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4, // Thicker loading bar
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#64c8ff',
    borderRadius: 2,
    shadowColor: '#64c8ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  loadingText: {
    fontSize: 16, // Bigger text
    color: '#b0c4de',
    fontWeight: '300',
    textAlign: 'center',
  },
});