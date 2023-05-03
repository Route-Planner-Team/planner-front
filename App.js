import * as React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './screens/Home.js';
import SignUpScreen from './screens/Signup.js';
import LoginScreen from './screens/Login.js';


const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignUpScreen}
                        />
                        <Stack.Screen
                            name="Home"
                            component={Home}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
       </GestureHandlerRootView>
    );
}
