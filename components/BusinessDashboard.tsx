import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface BusinessDashboardProps {
  onNavigateBack?: () => void;
}

interface ContractData {
  id: string;
  service: string;
  satelliteId: string;
  client: string;
  value: number;
  status: 'active' | 'completed' | 'pending';
  date: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface MaterialSales {
  material: string;
  percentage: number;
  color: string;
}

export default function BusinessDashboard({ onNavigateBack }: BusinessDashboardProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const chartAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Form state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    satelliteId: '',
    clientName: '',
    estimatedCost: 0,
  });

  // Business data
  const [contracts] = useState<ContractData[]>([
    {
      id: 'CNT-001',
      service: 'Debris Removal',
      satelliteId: 'SAT-4521',
      client: 'NASA',
      value: 2500000,
      status: 'active',
      date: '2024-10-01'
    },
    {
      id: 'CNT-002',
      service: 'Satellite Repair',
      satelliteId: 'SAT-7893',
      client: 'ESA',
      value: 4200000,
      status: 'active',
      date: '2024-09-28'
    },
    {
      id: 'CNT-003',
      service: 'Material Recycling',
      satelliteId: 'SAT-1247',
      client: 'SpaceX',
      value: 1800000,
      status: 'completed',
      date: '2024-09-15'
    },
  ]);

  const [revenueData] = useState<RevenueData[]>([
    { month: 'Jun', revenue: 3200000 },
    { month: 'Jul', revenue: 4100000 },
    { month: 'Aug', revenue: 3800000 },
    { month: 'Sep', revenue: 5200000 },
    { month: 'Oct', revenue: 6800000 },
  ]);

  const [materialSales] = useState<MaterialSales[]>([
    { material: 'Aluminum', percentage: 35, color: '#4ecdc4' },
    { material: 'Titanium', percentage: 28, color: '#45b7d1' },
    { material: 'Carbon Fiber', percentage: 20, color: '#96ceb4' },
    { material: 'Rare Metals', percentage: 12, color: '#feca57' },
    { material: 'Other', percentage: 5, color: '#ff6b6b' },
  ]);

  const [businessStats, setBusinessStats] = useState({
    activeContracts: 0,
    totalRevenue: 0,
    monthlySavings: 0,
  });

  const [displayStats, setDisplayStats] = useState({
    activeContracts: 0,
    totalRevenue: 0,
    monthlySavings: 0,
  });

  // Services and satellites data
  const services = [
    { label: 'Debris Removal', value: 'debris_removal', cost: 2500000 },
    { label: 'Satellite Repair', value: 'satellite_repair', cost: 4200000 },
    { label: 'Material Recycling', value: 'material_recycling', cost: 1800000 },
  ];

  const satellites = [
    'SAT-1001', 'SAT-1002', 'SAT-1003', 'SAT-1004', 'SAT-1005',
    'SAT-2001', 'SAT-2002', 'SAT-2003', 'SAT-2004', 'SAT-2005',
    'SAT-3001', 'SAT-3002', 'SAT-3003', 'SAT-3004', 'SAT-3005',
  ];

  // Calculate business statistics
  useEffect(() => {
    const activeCount = contracts.filter(c => c.status === 'active').length;
    const totalRev = contracts.reduce((sum, c) => sum + c.value, 0);
    const savings = 15000000; // Estimated monthly savings from repairs vs new launches

    setBusinessStats({
      activeContracts: activeCount,
      totalRevenue: totalRev,
      monthlySavings: savings,
    });
  }, [contracts]);

  // Start animations
  useEffect(() => {
    console.log('💼 BusinessDashboard: Starting animations');
    
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      ...chartAnimations.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ),
    ]).start();

    // Animate counters
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setDisplayStats({
          activeContracts: Math.floor(businessStats.activeContracts * progress),
          totalRevenue: Math.floor(businessStats.totalRevenue * progress),
          monthlySavings: Math.floor(businessStats.monthlySavings * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
          setDisplayStats(businessStats);
        }
      }, interval);
    };

    setTimeout(animateCounters, 1000);
  }, [businessStats]);

  const handleSubmitRequest = () => {
    if (!formData.service || !formData.satelliteId || !formData.clientName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const selectedService = services.find(s => s.value === formData.service);
    const estimatedCost = selectedService?.cost || 0;

    Alert.alert(
      'Contract Request Submitted',
      `Service: ${selectedService?.label}\nSatellite: ${formData.satelliteId}\nClient: ${formData.clientName}\nEstimated Cost: $${estimatedCost.toLocaleString()}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowRequestModal(false);
            setFormData({ service: '', satelliteId: '', clientName: '', estimatedCost: 0 });
          }
        }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />
      
      <LinearGradient
        colors={['#0f1419', '#1a2332', '#0f1419']}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onNavigateBack}
            >
              <Ionicons name="arrow-back" size={24} color="#4ecdc4" />
            </TouchableOpacity>
            
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Business Dashboard</Text>
              <Text style={styles.headerSubtitle}>Revenue & Contract Management</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowRequestModal(true)}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Client Request Portal */}
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Client Request Portal</Text>
            <TouchableOpacity 
              style={styles.requestCard}
              onPress={() => setShowRequestModal(true)}
            >
              <View style={styles.requestHeader}>
                <Ionicons name="document-text" size={24} color="#4ecdc4" />
                <Text style={styles.requestTitle}>New Contract Request</Text>
              </View>
              <Text style={styles.requestSubtitle}>
                Submit requests for debris removal, satellite repair, or material recycling
              </Text>
              <View style={styles.requestButton}>
                <Text style={styles.requestButtonText}>Create Request</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Charts Section */}
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Financial Analytics</Text>
            
            {/* Savings Bar Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Ionicons name="bar-chart" size={20} color="#feca57" />
                <Text style={styles.chartTitle}>Repair vs New Launch Savings</Text>
              </View>
              <View style={styles.barChart}>
                <View style={styles.barContainer}>
                  <Text style={styles.barLabel}>Repair Cost</Text>
                  <Animated.View 
                    style={[
                      styles.bar,
                      styles.repairBar,
                      {
                        width: chartAnimations[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '30%'],
                        }),
                      }
                    ]}
                  />
                  <Text style={styles.barValue}>$4.2M</Text>
                </View>
                <View style={styles.barContainer}>
                  <Text style={styles.barLabel}>New Launch</Text>
                  <Animated.View 
                    style={[
                      styles.bar,
                      styles.launchBar,
                      {
                        width: chartAnimations[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      }
                    ]}
                  />
                  <Text style={styles.barValue}>$14M</Text>
                </View>
              </View>
              <Text style={styles.savingsText}>💰 Monthly Savings: {formatCurrency(displayStats.monthlySavings)}</Text>
            </View>

            {/* Revenue Line Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Ionicons name="trending-up" size={20} color="#4ecdc4" />
                <Text style={styles.chartTitle}>Monthly Revenue Trend</Text>
              </View>
              <View style={styles.lineChart}>
                {revenueData.map((data, index) => (
                  <View key={data.month} style={styles.linePoint}>
                    <Animated.View 
                      style={[
                        styles.lineBar,
                        {
                          height: chartAnimations[1].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (data.revenue / maxRevenue) * 80],
                          }),
                        }
                      ]}
                    />
                    <Text style={styles.lineLabel}>{data.month}</Text>
                    <Text style={styles.lineValue}>{formatCurrency(data.revenue)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Material Sales Pie Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Ionicons name="pie-chart" size={20} color="#96ceb4" />
                <Text style={styles.chartTitle}>Material Sales Breakdown</Text>
              </View>
              <View style={styles.pieChart}>
                <View style={styles.pieContainer}>
                  {materialSales.map((material, index) => (
                    <Animated.View 
                      key={material.material}
                      style={[
                        styles.pieSegment,
                        {
                          backgroundColor: material.color,
                          width: chartAnimations[2].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, material.percentage * 2],
                          }),
                        }
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.pieLegend}>
                  {materialSales.map((material) => (
                    <View key={material.material} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: material.color }]} />
                      <Text style={styles.legendText}>
                        {material.material} ({material.percentage}%)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Stats & Partnerships */}
          <Animated.View 
            style={[
              styles.section,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Business Overview</Text>
            
            {/* Key Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Ionicons name="briefcase" size={24} color="#4ecdc4" />
                <Text style={styles.metricNumber}>{displayStats.activeContracts}</Text>
                <Text style={styles.metricLabel}>Active Contracts</Text>
              </View>
              <View style={styles.metricCard}>
                <Ionicons name="cash" size={24} color="#feca57" />
                <Text style={styles.metricNumber}>{formatCurrency(displayStats.totalRevenue)}</Text>
                <Text style={styles.metricLabel}>Total Revenue</Text>
              </View>
            </View>

            {/* Partnerships */}
            <View style={styles.partnershipsCard}>
              <Text style={styles.partnershipsTitle}>Strategic Partnerships</Text>
              <View style={styles.partnersRow}>
                <View style={styles.partnerCard}>
                  <View style={styles.partnerLogo}>
                    <Text style={styles.partnerText}>NASA</Text>
                  </View>
                  <Text style={styles.partnerName}>NASA</Text>
                </View>
                <View style={styles.partnerCard}>
                  <View style={[styles.partnerLogo, { backgroundColor: '#45b7d1' }]}>
                    <Text style={styles.partnerText}>ESA</Text>
                  </View>
                  <Text style={styles.partnerName}>ESA</Text>
                </View>
                <View style={styles.partnerCard}>
                  <View style={[styles.partnerLogo, { backgroundColor: '#96ceb4' }]}>
                    <Text style={styles.partnerText}>SpX</Text>
                  </View>
                  <Text style={styles.partnerName}>SpaceX</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Request Modal */}
        <Modal
          visible={showRequestModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRequestModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Contract Request</Text>
                <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Service Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Service Type *</Text>
                  <View style={styles.serviceGrid}>
                    {services.map((service) => (
                      <TouchableOpacity
                        key={service.value}
                        style={[
                          styles.serviceOption,
                          formData.service === service.value && styles.serviceOptionSelected
                        ]}
                        onPress={() => setFormData({ ...formData, service: service.value })}
                      >
                        <Text style={[
                          styles.serviceOptionText,
                          formData.service === service.value && styles.serviceOptionTextSelected
                        ]}>
                          {service.label}
                        </Text>
                        <Text style={styles.serviceOptionCost}>
                          {formatCurrency(service.cost)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Satellite ID */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Target Satellite ID *</Text>
                  <View style={styles.satelliteGrid}>
                    {satellites.slice(0, 6).map((satellite) => (
                      <TouchableOpacity
                        key={satellite}
                        style={[
                          styles.satelliteOption,
                          formData.satelliteId === satellite && styles.satelliteOptionSelected
                        ]}
                        onPress={() => setFormData({ ...formData, satelliteId: satellite })}
                      >
                        <Text style={[
                          styles.satelliteOptionText,
                          formData.satelliteId === satellite && styles.satelliteOptionTextSelected
                        ]}>
                          {satellite}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Client Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Client Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.clientName}
                    onChangeText={(text) => setFormData({ ...formData, clientName: text })}
                    placeholder="Enter client organization name"
                    placeholderTextColor="#708090"
                  />
                </View>

                {/* Contract Summary */}
                {formData.service && formData.satelliteId && (
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Contract Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Service:</Text>
                      <Text style={styles.summaryValue}>
                        {services.find(s => s.value === formData.service)?.label}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Satellite:</Text>
                      <Text style={styles.summaryValue}>{formData.satelliteId}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Estimated Cost:</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(services.find(s => s.value === formData.service)?.cost || 0)}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowRequestModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmitRequest}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#151f2e',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#b0c4de',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  // Client Request Portal
  requestCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecdc4',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  requestSubtitle: {
    fontSize: 14,
    color: '#b0c4de',
    lineHeight: 20,
    marginBottom: 15,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    paddingVertical: 12,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Charts
  chartCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  // Bar Chart
  barChart: {
    marginBottom: 15,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    fontSize: 14,
    color: '#b0c4de',
    width: 80,
  },
  bar: {
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    flex: 1,
  },
  repairBar: {
    backgroundColor: '#4ecdc4',
  },
  launchBar: {
    backgroundColor: '#ff6b6b',
  },
  barValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    width: 60,
    textAlign: 'right',
  },
  savingsText: {
    fontSize: 16,
    color: '#feca57',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Line Chart
  lineChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 10,
  },
  linePoint: {
    alignItems: 'center',
    flex: 1,
  },
  lineBar: {
    backgroundColor: '#4ecdc4',
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  lineLabel: {
    fontSize: 12,
    color: '#b0c4de',
    marginBottom: 4,
  },
  lineValue: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Pie Chart
  pieChart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 20,
  },
  pieSegment: {
    height: '100%',
  },
  pieLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#b0c4de',
  },
  // Metrics
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 0.48,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#b0c4de',
    textAlign: 'center',
  },
  // Partnerships
  partnershipsCard: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  partnershipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  partnersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  partnerCard: {
    alignItems: 'center',
  },
  partnerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  partnerName: {
    fontSize: 12,
    color: '#b0c4de',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d4a5c',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalBody: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#b0c4de',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceOption: {
    backgroundColor: '#2d4a5c',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceOptionSelected: {
    borderColor: '#4ecdc4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  serviceOptionText: {
    color: '#b0c4de',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceOptionTextSelected: {
    color: '#4ecdc4',
  },
  serviceOptionCost: {
    color: '#feca57',
    fontSize: 12,
    fontWeight: 'bold',
  },
  satelliteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  satelliteOption: {
    backgroundColor: '#2d4a5c',
    borderRadius: 8,
    padding: 12,
    width: '30%',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  satelliteOptionSelected: {
    borderColor: '#4ecdc4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  satelliteOptionText: {
    color: '#b0c4de',
    fontSize: 12,
    fontWeight: 'bold',
  },
  satelliteOptionTextSelected: {
    color: '#4ecdc4',
  },
  textInput: {
    backgroundColor: '#2d4a5c',
    borderRadius: 8,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#2d4a5c',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#b0c4de',
    fontSize: 14,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2d4a5c',
  },
  cancelButton: {
    backgroundColor: '#708090',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 0.4,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 0.55,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});