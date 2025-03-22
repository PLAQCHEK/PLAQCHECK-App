# Welcome to your Expo app 👋

Novel app to revolutionize the Medical World!

This mobile app can be used to interact with the PLAQCHEK device, to obtain the user's cardiovascular disease risk assessment.

Once the app is installed, open it and press the "Connect" button to begin connecting the app to the PLAQCHEK device. Then, allow the app to access connect to nearby devices, and the device's location. Once the permissions are given, select the PLAQCHEK device from the list of devices to connect. The app should now be connected to the PLAQCHEK device, and a bluetooth symbol on the device should now appear if the blueooth connection was successful. The question mark icon on the home be clicked for a reminder of these instructions.

![](https://github.com/PLAQCHEK/PLAQCHECK-App/tree/dev-mode-testing/assets/gifs/PLAQCHEK-Bluetooth_Connectivity.gif)


Prior to adding a blood sample, press the "Start Baseline" button to obtain a baseline light level. A loading bar should appear on the device indicating the progress of the test, which also appears on the app.

![](https://github.com/PLAQCHEK/PLAQCHECK-App/tree/dev-mode-testing/assets/gifs/PLAQCHEK-Start_Baseline.gif)


Once the baseline light level has finished, the progress bar will reach 100%. Then the device will indicate you can start the reference test; add a blood sample to the device then press the "Start Sample" button on the app. Another loading bar should appear on the device indicating the progress of this 2nd test, which also appears on the app.

![](https://github.com/PLAQCHEK/PLAQCHECK-App/tree/dev-mode-testing/assets/gifs/PLAQCHEK-Sample_Test.gif)


Once the reference test has been completed, the device and app will display the user's risk categorization for cardiovascular disease and a reading of the concentration of Lp-PLA2 present in the blood sample provided. The user can then decide to hard reset the device which will allow the user to start the baseline and sample tests again, soft reset the device will keep the baseline light level tests conducted and just allow the user to take the sample test again, or disconnect their bluetooth connection from their device to the PLAQCHEK device.

![](https://github.com/PLAQCHEK/PLAQCHECK-App/tree/dev-mode-testing/assets/gifs/PLAQCHEK-Results.gif)

Supported Platforms:
- Android Development

Future Platform Supports: 
- IOS Development
- ipadOS 
- macOS
- watchOS
- visionOS
- tvOS
- Tesla Car App
- Samsung Fridge
- Windows App
- Linux App
- MATLAB Interface

gRaPhIc dEsIgN Is mY pAsSiOn

![](https://flat-icons.com/wp-content/uploads/2021/03/Graphic-Design-Is-My-Passion-GIF.gif)


## Expo Instructions

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
