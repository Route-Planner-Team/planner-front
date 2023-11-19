# Route Planner Frontend
This project is bootstrapped using [create-expo-app](https://docs.expo.dev/workflow/glossary-of-terms/#create-expo-app).

## Running the app
Before running the app, you need to install the required dependencies using `npm install`.  
You can run the app in Web, iOS or Android.  
To run in web type `npm run web`.  
To run on Android or iOS, download the [Expo Go](https://expo.dev/client) app and run `npm start` on your host machine, then scan the QR code displayed in the terminal using the Camera App (iOS) or Expo Go (Android) and the app will build on your mobile device.

## Testing the app

You can execute the unit tests for the app using `npm test`, unit tests are implemented using the `jest` and `jest-expo` libraries.  
Route planner uses snapshot testing, if a snapshot test fails and the changes made to the component were intentional, run `jest --updateSnapshot` or `npm test -- --updateSnapshot`.  
For more information visit the official [Jest documentation](https://jestjs.io/docs/getting-started) and the [Expo documentation](https://docs.expo.dev/guides/testing-with-jest/).

## Styling
The app is using `react-native-paper` as the main UI kit library. For more information visit the official [React Native Paper documentation](https://callstack.github.io/react-native-paper/docs/guides/getting-started).

## Maps
The app is using the `react-native-maps` library to implement maps. Head over to the official [react-native-maps documentation](https://github.com/react-native-maps/react-native-maps) for more details. In order to use the Google Maps API, you need an API key. Instructions for obtaining the API key can be found [here](https://developers.google.com/maps/documentation/ios-sdk/get-api-key).

## Google Places Autocomplete on Web
Due to technical limitations whenever you are trying to connect to the Google Places API you need to use a CORS proxy.  
If you are using the link provided by the [Github documentation](https://github.com/FaridSafi/react-native-google-places-autocomplete/blob/master/README.md#web-support), make sure that you first enter the proxy URL on your browser and activate the proxy.

## Config
Insert your Google API Key, Route Planner API URL, and CORS Proxy Google Maps Api URL (only for WEB client) to the `config.js` file before running the app.
