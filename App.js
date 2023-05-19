import * as React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider, useTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/Home.js';
import SignUpScreen from './screens/Signup.js';
import LoginScreen from './screens/Login.js';
import OptionsScreen from './screens/Options.js';
import StatisticsScreen from './screens/Statistics.js';
import ProfileScreen from './screens/Profile.js';
import DrawerScreen from './components/Drawer.js';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
    const { colors } = useTheme();
    return (
      <Drawer.Navigator screenOptions={{
        headerShown: true,
        headerTransparent: true
        }}
        drawerContent={props => <DrawerScreen{...props}/>}>
        <Drawer.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
                headerLeft: () => null,
                headerTitle: " "
            }}/>
        <Drawer.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
                headerTitle: "My profile",
                drawerItemStyle: { height: 0 }
            }}/>
        <Drawer.Screen 
            name="Statistics" 
            component={StatisticsScreen}
            options={{
                headerTitle: "Statistics"
            }}/>
        <Drawer.Screen 
            name="Options" 
            component={OptionsScreen}
            options={{
                headerTitle: "Options"
            }}/>
      </Drawer.Navigator>
    );
  }



export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
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
                            name="Root"
                            component={Root}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
