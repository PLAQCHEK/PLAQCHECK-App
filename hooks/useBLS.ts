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

const DATA_SERVICE_UUID = "00010000-ada2-4607-9d2f-71ec54c0cdf4";
const START_CHARACTERISTIC_UUID = "00010004-ada2-4607-9d2f-71ec54c0cdf4";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [color, setColor] = useState("white");

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

      startStreamingData(deviceConnection);
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

    const colorCode = base64.decode(characteristic.value);

    let color = "white";
    if (colorCode === "B") {
      color = "blue";
    } else if (colorCode === "R") {
      color = "red";
    } else if (colorCode === "G") {
      color = "green";
    }

    setColor(color);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        START_CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
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

    // Convert data to Base64
    const base64Data = base64.encode(data);

    try {
      // Use writeCharacteristicWithoutResponseForService to send the data
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        '00010000-ada2-4607-9d2f-71ec54c0cdf4',       // The UUID of the service
        characteristicUUID, // The UUID of the characteristic
        base64Data,         // The data encoded as Base64
      );
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  };

  return {
    connectToDevice,
    allDevices,
    connectedDevice,
    color,
    requestPermissions,
    scanForPeripherals,
    startStreamingData,
    disconnectFromDevice,
    writeToCharacteristic,
  };
}

export default useBLE;