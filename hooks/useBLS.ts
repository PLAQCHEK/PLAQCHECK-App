/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

const DATA_SERVICE_UUID = "000D0000-ada2-4607-9d2f-71ec54c0cdf4";
const START_CHARACTERISTIC_UUID = "00010004-ada2-4607-9d2f-71ec54c0cdf4";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [color, setColor] = useState("white");
  const [decodedListeningData, setDecodedListeningData] = useState<number | null>(null);
  const [decodedReadStringData, setDecodedReadStringData] = useState<string | null>(null);
  const [decodedReadFloatData, setDecodedReadFloatData] = useState<number | null>(null);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      console.log("connected to arduino BLE")

    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (
        device &&
        (device.localName === "PLAQCHEK" || device.name === "PLAQCHEK")
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }
     // Decode the value (Base64 encoded data)
    const decodedValue = base64.decode(characteristic.value);

    // Convert the decoded string to a byte array (Uint8Array)
    const byteArray = new Uint8Array(decodedValue.split("").map((c: string) => c.charCodeAt(0)));

    if (byteArray.length >= 2) {
      // Assuming little-endian (least significant byte first)
      const dataView = new DataView(byteArray.buffer);
      
      // Get the 16-bit unsigned integer (uint16_t) from the first two bytes
      const uint16Value = dataView.getUint16(0, true);  // true for little-endian
      console.log(uint16Value)

      setDecodedListeningData(uint16Value);
    } else {
      console.log('Data does not contain enough bytes for a uint16_t');
    }
    };

  const disconnectFromDevice = () => {
    if(connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  }

  const writeToCharacteristic = async (
    characteristicUUID: string,
    data: string
  ) => {
    if (!connectedDevice) {
      console.log('Device not connected');
      return;
    }
    console.log("writing func was called")

    // Convert data to Base64
    const base64Data = base64.encode(data);

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        '00010000-ada2-4607-9d2f-71ec54c0cdf4',               // The UUID of the service
        characteristicUUID,         // The UUID of the characteristic
        base64Data                 // The data to write (Base64 encoded)
      );
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  };

  const monitorCharacteristic = async (
    characteristicUUID: string,
  ) => {
    if (!connectedDevice) {
      console.log('Device not connected');
      return;
    }

    try {
      await connectedDevice.monitorCharacteristicForService(
        '00010000-ada2-4607-9d2f-71ec54c0cdf4',               // The UUID of the service
        characteristicUUID,         // The UUID of the characteristic
        onDataUpdate
      );
      console.log('Listening for data.');
    } catch (error) {
      console.error('Error listening for data:', error);
    }
  }

  const readStringCharacteristic = async (characteristicUUID: string) => {
    if (!connectedDevice) {
      console.log('No device connected');
      return;
    }
  
    try {
      const characteristic: Characteristic = await connectedDevice.readCharacteristicForService(
        '00010000-ada2-4607-9d2f-71ec54c0cdf4',
        characteristicUUID
      );
  
      if (characteristic.value) {
        // Check if the value appears to be a base64-encoded string (alphanumeric + +, /, =)
        if (characteristic.value.match(/^[A-Za-z0-9+/=]+$/)) {
          // It's a base64-encoded string, decode it
          const decodedString = base64.decode(characteristic.value);
          setDecodedReadStringData(decodedString); // Update string data in state
          console.log('Decoded string:', decodedString);
        } 
        
      } else {
        console.log('No value in characteristic');
      }
    } catch (error) {
      console.error('Error reading characteristic:', error);
    }
  };

  const readFloatCharacteristic = async (characteristicUUID: string) => {
    if (!connectedDevice) {
      console.log('No device connected');
      return;
    }
  
    try {
      const characteristic: Characteristic = await connectedDevice.readCharacteristicForService(
        '00010000-ada2-4607-9d2f-71ec54c0cdf4',
        characteristicUUID
      );
  
      if (characteristic.value) {
        // Decode the Base64 string into a byte array
        const base64String = characteristic.value; // e.g. 'pNCTQw=='
        const rawData = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
  
        console.log("Decoded Raw Data (before reversing):", rawData); // Log the raw byte array before reversing
  
        // Reverse the byte order to match big-endian format (in case of little-endian format in the raw data)
        const reversedData = rawData.slice().reverse();
  
        console.log("Reversed Data:", reversedData); // Log the reversed byte array
  
        // Check the hex representation of the reversed data
        console.log("Hex of Reversed Data:", Array.from(reversedData).map(byte => byte.toString(16).padStart(2, '0')).join(' '));
  
        // Convert the byte array (now in big-endian order) to a 32-bit float using DataView
        const buffer = reversedData.buffer;
        const dataView = new DataView(buffer);
  
        // Read the 32-bit float (big-endian)
        const floatValue = dataView.getFloat32(0, false); // false for big-endian
        console.log('Decoded Float Value:', floatValue);
        setDecodedReadFloatData(floatValue)
      } else {
        console.log('No value in characteristic');
      }
    } catch (error) {
      console.error('Error reading characteristic:', error);
    }
  };
  
  return {
    connectToDevice,
    allDevices,
    connectedDevice,
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
    decodedReadStringData,
  };
}

export default useBLE;