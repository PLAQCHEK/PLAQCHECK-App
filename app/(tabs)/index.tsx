import React, { useState, useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text ,
} from 'react-native';

import useBLE from '../../hooks/useBLS';
import DeviceModal from "../DeviceConnectionModal";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Progress from 'react-native-progress'

export default function HomeScreen() {
  const START_CHARACTERISTIC_UUID = "00010004-ada2-4607-9d2f-71ec54c0cdf4";
  const PROGRESS_UUID = "00010003-ada2-4607-9d2f-71ec54c0cdf4";
  const STATUS_UUID = "00010002-ada2-4607-9d2f-71ec54c0cdf4";
  const LPPLA2_UUID = "00010001-ada2-4607-9d2f-71ec54c0cdf4";
  const [showTips, setShowTips] = useState(false);
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    color,
    requestPermissions,
    scanForPeripherals,
    disconnectFromDevice,
    writeToCharacteristic,
    readStringCharacteristic,
    readFloatCharacteristic,
    monitorCharacteristic,
    decodedListeningData,
    decodedReadFloatData,
    decodedReadStringData
  } = useBLE();

  const writeStartData = () => {
    writeToCharacteristic(START_CHARACTERISTIC_UUID,'start')
  };
  const writeResetData = () => {
    writeToCharacteristic(START_CHARACTERISTIC_UUID,'reset')
  };
  const writeHardResetData = () => {
    writeToCharacteristic(START_CHARACTERISTIC_UUID,'hard')
  };
  const readData = () => {
    readFloatCharacteristic(LPPLA2_UUID)
    readStringCharacteristic(STATUS_UUID)
  }
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const [isConnectBluetoothVisible, setConnectBluetoothVisible] = useState<boolean>(true);
  const [isBaselineTestVisible, setIsBaselineTestVisible] = useState<boolean>(false);
  const [isLoadingBaselineVisible, setIsLoadingBaselineVisible] = useState<boolean>(false);
  const [isCompleteBaselineVisible, setIsCompleteBaselineVisible] = useState<boolean>(false);
  const [isLoadingTestVisible, setIsLoadingTestVisible] = useState<boolean>(false);
  const [isCompleteTestVisible, setIsCompleteTestVisible] = useState<boolean>(false);
  const [isFinalTest, setIsFinalTest] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const showBaselineTest = () => {
    setIsModalVisible(false)
    setConnectBluetoothVisible(false)
    setIsBaselineTestVisible(true)
  }

  const startBaselineTest = () => {
    writeStartData()
    setIsLoadingBaselineVisible(true)
    monitorCharacteristic(PROGRESS_UUID)
  }

  const startSampleTest = () => {
    writeStartData()
    setIsLoadingTestVisible(true)
    monitorCharacteristic(PROGRESS_UUID)
    setTimeout(() => {
      setIsFinalTest(true);
    }, 5000);
  }

  const softReset = () => {
    setIsLoadingBaselineVisible(false)
    setIsCompleteBaselineVisible(false)
    setIsLoadingTestVisible(false)
    setShowResults(false)
    setIsFinalTest(false)
    setIsCompleteTestVisible(false)
    setTimeout(() => {
      writeResetData()
    }, 1000)
  }

  const hardReset = () => {
    setIsLoadingBaselineVisible(false)
    setIsCompleteBaselineVisible(false)
    setIsCompleteBaselineVisible(false)
    setIsLoadingTestVisible(false)
    setShowResults(false)
    setIsFinalTest(false)
    setIsCompleteTestVisible(false)
    setTimeout(() => {
      writeHardResetData()
    }, 1000)
    
  }

  const disconnect = () => {
    setConnectBluetoothVisible(true)
    setIsBaselineTestVisible(false)
    setIsLoadingBaselineVisible(false)
    setIsCompleteBaselineVisible(false)
    setIsLoadingBaselineVisible(false)
    setIsCompleteBaselineVisible(false)
    setShowResults(false)
    setIsLoadingTestVisible(false)
    setTimeout(() => {
      disconnectFromDevice();
    }, 1000)

  }

  const connectBluetoothUI = () => {
    return (
      <ThemedView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />

        </ThemedView>

        {/* Connect Button */}
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.connectButton} onPress={connectedDevice ? disconnectFromDevice : openModal}>
            <Text style={[styles.buttonText, connectedDevice ? styles.disconnectButtonText : styles.connectButtonText]}>{connectedDevice ? "Disconnect" : "Connect"}</Text>
          </TouchableOpacity>
          <DeviceModal
            closeModal={showBaselineTest}
            visible={isModalVisible}
            connectToPeripheral={connectToDevice}
            devices={allDevices}
          />
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
                  1️⃣ Make sure Bluetooth is enabled on your device{'\n'}
                  2️⃣ Press the "Connect" button {'\n'}
                  3️⃣ Select "PLAQCHEK" from the listed devices{'\n'}
                  {/* You can add images here later if needed */}
                </Text>
              </View>
            )}
          </View>

        </ThemedView>
      </ThemedView>
    )
  }

  const disconnectButton = () => {
    return (
      <TouchableOpacity style={styles.disconnectButton} onPress={() => disconnect()}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>  
    )
  }

  const baselineTestUI = () => {
    return (
      <ThemedView style={styles.testButtonsContainer}>
        <TouchableOpacity style={styles.startStopButtons} onPress={() => startBaselineTest()}>
          <Text style={styles.buttonText}>Start Baseline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.startStopButtons} onPress={() => startSampleTest()}>
          <Text style={styles.buttonText}>Start Sample</Text>
        </TouchableOpacity>        
      </ThemedView>
    )
  }

  const loading = (percent:number)=> {
    return (
      <ThemedView style={styles.loadingBar}>
        <Progress.Bar progress={percent/100} width={300} height={40} color={"green"}/>
        <ThemedText type='defaultSemiBold'>Progress: {percent}%</ThemedText>
      </ThemedView>
    )
  }

  const resetUI = () => {
    return (
      <ThemedView style={styles.testButtonsContainer}>
        <TouchableOpacity style={styles.resetButtons} onPress={() => softReset()}>
          <Text style={styles.buttonText}>Soft Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButtons} onPress={() => hardReset()}>
          <Text style={styles.buttonText}>Hard Reset</Text>
        </TouchableOpacity>        
      </ThemedView>
    )
  }

  const testCompleteUI = (status:string,reading:number) => {
    return (
    <ThemedView>
      <ThemedText>Test Complete!</ThemedText>
      <ThemedText>Results Obtained from Test</ThemedText>
      <ThemedText>Category: {status}</ThemedText>
      <ThemedText>Reading: {reading.toFixed(2)} ng/mL of Lp-PLA2</ThemedText>
    </ThemedView>
    )};

  useEffect(() => {
    // Only set isCompleteBaselineVisible to true if it's not already true
    if (decodedListeningData === 99 && !isCompleteBaselineVisible ) {
      setTimeout(() => {
        setIsCompleteBaselineVisible(true);
      }, 2000)
    }
  }, [decodedListeningData, isCompleteBaselineVisible]); // Dependency array

  useEffect(() => {
    // Only set isCompleteBaselineVisible to true if it's not already true
    if (decodedListeningData === 99 && !isCompleteTestVisible && isFinalTest) {
      setTimeout(() => {
        setIsCompleteTestVisible(true);
        setShowResults(true)
        readData();
      }, 2000)
    }
  }, [decodedListeningData, isCompleteBaselineVisible, isLoadingTestVisible, isFinalTest]); // Dependency array

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#9fb0b5', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/PLAQCHEK-app-icon.png')}
          style={styles.reactLogo}
        />
      }>
      
      {isConnectBluetoothVisible ? connectBluetoothUI() : null}
      {isBaselineTestVisible ? baselineTestUI() : null}
      {(isLoadingBaselineVisible || isLoadingTestVisible) && decodedListeningData ? loading(decodedListeningData) : null}

      {decodedReadFloatData && decodedReadStringData && showResults ? testCompleteUI(decodedReadStringData,decodedReadFloatData) : null}

      {!isConnectBluetoothVisible && isBaselineTestVisible ? resetUI(): null}
      {isConnectBluetoothVisible ? <Text></Text> : disconnectButton()}
      
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
  testButtonsContainer: {
    flexDirection: 'row', // Stack buttons horizontally
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    marginTop: 32,
    paddingHorizontal: 1,
    gap: 30,
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
  startStopButtons: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtons: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    position: 'fixed',
    bottom: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 28,
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
  loadingBar: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});