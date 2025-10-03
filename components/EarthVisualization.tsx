import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { DebrisPosition } from '../services/TLEDataService';

interface EarthVisualizationProps {
  debrisPositions: DebrisPosition[];
  height?: number;
}

export default function EarthVisualization({ debrisPositions, height = 300 }: EarthVisualizationProps) {
  console.log('🌍 EarthVisualization: Received', debrisPositions.length, 'debris positions');
  
  // If no data, show a simple fallback
  if (debrisPositions.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.fallback}>
          <Text style={styles.fallbackTitle}>🌍 Loading Orbital Data...</Text>
          <Text style={styles.fallbackText}>Fetching debris positions from CelesTrak</Text>
        </View>
      </View>
    );
  }

  // Generate simple 2D map visualization
  const generateMapHTML = () => {
    const debrisData = JSON.stringify(debrisPositions.slice(0, 30).map(debris => ({
      id: debris.id,
      name: debris.name,
      lat: debris.latitude,
      lon: debris.longitude,
      alt: debris.altitude,
      size: debris.size,
      riskLevel: debris.riskLevel,
    })));

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            margin: 0; 
            padding: 15px; 
            background: linear-gradient(135deg, #0c1c2c 0%, #1a2332 100%); 
            font-family: Arial, sans-serif;
            color: white;
            height: 100vh;
        }
        .map-container {
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, #1e3a5f 0%, #0f1419 100%);
            border-radius: 10px;
            padding: 15px;
            box-sizing: border-box;
        }
        .title {
            text-align: center;
            font-size: 14px;
            margin-bottom: 10px;
            color: #64c8ff;
            font-weight: bold;
        }
        .world-map {
            position: relative;
            width: 100%;
            height: 150px;
            background: linear-gradient(to bottom, #001122 0%, #002244 50%, #001122 100%);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #2d4a5c;
            margin-bottom: 10px;
        }
        .debris-point {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        .risk-low { background: #2ecc71; box-shadow: 0 0 6px #2ecc71; }
        .risk-medium { background: #f39c12; box-shadow: 0 0 6px #f39c12; }
        .risk-high { background: #e74c3c; box-shadow: 0 0 6px #e74c3c; }
        .risk-critical { background: #ff0040; box-shadow: 0 0 8px #ff0040; }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.3); }
        }
        
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
        }
        .stat {
            background: rgba(255,255,255,0.1);
            padding: 6px;
            border-radius: 6px;
            text-align: center;
            font-size: 10px;
        }
        .stat-number {
            font-size: 14px;
            font-weight: bold;
            color: #64c8ff;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>
    <div class="map-container">
        <div class="title">🛰️ Live Orbital Debris Tracking</div>
        <div class="world-map" id="debris-layer">
        </div>
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${debrisPositions.length}</div>
                <div>Total Objects</div>
            </div>
            <div class="stat">
                <div class="stat-number">${debrisPositions.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').length}</div>
                <div>High Risk</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Math.round(debrisPositions.reduce((sum, d) => sum + d.altitude, 0) / debrisPositions.length)}</div>
                <div>Avg Alt (km)</div>
            </div>
        </div>
    </div>

    <script>
        const debrisData = ${debrisData};
        const debrisLayer = document.getElementById('debris-layer');
        
        function plotDebris() {
            debrisData.forEach((debris, index) => {
                const point = document.createElement('div');
                point.className = 'debris-point risk-' + debris.riskLevel.toLowerCase();
                
                // Convert lat/lon to map coordinates
                const x = ((debris.lon + 180) / 360) * 100;
                const y = ((90 - debris.lat) / 180) * 100;
                
                point.style.position = 'absolute';
                point.style.left = Math.max(0, Math.min(95, x)) + '%';
                point.style.top = Math.max(0, Math.min(95, y)) + '%';
                point.title = debris.name + ' - Alt: ' + Math.round(debris.alt) + 'km';
                
                debrisLayer.appendChild(point);
            });
        }
        
        setTimeout(plotDebris, 500);
        console.log('Loaded', debrisData.length, 'debris objects');
    </script>
</body>
</html>
    `;
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html: generateMapHTML() }}
        style={styles.webview}
        javaScriptEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0c1c2c',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0c1c2c',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a2332',
    borderRadius: 12,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64c8ff',
    marginBottom: 10,
  },
  fallbackText: {
    fontSize: 14,
    color: '#8395a7',
    textAlign: 'center',
  },
});