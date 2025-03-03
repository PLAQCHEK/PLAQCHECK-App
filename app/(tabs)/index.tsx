import React, { useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text 
} from 'react-native';
import useBLE from '@/hooks/useBLE';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [showTips, setShowTips] = useState(false);
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    color,
    requestPermissions,
    scanForPeripherals,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#9fb0b5', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/justlogo.png')}
          style={styles.reactLogo}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Connect Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={() => {openModal()}}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Help Button & Tooltip */}
      <ThemedView style={styles.hbContainer}>
        <View>
          <TouchableOpacity 
            style={styles.helpButton} 
            onPress={() => setShowTips(!showTips)}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>

          {/* Tooltip Box */}
          {showTips && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>
                How to Connect to Immunosensor{'\n\n'}
                1️⃣ Open **Settings**{'\n'}
                2️⃣ Open **Bluetooth Devices**{'\n'}
                3️⃣ Select **Immunosensor** from the list{'\n'}
                4️⃣ Wait for confirmation message{'\n\n'}
                *Note: Steps may vary between iOS and Android*{'\n'}
                {/* You can add images here later if needed */}
              </Text>
            </View>
          )}
        </View>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    marginTop: 16,
  },
  hbContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingBottom: 150,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 40,
    paddingHorizontal: 100,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  helpButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12, 
  },
  helpButtonText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
  },
  tooltip: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: -290 }], // Adjusted to center
    backgroundColor: '#fff',
    minWidth: 200,
    maxWidth: 300,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  tooltipText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  reactLogo: {
    height: 170,
    width: 240,
    bottom: 0,
    left: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
});
