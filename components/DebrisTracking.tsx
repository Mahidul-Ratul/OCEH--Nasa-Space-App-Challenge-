import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DebrisObject {
  id: string;
  size: 'Small' | 'Large';
  orbitAltitude: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Destroying' | 'Capturing' | 'Completed';
  type: string;
}

interface DebrisTrackingProps {
  onNavigateBack?: () => void;
}

export default function DebrisTracking({ onNavigateBack }: DebrisTrackingProps) {
  const [debrisList, setDebrisList] = useState<DebrisObject[]>([
    {
      id: 'DB-001',
      size: 'Small',
      orbitAltitude: 420,
      riskLevel: 'High',
      status: 'Active',
      type: 'Paint Fleck',
    },
    {
      id: 'DB-002',
      size: 'Large',
      orbitAltitude: 650,
      riskLevel: 'Critical',
      status: 'Active',
      type: 'Satellite Fragment',
    },
    {
      id: 'DB-003',
      size: 'Small',
      orbitAltitude: 380,
      riskLevel: 'Medium',
      status: 'Active',
      type: 'Bolt',
    },
    {
      id: 'DB-004',
      size: 'Large',
      orbitAltitude: 800,
      riskLevel: 'High',
      status: 'Active',
      type: 'Rocket Stage',
    },
    {
      id: 'DB-005',
      size: 'Small',
      orbitAltitude: 450,
      riskLevel: 'Low',
      status: 'Active',
      type: 'Screw',
    },
  ]);

  const handleDestroy = (debris: DebrisObject) => {
    if (debris.size !== 'Small') {
      Alert.alert('Invalid Action', 'Only small debris can be destroyed via reentry burn.');
      return;
    }

    Alert.alert(
      'Confirm Destruction',
      `Initiate reentry burn for ${debris.type} (${debris.id})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Destroy',
          style: 'destructive',
          onPress: () => {
            setDebrisList(prev =>
              prev.map(item =>
                item.id === debris.id ? { ...item, status: 'Destroying' } : item
              )
            );
            
            setTimeout(() => {
              setDebrisList(prev =>
                prev.map(item =>
                  item.id === debris.id ? { ...item, status: 'Completed' } : item
                )
              );
            }, 3000);
          },
        },
      ]
    );
  };

  const handleCapture = (debris: DebrisObject) => {
    if (debris.size !== 'Large') {
      Alert.alert('Invalid Action', 'Only large debris can be captured by drones.');
      return;
    }

    Alert.alert(
      'Confirm Capture',
      `Deploy capture drone for ${debris.type} (${debris.id})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Capture',
          onPress: () => {
            setDebrisList(prev =>
              prev.map(item =>
                item.id === debris.id ? { ...item, status: 'Capturing' } : item
              )
            );
            
            setTimeout(() => {
              setDebrisList(prev =>
                prev.map(item =>
                  item.id === debris.id ? { ...item, status: 'Completed' } : item
                )
              );
            }, 4000);
          },
        },
      ]
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return '#2ed573';
      case 'Medium': return '#ffa502';
      case 'High': return '#ff6348';
      case 'Critical': return '#ff3838';
      default: return '#4ecdc4';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4ecdc4';
      case 'Destroying': return '#ff6348';
      case 'Capturing': return '#ffa502';
      case 'Completed': return '#2ed573';
      default: return '#4ecdc4';
    }
  };

  const getDebrisIcon = (type: string) => {
    switch (type) {
      case 'Paint Fleck': return 'water';
      case 'Satellite Fragment': return 'radio';
      case 'Bolt': return 'hardware-chip';
      case 'Rocket Stage': return 'rocket';
      case 'Screw': return 'build';
      default: return 'ellipse';
    }
  };

  // Calculate statistics
  const totalDebris = debrisList.length;
  const activeDebris = debrisList.filter(d => d.status === 'Active').length;
  const criticalDebris = debrisList.filter(d => d.riskLevel === 'Critical').length;
  const completedDebris = debrisList.filter(d => d.status === 'Completed').length;

  const OverviewCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: number; 
    icon: string; 
    color: string; 
    subtitle: string;
  }) => (
    <View style={[styles.overviewCard, { borderLeftColor: color }]}>
      <View style={styles.overviewHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={styles.overviewTitle}>{title}</Text>
      </View>
      <Text style={[styles.overviewValue, { color }]}>{value}</Text>
      <Text style={styles.overviewSubtitle}>{subtitle}</Text>
    </View>
  );

  const DebrisCard = ({ debris }: { debris: DebrisObject }) => (
    <View style={[styles.debrisCard, { borderLeftColor: getRiskColor(debris.riskLevel) }]}>
      <View style={styles.debrisHeader}>
        <View style={styles.debrisIdSection}>
          <Ionicons name={getDebrisIcon(debris.type) as any} size={24} color="#4ecdc4" />
          <View style={styles.debrisInfo}>
            <Text style={styles.debrisId}>{debris.id}</Text>
            <Text style={styles.debrisType}>{debris.type}</Text>
          </View>
        </View>
        <View style={[styles.sizeBadge, { backgroundColor: debris.size === 'Large' ? '#ff6b6b' : '#4ecdc4' }]}>
          <Text style={styles.sizeText}>{debris.size}</Text>
        </View>
      </View>

      <View style={styles.debrisDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#8395a7" />
          <Text style={styles.detailLabel}>Altitude:</Text>
          <Text style={styles.detailValue}>{debris.orbitAltitude} km</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="warning" size={16} color={getRiskColor(debris.riskLevel)} />
          <Text style={styles.detailLabel}>Risk Level:</Text>
          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(debris.riskLevel) }]}>
            <Text style={styles.riskText}>{debris.riskLevel}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="pulse" size={16} color={getStatusColor(debris.status)} />
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(debris.status) }]}>
            <Text style={styles.statusText}>{debris.status}</Text>
          </View>
        </View>
      </View>

      {debris.status === 'Active' && (
        <View style={styles.actionButtons}>
          {debris.size === 'Small' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.destroyButton]} 
              onPress={() => handleDestroy(debris)}
            >
              <Ionicons name="flame" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Reentry Burn</Text>
            </TouchableOpacity>
          )}
          {debris.size === 'Large' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.captureButton]} 
              onPress={() => handleCapture(debris)}
            >
              <Ionicons name="airplane" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Deploy Drone</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f1419', '#1a2332', '#0f1419']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
              <Ionicons name="arrow-back" size={24} color="#4ecdc4" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Debris Tracking & Cleanup</Text>
              <Text style={styles.headerSubtitle}>Orbital Cleanup Operations Center</Text>
            </View>
            <View style={styles.headerStats}>
              <Text style={styles.headerStatsNumber}>{activeDebris}</Text>
              <Text style={styles.headerStatsLabel}>Active</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Overview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mission Overview</Text>
            <View style={styles.overviewGrid}>
              <OverviewCard
                title="Total Objects"
                value={totalDebris}
                icon="telescope"
                color="#4ecdc4"
                subtitle="Tracked debris"
              />
              <OverviewCard
                title="Critical Risk"
                value={criticalDebris}
                icon="warning"
                color="#ff3838"
                subtitle="Immediate action"
              />
              <OverviewCard
                title="Completed"
                value={completedDebris}
                icon="checkmark-circle"
                color="#2ed573"
                subtitle="Successfully cleaned"
              />
            </View>
          </View>

          {/* Active Debris Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Debris Objects</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{activeDebris} Active</Text>
              </View>
            </View>
            
            {debrisList.map((debris) => (
              <DebrisCard key={debris.id} debris={debris} />
            ))}
          </View>

          {/* Cleanup Operations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cleanup Operations</Text>
            
            <View style={styles.operationsGrid}>
              {/* Reentry Burn Operation */}
              <View style={styles.operationCard}>
                <LinearGradient
                  colors={['rgba(255, 99, 72, 0.1)', 'rgba(255, 99, 72, 0.05)']}
                  style={styles.operationGradient}
                >
                  <View style={styles.operationHeader}>
                    <Ionicons name="flame" size={24} color="#ff6348" />
                    <Text style={styles.operationTitle}>Reentry Burn</Text>
                  </View>
                  
                  <Text style={styles.operationDescription}>
                    Controlled atmospheric reentry for small debris objects
                  </Text>
                  
                  <View style={styles.operationStats}>
                    <View style={styles.operationStat}>
                      <Text style={styles.operationStatValue}>
                        {debrisList.filter(d => d.size === 'Small' && d.status === 'Active').length}
                      </Text>
                      <Text style={styles.operationStatLabel}>Eligible</Text>
                    </View>
                    <View style={styles.operationStat}>
                      <Text style={styles.operationStatValue}>
                        {debrisList.filter(d => d.status === 'Destroying').length}
                      </Text>
                      <Text style={styles.operationStatLabel}>In Progress</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Drone Capture Operation */}
              <View style={styles.operationCard}>
                <LinearGradient
                  colors={['rgba(78, 205, 196, 0.1)', 'rgba(78, 205, 196, 0.05)']}
                  style={styles.operationGradient}
                >
                  <View style={styles.operationHeader}>
                    <Ionicons name="airplane" size={24} color="#4ecdc4" />
                    <Text style={styles.operationTitle}>Drone Capture</Text>
                  </View>
                  
                  <Text style={styles.operationDescription}>
                    Autonomous drone deployment for large debris capture
                  </Text>
                  
                  <View style={styles.operationStats}>
                    <View style={styles.operationStat}>
                      <Text style={styles.operationStatValue}>
                        {debrisList.filter(d => d.size === 'Large' && d.status === 'Active').length}
                      </Text>
                      <Text style={styles.operationStatLabel}>Targets</Text>
                    </View>
                    <View style={styles.operationStat}>
                      <Text style={styles.operationStatValue}>
                        {debrisList.filter(d => d.status === 'Capturing').length}
                      </Text>
                      <Text style={styles.operationStatLabel}>Capturing</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8395a7',
  },
  headerStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerStatsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  headerStatsLabel: {
    fontSize: 10,
    color: '#8395a7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },

  // Overview Cards
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 12,
    color: '#8395a7',
    marginLeft: 6,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: 10,
    color: '#8395a7',
  },

  // Debris Cards
  debrisCard: {
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  debrisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  debrisIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  debrisInfo: {
    marginLeft: 12,
  },
  debrisId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  debrisType: {
    fontSize: 12,
    color: '#8395a7',
    marginTop: 2,
  },
  sizeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sizeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  debrisDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8395a7',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  destroyButton: {
    backgroundColor: '#ff6b6b',
  },
  captureButton: {
    backgroundColor: '#4ecdc4',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Operations Cards
  operationsGrid: {
    gap: 16,
  },
  operationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  operationGradient: {
    padding: 16,
  },
  operationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  operationDescription: {
    fontSize: 12,
    color: '#8395a7',
    marginBottom: 16,
    lineHeight: 16,
  },
  operationStats: {
    flexDirection: 'row',
    gap: 24,
  },
  operationStat: {
    alignItems: 'center',
  },
  operationStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  operationStatLabel: {
    fontSize: 10,
    color: '#8395a7',
    marginTop: 2,
  },
});
