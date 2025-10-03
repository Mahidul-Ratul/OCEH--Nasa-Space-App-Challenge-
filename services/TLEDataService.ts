import * as satellite from 'satellite.js';

// TLE data structure
export interface TLEData {
  name: string;
  line1: string;
  line2: string;
}

export interface DebrisPosition {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  size: 'Small' | 'Large';
  timestamp: Date;
}

export interface OrbitStats {
  totalTracked: number;
  smallDebrisRemoved: number;
  largeDebrisCaptured: number;
  recycledMaterial: number;
  lastUpdate: Date;
}

class TLEDataService {
  private static instance: TLEDataService;
  private debrisPositions: DebrisPosition[] = [];
  private stats: OrbitStats = {
    totalTracked: 0,
    smallDebrisRemoved: 0,
    largeDebrisCaptured: 0,
    recycledMaterial: 0,
    lastUpdate: new Date(),
  };

  public static getInstance(): TLEDataService {
    if (!TLEDataService.instance) {
      TLEDataService.instance = new TLEDataService();
    }
    return TLEDataService.instance;
  }

  // Fetch TLE data from CelesTrak
  async fetchTLEData(): Promise<TLEData[]> {
    console.log('🌐 fetchTLEData: Starting fetch from CelesTrak...');
    try {
      // Try different CelesTrak endpoints for debris vs satellites
      // Option 1: All cataloged objects (includes debris)
      const response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=tle');
      // Option 2: Try supplemental catalog (more debris-like objects)
      // const response = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=supplemental&FORMAT=tle');
      console.log('🌐 fetchTLEData: Response status:', response.status);
      
      const text = await response.text();
      console.log('🌐 fetchTLEData: Response length:', text.length, 'characters');
      console.log('🌐 fetchTLEData: First 200 chars:', text.substring(0, 200));
      
      const parsed = this.parseTLEData(text);
      console.log('🌐 fetchTLEData: Parsed', parsed.length, 'TLE objects');
      
      return parsed;
    } catch (error) {
      console.error('Error fetching TLE data:', error);
      // Return mock data for demo if fetch fails
      return this.getMockTLEData();
    }
  }

  // Parse TLE data from text format
  private parseTLEData(tleText: string): TLEData[] {
    console.log('🛰️ parseTLEData: Parsing TLE text, length:', tleText.length);
    const lines = tleText.trim().split('\n');
    console.log('🛰️ parseTLEData: Split into', lines.length, 'lines');
    const tleData: TLEData[] = [];

    // TLE format: name, line1, line2 (groups of 3)
    for (let i = 0; i < lines.length; i += 3) {
      if (i + 2 < lines.length) {
        tleData.push({
          name: lines[i].trim(),
          line1: lines[i + 1].trim(),
          line2: lines[i + 2].trim(),
        });
      }
    }

    console.log('🛰️ parseTLEData: Parsed', tleData.length, 'TLE objects');
    console.log('🛰️ parseTLEData: Sample:', tleData.slice(0, 2));
    
    return tleData.slice(0, 50); // Limit to 50 objects for performance
  }

  // Calculate current positions from TLE data
  async calculateDebrisPositions(): Promise<DebrisPosition[]> {
    console.log('🛰️ calculateDebrisPositions: Starting...');
    const tleData = await this.fetchTLEData();
    console.log('🛰️ calculateDebrisPositions: Got', tleData.length, 'TLE objects');
    
    const positions: DebrisPosition[] = [];

    // For demo purposes, create positions based on TLE data we have
    tleData.forEach((tle, index) => {
      try {
        // Generate realistic orbital positions
        const angle = (index * 360 / tleData.length) * (Math.PI / 180); // Distribute around Earth
        const altitudeVariation = Math.random() * 1000 + 200; // 200-1200 km altitude
        
        // Calculate position based on orbital mechanics approximation
        const latitude = Math.sin(angle) * 60 + (Math.random() - 0.5) * 40; // -60 to 60 degrees
        const longitude = (angle * 180 / Math.PI) % 360 - 180; // -180 to 180 degrees
        const altitude = altitudeVariation;
        
        // Calculate orbital velocity (approximate)
        const velocity = Math.sqrt(398600 / (6371 + altitude)); // km/s, then convert
        
        // Determine risk level and size
        const riskLevel = this.calculateRiskLevel(altitude, velocity);
        const size = this.determineSizeFromName(tle.name);

        positions.push({
          id: `TLE-${index + 1}`,
          name: tle.name,
          latitude: Math.max(-85, Math.min(85, latitude)), // Clamp to valid range
          longitude: longitude,
          altitude: altitude,
          velocity: velocity * 3.6, // Convert to km/h
          riskLevel,
          size,
          timestamp: new Date(),
        });
        
        if (index < 3) {
          console.log(`🛰️ Created position for ${tle.name}: lat=${latitude.toFixed(2)}, lon=${longitude.toFixed(2)}, alt=${altitude.toFixed(1)}km`);
        }
      } catch (error) {
        console.error(`Error processing TLE for ${tle.name}:`, error);
      }
    });

    console.log('🛰️ calculateDebrisPositions: Finished, got', positions.length, 'positions');
    this.debrisPositions = positions;
    this.updateStats();
    return positions;
  }

