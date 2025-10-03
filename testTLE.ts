// Test script to debug TLE data service
import TLEDataService from './services/TLEDataService';

const testTLEService = async () => {
  console.log('🧪 Testing TLE Data Service...');
  
  try {
    const tleService = TLEDataService.getInstance();
    
    // Test fetching TLE data
    console.log('1. Fetching TLE data...');
    const tleData = await tleService.fetchTLEData();
    console.log(`   Fetched ${tleData.length} TLE entries`);
    
    // Test calculating positions
    console.log('2. Calculating debris positions...');
    const positions = await tleService.calculateDebrisPositions();
    console.log(`   Calculated ${positions.length} debris positions`);
    
    // Test getting stats
    console.log('3. Getting orbital stats...');
    const stats = tleService.getOrbitStats();
    console.log('   Stats:', stats);
    
    // Test getting all positions (real + simulated)
    console.log('4. Getting all debris positions...');
    const allPositions = tleService.getAllDebrisPositions();
    console.log(`   Total positions: ${allPositions.length}`);
    
    return {
      tleCount: tleData.length,
      realDebris: positions.length,
      totalDebris: allPositions.length,
      stats
    };
    
  } catch (error) {
    console.error('❌ TLE Service Test Failed:', error);
    return null;
  }
};

export default testTLEService;