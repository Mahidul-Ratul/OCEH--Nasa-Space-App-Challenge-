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

interface DroneData {
  id: string;
  name: string;
  solarPowerLevel: number;
  currentTask: 'Repair' | 'Delivery' | 'Refueling' | 'Returning' | 'Idle';
  missionProgress: number;
  missionDescription: string;
  status: 'Active' | 'Maintenance' | 'Offline';
}

interface ServiceDronesProps {
  onNavigateBack?: () => void;
}

export default function ServiceDrones({ onNavigateBack }: ServiceDronesProps) {
  const [droneFleet, setDroneFleet] = useState<DroneData[]>([
    {
      id: 'DR-001',
      name: 'Drone-1',
      solarPowerLevel: 87,
      currentTask: 'Delivery',
      missionProgress: 65,
      missionDescription: 'Delivering panel → Satellite X',
      status: 'Active',
    },
    {
      id: 'DR-002',
      name: 'Drone-2',
      solarPowerLevel: 92,
      currentTask: 'Refueling',
      missionProgress: 80,
      missionDescription: 'Refueling Satellite Y',
      status: 'Active',
    },
    {
      id: 'DR-003',
      name: 'Drone-3',
      solarPowerLevel: 45,
      currentTask: 'Returning',
      missionProgress: 30,
      missionDescription: 'Returning to OCEH Hub',
      status: 'Active',
    },
    {
      id: 'DR-004',
      name: 'Drone-4',
      solarPowerLevel: 98,
      currentTask: 'Idle',
      missionProgress: 0,
      missionDescription: 'Standby at Hub',
      status: 'Active',
    },
    {
      id: 'DR-005',
      name: 'Drone-5',
      solarPowerLevel: 23,
      currentTask: 'Idle',
      missionProgress: 0,
      missionDescription: 'Low power - Charging',
      status: 'Maintenance',
    },
  ]);

  const handleAssignMission = (drone: DroneData) => {
    if (drone.currentTask !== 'Idle') {
      Alert.alert('Mission Assignment Failed', `${drone.name} is currently busy with: ${drone.missionDescription}`);
      return;
    }

    if (drone.solarPowerLevel < 50) {
      Alert.alert('Low Power Warning', `${drone.name} has insufficient power (${drone.solarPowerLevel}%). Please charge before mission assignment.`);
      return;
    }

    Alert.alert(
      'Assign Mission',
      `Select mission type for ${drone.name}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Repair Mission',
          onPress: () => {
            setDroneFleet(prev =>
              prev.map(item =>
                item.id === drone.id
                  ? {
                      ...item,
                      currentTask: 'Repair',
                      missionProgress: 0,
                      missionDescription: 'Repairing Satellite Communications Array',
                    }
                  : item
              )
            );
            Alert.alert('Mission Assigned', `${drone.name} deployed for repair mission.`);
          },
        },
        {
          text: 'Delivery Mission',
          onPress: () => {
            setDroneFleet(prev =>
              prev.map(item =>
                item.id === drone.id
                  ? {
                      ...item,
                      currentTask: 'Delivery',
                      missionProgress: 0,
                      missionDescription: 'Delivering supplies → ISS Module',
                    }
                  : item
              )
            );
            Alert.alert('Mission Assigned', `${drone.name} deployed for delivery mission.`);
          },
        },
      ]
    );
  };

  const handleRecallDrone = (drone: DroneData) => {
    if (drone.currentTask === 'Idle' || drone.currentTask === 'Returning') {
      Alert.alert('Recall Not Needed', `${drone.name} is already ${drone.currentTask.toLowerCase()}.`);
      return;
    }

    Alert.alert(
      'Recall Drone',
      `Abort current mission and recall ${drone.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recall',
          style: 'destructive',
          onPress: () => {
            setDroneFleet(prev =>
              prev.map(item =>
                item.id === drone.id
                  ? {
                      ...item,
                      currentTask: 'Returning',
                      missionProgress: 0,
                      missionDescription: 'Emergency recall → Returning to OCEH Hub',
                    }
                  : item
              )
            );
            Alert.alert('Drone Recalled', `${drone.name} is returning to hub.`);
          },
        },
      ]
    );
  };

  const getTaskColor = (task: string) => {
    switch (task) {
      case 'Repair': return '#ff6b6b';
      case 'Delivery': return '#4ecdc4';
      case 'Refueling': return '#feca57';
      case 'Returning': return '#a55eea';
      case 'Idle': return '#8395a7';
      default: return '#4ecdc4';
    }
  };

  const getTaskIcon = (task: string) => {
    switch (task) {
      case 'Repair': return 'build';
      case 'Delivery': return 'cube';
      case 'Refueling': return 'battery-charging';
      case 'Returning': return 'return-up-back';
      case 'Idle': return 'pause-circle';
      default: return 'ellipse';
    }
  };

  const getPowerColor = (level: number) => {
    if (level >= 70) return '#2ed573';
    if (level >= 40) return '#ffa502';
    return '#ff3838';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#2ed573';
      case 'Maintenance': return '#ffa502';
      case 'Offline': return '#ff3838';
      default: return '#8395a7';
    }
  };

  const DroneCard = ({ drone }: { drone: DroneData }) => (
    <View style={styles.droneCard}>
      {/* Drone Header */}
      <View style={styles.droneHeader}>
        <View style={styles.droneNameSection}>
          <Ionicons name="airplane" size={20} color="#4ecdc4" />
          <Text style={styles.droneName}>{drone.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(drone.status) }]}>
            <Text style={styles.statusText}>{drone.status}</Text>
          </View>
        </View>
        <Text style={styles.droneId}>{drone.id}</Text>
      </View>

      {/* Solar Panel Status */}
      <View style={styles.powerSection}>
        <View style={styles.powerHeader}>
          <Ionicons name="sunny" size={16} color="#feca57" />
          <Text style={styles.powerLabel}>Solar Panel Status</Text>
        </View>
        <View style={styles.powerDisplay}>
          <Text style={[styles.powerLevel, { color: getPowerColor(drone.solarPowerLevel) }]}>
            {drone.solarPowerLevel}%
          </Text>
          <View style={styles.powerBar}>
            <View 
              style={[
                styles.powerFill, 
                { 
                  width: `${drone.solarPowerLevel}%`,
                  backgroundColor: getPowerColor(drone.solarPowerLevel)
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Current Task */}
      <View style={styles.taskSection}>
        <View style={styles.taskHeader}>
          <Ionicons name={getTaskIcon(drone.currentTask) as any} size={16} color={getTaskColor(drone.currentTask)} />
          <Text style={styles.taskLabel}>Current Task</Text>
          <View style={[styles.taskBadge, { backgroundColor: getTaskColor(drone.currentTask) }]}>
            <Text style={styles.taskText}>{drone.currentTask}</Text>
          </View>
        </View>
        <Text style={styles.missionDescription}>{drone.missionDescription}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Mission Progress</Text>
          <Text style={styles.progressPercent}>{drone.missionProgress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${drone.missionProgress}%`,
                backgroundColor: getTaskColor(drone.currentTask)
              }
            ]} 
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.assignButton]} 
          onPress={() => handleAssignMission(drone)}
        >
          <Ionicons name="send" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Assign Mission</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.recallButton]} 
          onPress={() => handleRecallDrone(drone)}
        >
          <Ionicons name="return-up-back" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Recall Drone</Text>
        </TouchableOpacity>
      </View>
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
              <Text style={styles.headerTitle}>Service Drones</Text>
              <Text style={styles.headerSubtitle}>Orbital Fleet Management</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Fleet Overview Panel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drone Fleet Panel</Text>
            
            <View style={styles.fleetOverview}>
              {droneFleet.map((drone, index) => (
                <View key={drone.id} style={styles.fleetItem}>
                  <View style={styles.fleetDroneInfo}>
                    <Text style={styles.fleetDroneName}>{drone.name}:</Text>
                    <Text style={styles.fleetMissionText}>{drone.missionDescription}</Text>
                  </View>
                  <View style={[styles.fleetStatusDot, { backgroundColor: getTaskColor(drone.currentTask) }]} />
                </View>
              ))}
            </View>
          </View>

          {/* Drone Cards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Drone Fleet Details</Text>
            
            {droneFleet.map((drone) => (
              <DroneCard key={drone.id} drone={drone} />
            ))}
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

  // Fleet Overview Styles
  fleetOverview: {
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
  },
  fleetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  fleetDroneInfo: {
    flex: 1,
  },
  fleetDroneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  fleetMissionText: {
    fontSize: 12,
    color: '#8395a7',
    marginTop: 2,
  },
  fleetStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Drone Card Styles
  droneCard: {
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
  },
  droneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  droneNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  droneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    marginRight: 8,
  },
  droneId: {
    fontSize: 12,
    color: '#8395a7',
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

  // Power Section Styles
  powerSection: {
    marginBottom: 16,
  },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  powerLabel: {
    fontSize: 14,
    color: '#8395a7',
    marginLeft: 6,
  },
  powerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 40,
  },
  powerBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  powerFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Task Section Styles
  taskSection: {
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskLabel: {
    fontSize: 14,
    color: '#8395a7',
    marginLeft: 6,
    marginRight: 8,
  },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  missionDescription: {
    fontSize: 12,
    color: '#fff',
    fontStyle: 'italic',
  },

  // Progress Section Styles
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#8395a7',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  assignButton: {
    backgroundColor: '#4ecdc4',
  },
  recallButton: {
    backgroundColor: '#ff6b6b',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
  },
});