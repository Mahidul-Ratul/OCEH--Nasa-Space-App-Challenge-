# OCEH - Orbital Cleanup & Environmental Hub

A React Native mobile application built with Expo for tracking space debris and managing orbital cleanup operations.

## Features

### 🚀 Splash Screen
- Animated OCEH logo with space-themed design
- Loading indicators and smooth transitions
- Dark theme optimized for space operations

### 🌍 Home Dashboard
- **3D Earth Visualization**: Interactive globe showing debris tracking
- **Real-time Statistics**: 
  - Total debris tracked
  - Daily cleanup progress
  - Recycled material inventory
- **Debris Markers**:
  - Red dots: Small debris (<10 cm)
  - Green dots: Large debris (>10 cm)
- **Quick Actions**: Navigate to tracking, recycling, and business modules
- **Activity Feed**: Recent cleanup operations and updates

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oceh-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running with Expo Go

1. **Install Expo Go** on your mobile device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Connect your device**:
   - **Android**: Scan the QR code with the Expo Go app
   - **iOS**: Scan the QR code with your camera app, then open in Expo Go
   - **Alternative**: Use the tunnel connection for network issues

4. **Development Tips**:
   - Shake your device to open the developer menu
   - Enable live reload for instant updates
   - Use the console in your terminal for debugging

## Project Structure

```
OCEH/
├── components/
│   ├── SplashScreen.tsx    # Animated splash screen
│   └── HomePage.tsx        # Main dashboard
├── utils/
│   └── navigation.ts       # Navigation utilities
├── assets/                 # Images and icons
├── App.tsx                # Main app component
└── package.json           # Dependencies and scripts
```

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Components**: 
  - React Native core components
  - Expo Linear Gradient
  - Expo Vector Icons
- **State Management**: React Hooks
- **Styling**: StyleSheet API with responsive design

## Development Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## Features Roadmap

### Phase 1 (Current)
- ✅ Splash screen with OCEH branding
- ✅ Home dashboard with Earth visualization
- ✅ Real-time debris statistics
- ✅ Basic navigation structure

### Phase 2 (Planned)
- [ ] Debris tracking module
- [ ] Recycling hub interface
- [ ] Business dashboard with analytics
- [ ] Push notifications for alerts
- [ ] Offline data synchronization

### Phase 3 (Future)
- [ ] 3D debris visualization with CesiumJS
- [ ] AR debris spotting features
- [ ] Integration with satellite APIs
- [ ] Multi-language support
- [ ] Advanced filtering and search

## UI/UX Design

### Color Scheme
- **Primary**: Deep space blue (`#0f1419`)
- **Secondary**: Steel blue (`#1a2332`)
- **Accent**: Cyan (`#64c8ff`)
- **Warning**: Red (`#ff6b6b`) for small debris
- **Success**: Teal (`#4ecdc4`) for large debris
- **Info**: Light gray (`#b0c4de`)

### Typography
- **Headers**: Bold, white text with letter spacing
- **Body**: Light gray text for readability
- **Stats**: Large, prominent numbers
- **Actions**: Medium weight with color coding

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the OCEH initiative for space debris cleanup and environmental protection.

## Support

For questions or support, please contact the OCEH development team.

---

**OCEH Hub** - Cleaning space, protecting Earth 🌍🚀