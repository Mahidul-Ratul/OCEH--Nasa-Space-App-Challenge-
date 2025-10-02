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

interface InventoryData {
  aluminum: number;
  titanium: number;
  carbonComposites: number;
}

interface RecyclingHubProps {
  onNavigateBack?: () => void;
}

export default function RecyclingHub({ onNavigateBack }: RecyclingHubProps) {
  const [inventory, setInventory] = useState<InventoryData>({
    aluminum: 45.2,
    titanium: 23.8,
    carbonComposites: 12.5,
  });

  const handleSendToRepair = () => {
    Alert.alert(
      'Send to Drone for Repair',
      'Deploy materials to repair drone for orbital maintenance?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deploy',
          onPress: () => {
            Alert.alert('Success', 'Materials dispatched to repair drone successfully.');
          },
        },
      ]
    );
  };

  const handleStoreForConstruction = () => {
    Alert.alert(
      'Store for Future Construction',
      'Archive materials in orbital storage for future construction projects?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Store',
          onPress: () => {
            Alert.alert('Success', 'Materials stored in orbital warehouse successfully.');
          },
        },
      ]
    );
  };

  const ProcessStep = ({ 
    step, 
    title, 
    icon, 
    color, 
    isLast = false 
  }: { 
    step: number; 
    title: string; 
    icon: string; 
    color: string; 
    isLast?: boolean;
  }) => (
    <View style={styles.processStep}>
      <View style={[styles.stepCircle, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
      <Text style={styles.stepNumber}>{step}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      {!isLast && <View style={styles.stepArrow} />}
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
              <Text style={styles.headerTitle}>Recycling & Manufacturing Hub</Text>
              <Text style={styles.headerSubtitle}>Space Materials Processing Center</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Process Flow Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manufacturing Process Flow</Text>
            
            <View style={styles.processFlow}>
              <ProcessStep
                step={1}
                title="Capture"
                icon="magnet"
                color="#4ecdc4"
              />
              <ProcessStep
                step={2}
                title="Recycling"
                icon="refresh"
                color="#feca57"
              />
              <ProcessStep
                step={3}
                title="3D Printing"
                icon="layers"
                color="#ff6b6b"
              />
              <ProcessStep
                step={4}
                title="Parts Inventory"
                icon="cube"
                color="#a55eea"
                isLast={true}
              />
            </View>
          </View>

          {/* Inventory Panel Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Material Inventory</Text>
            
            <View style={styles.inventoryGrid}>
              {/* Aluminum */}
              <View style={styles.inventoryCard}>
                <View style={styles.inventoryHeader}>
                  <Ionicons name="shield" size={20} color="#c0c0c0" />
                  <Text style={styles.materialName}>Aluminum</Text>
                </View>
                <Text style={styles.materialAmount}>{inventory.aluminum} kg</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min((inventory.aluminum / 50) * 100, 100)}%`,
                        backgroundColor: '#c0c0c0'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.capacityText}>Max: 50 kg</Text>
              </View>

              {/* Titanium */}
              <View style={styles.inventoryCard}>
                <View style={styles.inventoryHeader}>
                  <Ionicons name="diamond" size={20} color="#b8860b" />
                  <Text style={styles.materialName}>Titanium</Text>
                </View>
                <Text style={styles.materialAmount}>{inventory.titanium} kg</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min((inventory.titanium / 30) * 100, 100)}%`,
                        backgroundColor: '#b8860b'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.capacityText}>Max: 30 kg</Text>
              </View>

              {/* Carbon Composites */}
              <View style={styles.inventoryCard}>
                <View style={styles.inventoryHeader}>
                  <Ionicons name="grid" size={20} color="#2c2c54" />
                  <Text style={styles.materialName}>Carbon Composites</Text>
                </View>
                <Text style={styles.materialAmount}>{inventory.carbonComposites} kg</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min((inventory.carbonComposites / 20) * 100, 100)}%`,
                        backgroundColor: '#2c2c54'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.capacityText}>Max: 20 kg</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manufacturing Actions</Text>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.repairButton]} 
                onPress={handleSendToRepair}
              >
                <Ionicons name="build" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Send to Drone for Repair</Text>
                <Text style={styles.actionButtonSubtext}>Deploy materials for maintenance</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.storeButton]} 
                onPress={handleStoreForConstruction}
              >
                <Ionicons name="archive" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Store for Future Construction</Text>
                <Text style={styles.actionButtonSubtext}>Archive in orbital warehouse</Text>
              </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },

  // Process Flow Styles
  processFlow: {
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepArrow: {
    position: 'absolute',
    right: -15,
    top: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: '#4ecdc4',
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },

  // Inventory Styles
  inventoryGrid: {
    gap: 16,
  },
  inventoryCard: {
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  materialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  materialAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  capacityText: {
    fontSize: 12,
    color: '#8395a7',
  },

  // Action Buttons Styles
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  repairButton: {
    backgroundColor: '#ff6b6b',
  },
  storeButton: {
    backgroundColor: '#4ecdc4',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    flex: 1,
  },
});