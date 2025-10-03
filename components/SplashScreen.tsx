import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
  const [scaleAnim] = useState(new Animated.Value(0.3)); // Start smaller for more dramatic effect
  const [slideAnim] = useState(new Animated.Value(50)); // Add slide animation
  const [logoRotateAnim] = useState(new Animated.Value(0)); // Add rotation animation
  const [progressAnim] = useState(new Animated.Value(0)); // Progress bar animation

  useEffect(() => {
    console.log('SplashScreen: Component mounted, starting animations');
    
    // Start animations in sequence for more dramatic effect
    Animated.sequence([
      // First: Logo appears and scales up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then: Logo gentle rotation
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Finally: Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false, // Width animation needs layout
      }),
    ]).start(() => {
      console.log('SplashScreen: All animations completed');
    });

    // Auto-navigate to main app after 4.5 seconds
    const timer = setTimeout(() => {
      console.log('SplashScreen: Timer finished, calling onFinish');
      onFinish();
    }, 4500);

    return () => {
      console.log('SplashScreen: Component unmounting');
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim, slideAnim, logoRotateAnim, progressAnim, onFinish]);

  const logoRotate = logoRotateAnim.interpolate({
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
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* OCEH Logo Placeholder with rotation */}
          <Animated.View 
            style={[
              styles.logoPlaceholder,
              {
                transform: [{ rotate: logoRotate }],
              }
            ]}
          >
            <Text style={styles.earthEmoji}>🌍</Text>
          </Animated.View>
          
          <Animated.Text 
            style={[
              styles.appName,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            OCEH
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.tagline,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            Orbital Circular Economy Hub
          </Animated.Text>
          
          <Animated.View 
            style={[
              styles.versionContainer,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <Text style={styles.version}>v1.0.0</Text>
          </Animated.View>
        </Animated.View>

        {/* Loading indicator with animated progress */}
        <Animated.View 
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Animated.Text 
            style={[
              styles.loadingText,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            Initializing Space Debris Tracking...
          </Animated.Text>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(100, 200, 255, 0.3)',
    shadowColor: '#64c8ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  earthEmoji: {
    fontSize: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 10,
    textShadowColor: 'rgba(100, 200, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#b0c4de',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
    letterSpacing: 1,
  },
  versionContainer: {
    marginTop: 20,
  },
  version: {
    fontSize: 12,
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
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
    backgroundColor: '#64c8ff',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#b0c4de',
    fontWeight: '300',
    textAlign: 'center',
  },
});