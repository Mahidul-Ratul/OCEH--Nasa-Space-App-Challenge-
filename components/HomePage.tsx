import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DebrisStats {
  totalDebris: number;
  smallDebrisRemovedToday: number;
  largeDebrisCapturedToday: number;
  recycledMaterialInventory: number;
}

interface HomePageProps {
  onNavigateToDebris?: () => void;
  onNavigateToBusiness?: () => void;
  onNavigateToRecycling?: () => void;
  onNavigateToServiceDrones?: () => void;
}

export default function HomePage({ onNavigateToDebris, onNavigateToBusiness, onNavigateToRecycling, onNavigateToServiceDrones }: HomePageProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const earthRotateAnim = useRef(new Animated.Value(0)).current;
  const earthOrbitAnim = useRef(new Animated.Value(0)).current; // New orbital animation
  const statsAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  // Debris marker animations
  const debrisAnimations = useRef(
    Array.from({ length: 7 }, () => ({
      float: new Animated.Value(0),
      pulse: new Animated.Value(1),
    }))
  ).current;

  const [stats, setStats] = useState<DebrisStats>({
    totalDebris: 15847,
    smallDebrisRemovedToday: 23,
    largeDebrisCapturedToday: 7,
    recycledMaterialInventory: 342.5,
  });

  const [displayStats, setDisplayStats] = useState<DebrisStats>({
    totalDebris: 0,
    smallDebrisRemovedToday: 0,
    largeDebrisCapturedToday: 0,
    recycledMaterialInventory: 0,
  });

  // Start animations when component mounts
  useEffect(() => {
    console.log('🏠 HomePage: Starting animations');
    
    // Staggered entry animations
    Animated.stagger(200, [
      // Header fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Content slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      
      // Stats counter animations
      ...statsAnimations.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ),
    ]).start();

    // Start Earth rotation
    const rotateEarth = () => {
      earthRotateAnim.setValue(0);
      Animated.timing(earthRotateAnim, {
        toValue: 1,
        duration: 8000, // 8 seconds for full rotation (faster)
        useNativeDriver: true,
      }).start(() => rotateEarth()); // Loop forever
    };
    rotateEarth();

    // Start Earth orbital movement (subtle floating)
    const orbitEarth = () => {
      earthOrbitAnim.setValue(0);
      Animated.timing(earthOrbitAnim, {
        toValue: 1,
        duration: 12000, // 12 seconds for orbital cycle
        useNativeDriver: true,
      }).start(() => orbitEarth()); // Loop forever
    };
    orbitEarth();

    // Start debris marker animations
    debrisAnimations.forEach((debris, index) => {
      // Floating animation
      const floatAnimation = () => {
        Animated.sequence([
          Animated.timing(debris.float, {
            toValue: 1,
            duration: 2000 + (index * 200), // Stagger timing
            useNativeDriver: true,
          }),
          Animated.timing(debris.float, {
            toValue: 0,
            duration: 2000 + (index * 200),
            useNativeDriver: true,
          }),
        ]).start(() => floatAnimation());
      };
      
      // Pulse animation
      const pulseAnimation = () => {
        Animated.sequence([
          Animated.timing(debris.pulse, {
            toValue: 1.3,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(debris.pulse, {
            toValue: 1,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
        ]).start(() => pulseAnimation());
      };
      
      setTimeout(() => {
        floatAnimation();
        pulseAnimation();
      }, index * 300);
    });

    // Animate counters
    statsAnimations.forEach((anim, index) => {
      anim.addListener(({ value }) => {
        const statKeys = ['totalDebris', 'smallDebrisRemovedToday', 'largeDebrisCapturedToday', 'recycledMaterialInventory'] as const;
        const statKey = statKeys[index];
        const targetValue = stats[statKey];
        
        setDisplayStats(prev => ({
          ...prev,
          [statKey]: Math.floor(targetValue * value),
        }));
      });
    });

    return () => {
      statsAnimations.forEach(anim => anim.removeAllListeners());
    };
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalDebris: prev.totalDebris + Math.floor(Math.random() * 3),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navigationButtons = [
    {
      title: 'Go to Debris Tracking',
      icon: 'telescope-outline',
      color: '#ff6b6b',
      onPress: () => onNavigateToDebris?.(),
    },
    {
      title: 'Go to Recycling Hub',
      icon: 'leaf-outline',
      color: '#4ecdc4',
      onPress: () => onNavigateToRecycling?.(),
    },
    {
      title: 'Service Drones',
      icon: 'airplane-outline',
      color: '#a55eea',
      onPress: () => onNavigateToServiceDrones?.(),
    },
    {
      title: 'View Business Dashboard',
      icon: 'analytics-outline',
      color: '#45b7d1',
      onPress: () => onNavigateToBusiness?.(),
    },
  ];

  // Button press animation
  const animateButtonPress = (callback: () => void) => {
    const buttonScale = new Animated.Value(1);
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(callback, 50);
  };

  // Earth rotation interpolation
  const earthRotation = earthRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Earth orbital movement interpolation (subtle floating effect)
  const earthOrbitX = earthOrbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 3, 0, -3, 0],
  });

  const earthOrbitY = earthOrbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -2, 0, 2, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />
      
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <LinearGradient
          colors={['#0f1419', '#1a2332']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🌍</Text>
              <Text style={styles.headerTitle}>OCEH Hub</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#ffffff" />
              <Animated.View 
                style={[
                  styles.notificationBadge,
                  {
                    transform: [{
                      scale: debrisAnimations[0]?.pulse || new Animated.Value(1)
                    }]
                  }
                ]}
              >
                <Text style={styles.badgeText}>3</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Animated 3D Earth Visualization Section */}
        <Animated.View 
          style={[
            styles.earthSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Real-time Debris Tracking</Text>
          <View style={styles.earthContainer}>
            {/* Animated rotating and orbiting Earth */}
            <Animated.View 
              style={[
                styles.earthPlaceholder,
                {
                  transform: [
                    { translateX: earthOrbitX },
                    { translateY: earthOrbitY },
                    { rotate: earthRotation },
                  ],
                }
              ]}
            >
              <Text style={styles.earthIcon}>🌍</Text>
              
              {/* Animated debris dots overlay */}
              {debrisAnimations.map((debris, index) => {
                const positions = [
                  { top: '20%', left: '30%' },
                  { top: '40%', right: '25%' },
                  { bottom: '30%', left: '20%' },
                  { top: '60%', left: '70%' },
                  { bottom: '20%', right: '30%' },
                  { top: '15%', right: '40%' },
                  { bottom: '45%', left: '50%' },
                ];
                
                const isGreen = index % 3 === 0; // Some green, some red
                
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.debrisMarker,
                      isGreen ? styles.greenDot : styles.redDot,
                      positions[index] as any, // Type assertion to fix the issue
                      {
                        transform: [
                          { 
                            translateY: debris.float.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -10],
                            })
                          },
                          { scale: debris.pulse }
                        ],
                      }
                    ]}
                  />
                );
              })}
            </Animated.View>
            
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.redDot]} />
                <Text style={styles.legendText}>Small debris (&lt;10 cm)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.greenDot]} />
                <Text style={styles.legendText}>Large debris (&gt;10 cm)</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Animated Stats Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 25],
                })
              }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Today's Statistics</Text>
          <View style={styles.statsGrid}>
            <Animated.View 
              style={[
                styles.statCard,
                {
                  transform: [{ 
                    scale: statsAnimations[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }],
                  opacity: statsAnimations[0],
                }
              ]}
            >
              <Ionicons name="planet-outline" size={32} color="#64c8ff" />
              <Text style={styles.statNumber}>{displayStats.totalDebris.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total debris tracked</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.statCard,
                {
                  transform: [{ 
                    scale: statsAnimations[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }],
                  opacity: statsAnimations[1],
                }
              ]}
            >
              <Ionicons name="trash-outline" size={32} color="#ff6b6b" />
              <Text style={styles.statNumber}>{displayStats.smallDebrisRemovedToday}</Text>
              <Text style={styles.statLabel}>Small debris removed today</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.statCard,
                {
                  transform: [{ 
                    scale: statsAnimations[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }],
                  opacity: statsAnimations[2],
                }
              ]}
            >
              <Ionicons name="magnet-outline" size={32} color="#4ecdc4" />
              <Text style={styles.statNumber}>{displayStats.largeDebrisCapturedToday}</Text>
              <Text style={styles.statLabel}>Large debris captured today</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.statCard,
                {
                  transform: [{ 
                    scale: statsAnimations[3].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }],
                  opacity: statsAnimations[3],
                }
              ]}
            >
              <Ionicons name="leaf-outline" size={32} color="#95e1d3" />
              <Text style={styles.statNumber}>{displayStats.recycledMaterialInventory} kg</Text>
              <Text style={styles.statLabel}>Recycled material inventory</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Animated Action Buttons */}
        <Animated.View 
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 35],
                })
              }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {navigationButtons.map((button, index) => (
            <Animated.View
              key={index}
              style={{
                transform: [{ 
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  })
                }],
                opacity: fadeAnim,
              }}
            >
              <TouchableOpacity
                style={[styles.actionButton, { borderLeftColor: button.color }]}
                onPress={() => animateButtonPress(button.onPress)}
              >
                <View style={styles.actionButtonContent}>
                  <Ionicons name={button.icon as any} size={24} color={button.color} />
                  <Text style={styles.actionButtonText}>{button.title}</Text>
                  <Ionicons name="chevron-forward-outline" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Animated Recent Activity */}
        <Animated.View 
          style={[
            styles.activitySection,
            {
              opacity: fadeAnim,
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 45],
                })
              }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#ff6b6b20' }]}>
                <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Small debris removed from orbit 420km</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#4ecdc420' }]}>
                <Ionicons name="magnet-outline" size={16} color="#4ecdc4" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Large debris captured successfully</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#95e1d320' }]}>
                <Ionicons name="leaf-outline" size={16} color="#95e1d3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>5.2kg of material added to recycling inventory</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    marginTop: 20,
  },
  earthSection: {
    marginTop: 10,
  },
  earthContainer: {
    backgroundColor: '#1a2332',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  earthPlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#2d4a5c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#64c8ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  earthIcon: {
    fontSize: 100,
  },
  debrisMarker: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  redDot: {
    backgroundColor: '#ff6b6b',
  },
  greenDot: {
    backgroundColor: '#4ecdc4',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#b0c4de',
    fontSize: 14,
  },
  statsSection: {
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#b0c4de',
    textAlign: 'center',
    lineHeight: 16,
  },
  actionsSection: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
    fontWeight: '500',
  },
  activitySection: {
    marginTop: 10,
    marginBottom: 30,
  },
  activityList: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d4a5c',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#708090',
  },
});