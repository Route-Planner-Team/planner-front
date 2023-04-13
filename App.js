import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {SignUpScreen} from './screens/Signup.js';
import {LoginScreen} from './screens/Login.js';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="Sign up"
              component={SignUpScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
  );
}