  // Calculate risk level based on orbital parameters
  private calculateRiskLevel(altitude: number, velocity: number): 'Low' | 'Medium' | 'High' | 'Critical' {
    // Low Earth Orbit (LEO) debris is most dangerous
    if (altitude < 600) {
      if (velocity > 25) return 'Critical';
      if (velocity > 20) return 'High';
      return 'Medium';
    } else if (altitude < 1200) {
      if (velocity > 20) return 'High';
      if (velocity > 15) return 'Medium';
      return 'Low';
    } else {
      return 'Low';
    }
  }

  // Determine debris size from name patterns
  private determineSizeFromName(name: string): 'Small' | 'Large' {
    const largePatterms = ['ROCKET', 'R/B', 'SATELLITE', 'COSMOS', 'DEBRIS', 'FRAGMENT'];
    const nameUpper = name.toUpperCase();
    
    return largePatterms.some(pattern => nameUpper.includes(pattern)) ? 'Large' : 'Small';
  }

  // Generate simulated small debris (not tracked by CelesTrak)
  generateSimulatedSmallDebris(count: number = 20): DebrisPosition[] {
    const simulatedDebris: DebrisPosition[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      simulatedDebris.push({
        id: `SIM-${i + 1}`,
        name: `Small Debris ${i + 1}`,
        latitude: (Math.random() - 0.5) * 180, // -90 to 90
        longitude: (Math.random() - 0.5) * 360, // -180 to 180
        altitude: 200 + Math.random() * 800, // 200-1000 km
        velocity: 15 + Math.random() * 15, // 15-30 km/h
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as any,
        size: 'Small',
        timestamp: now,
      });
    }

    return simulatedDebris;
  }

  // Update orbital statistics
  private updateStats(): void {
    const realDebris = this.debrisPositions.length;
    const simulatedSmall = 20; // Our simulated count
    
    // Simulate daily operations
    const baseDate = new Date();
    const daysSinceStart = Math.floor((baseDate.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
    
    this.stats = {
      totalTracked: realDebris + simulatedSmall,
      smallDebrisRemoved: Math.floor(daysSinceStart * 0.3) + Math.floor(Math.random() * 5), // Simulate daily removals
      largeDebrisCaptured: Math.floor(daysSinceStart * 0.1) + Math.floor(Math.random() * 3), // Simulate captures
      recycledMaterial: Math.floor(daysSinceStart * 2.5) + Math.random() * 50, // Simulate material accumulation
      lastUpdate: new Date(),
    };
  }

  // Get current orbital statistics
  getOrbitStats(): OrbitStats {
    return { ...this.stats };
  }

  // Get all debris positions (real + simulated)
  getAllDebrisPositions(): DebrisPosition[] {
    const simulated = this.generateSimulatedSmallDebris();
    return [...this.debrisPositions, ...simulated];
  }

  // Mock TLE data for fallback
  private getMockTLEData(): TLEData[] {
    return [
      {
        name: 'COSMOS 2251 DEB',
        line1: '1 34454U 93036SX  24275.25000000  .00000000  00000-0  00000-0 0  9990',
        line2: '2 34454  74.0000 180.0000 0001000  90.0000 270.0000 14.12345678 12345'
      },
      {
        name: 'IRIDIUM 33 DEB',
        line1: '1 36395U 93036SY  24275.25000000  .00000000  00000-0  00000-0 0  9991',
        line2: '2 36395  86.4000 320.0000 0002000 120.0000 240.0000 14.34567890 12346'
      },
      {
        name: 'FENGYUN 1C DEB',
        line1: '1 37794U 93036SZ  24275.25000000  .00000000  00000-0  00000-0 0  9992',
        line2: '2 37794  98.8000  45.0000 0003000 150.0000 210.0000 14.56789012 12347'
      }
    ];
  }
}

export default TLEDataService;