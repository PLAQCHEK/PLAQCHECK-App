import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text,
  Platform 
} from 'react-native';

import * as Progress from 'react-native-progress'

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

function Item({complete=false,progressValue=0,category='',reading=''}) {
  if (complete) {
    return (
      <ThemedView>
        <Progress.Circle style={styles.progressCircle} showsText={true} size={200} thickness={10} progress={progressValue} textStyle={styles.textStyle}></Progress.Circle>
        <ThemedText type='defaultSemiBold'>Estimated Time Until Completion: {Math.round((1-progressValue)*20)} minutes</ThemedText>
      </ThemedView>
    )
  }
  return (
    <ThemedView>
      <ThemedText>Test Complete!</ThemedText>
      <ThemedText>Results Obtained from Test</ThemedText>
      <ThemedText>Category: {category}</ThemedText>
      <ThemedText>Reading: {reading} mg/mL of Lp-PLA2</ThemedText>
    </ThemedView>
  )
}

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/justlogo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Start Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={() => console.log('Start button pressed')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.connectButton} onPress={() => console.log('Stop button pressed')}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </ThemedView>

      
      <Item complete={true} progressValue={0.8}></Item>
      <Item complete={false} progressValue={0.8} category='Low Risk' reading='90'></Item>

      
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingBottom: 150,
    paddingRight: 32,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginHorizontal: 10,
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
  progressBar: {
    width: null,
    height: 6,
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
