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
