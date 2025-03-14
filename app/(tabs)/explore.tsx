import React, { useState } from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text 
} from 'react-native';

import useBLE from '../../hooks/useBLS';
import DeviceModal from "../DeviceConnectionModal";

import * as Progress from 'react-native-progress'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function Item({complete=false,progressValue=0,category='',reading=''}) {
  if (complete) {
    return (
      <ThemedView>
        <ThemedText>Test Complete!</ThemedText>
        <ThemedText>Results Obtained from Test</ThemedText>
        <ThemedText>Category: {category}</ThemedText>
        <ThemedText>Reading: {reading} mg/mL of Lp-PLA2</ThemedText>
      </ThemedView>
    )
  }
  else {
    return (
      <ThemedView>
         <Progress.Bar progress={progressValue} width={300} height={40} color={"green"}/>
        <ThemedText type='defaultSemiBold'>Estimated Time Until Completion: {Math.round((1-progressValue)*20)} minutes</ThemedText>
      </ThemedView>
    )
  }
}

export default function Results() {
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
    writeToCharacteristic,
  } = useBLE();
  
  const writeStartData = async () => {
    writeToCharacteristic(START_CHARACTERISTIC_UUID,'start')
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
      
      {/* Start Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={() => writeStartData}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.connectButton} onPress={() => console.log('Stop button pressed')}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </ThemedView>



      <Item complete={false} progressValue={0.8}/>
      <Item complete={true} progressValue={0.8} category='low risk!' reading='80'/>

      
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
    flexDirection: 'row', // Stack buttons horizontally
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    marginTop: 32,
    paddingHorizontal: 1,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  progressCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 50,   // Adjust the font size
    fontWeight: 'bold', // Optional: make text bold
    color: '#333',  // Change text color if needed
    textAlign: 'center',  // Center the text horizontally
    lineHeight: 50,  // Adjust this to center vertically
  },
});
