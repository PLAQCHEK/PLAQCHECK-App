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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      {/* Start Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={() => console.log('Start button pressed')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Stop Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={() => console.log('Stop button pressed')}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </ThemedView>

      <Progress.Bar style={styles.progressBar} progress={0.5} animationType='decay' indeterminate={true}>
      </Progress.Bar>

      <ThemedText type='defaultSemiBold'>Estimated Time Until Completion: 30 minutes</ThemedText>

      
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
  progressBar: {
    width: 1000,
    height: 170,
  }
});
