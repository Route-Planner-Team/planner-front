import * as React from 'react';
import {Platform} from 'react-native';
import {DefaultTheme, IconButton, Provider as PaperProvider, useTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import SignUpScreen from './screens/Signup';
import LoginScreen from './screens/Login';
import OptionsScreen from './screens/Options.js';
import StatisticsScreen from './screens/Statistics.js';
import NaviScreen from './screens/Navi.js';
import ProfileScreen from './screens/Profile.js';
import DrawerScreen from './components/Drawer.js';
import HomeScreen from "./screens/Home";
import RouteScreen from "./screens/Route";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6750A4',
        secondary: '#efe9f5'
    }
}


function Root({route}) {

    const [avatar, setAvatar] = React.useState(null);
    const [name, setName] = React.useState('Route Planner');
    const [refresh, setRefresh] = React.useState(false);

    return (

      <Drawer.Navigator 
      screenOptions={{
        headerTransparent: true
        }}
        drawerContent={props => <DrawerScreen{...props} data={route.params.data} avatar={avatar} name={name} refresh={refresh}/>}>
        <Drawer.Screen
            name="Home"
            options={{
                headerLeft: () => null,
                headerShown: false,
            }}>
            {props => <HomeScreen 
                data={route.params.data}
                setRefresh={setRefresh} 
                refresh={refresh} 
            />}
        </Drawer.Screen>
        <Drawer.Screen
            name="Profile"
            options={{
                headerTitle: "My profile",
                drawerItemStyle: { height: 0 }
                
            }}>
                {props => <ProfileScreen {...props} 
                    setAvatar={setAvatar} 
                    setName={setName} 
                    setRefresh={setRefresh} 
                    refresh={refresh} 
                    name={name} 

                    data={route.params.data}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />}
            </Drawer.Screen>
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
        <Drawer.Screen
            name="Route"
            component={RouteScreen}
            options={{
                headerTitle: " "
            }}/>
        <Drawer.Screen
            name="Navi"
            component={NaviScreen}
            options={({ navigation }) => ({
                headerTitle: "Navigation",
                headerLeft: () => (
                    
                     <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
                )
            })}/>
      </Drawer.Navigator>
    );
  }

                }}>
                {props => <ProfileScreen {...props}
                                         setAvatar={setAvatar}
                                         setName={setName}
                                         setRefresh={setRefresh}
                                         refresh={refresh}
                                         name={name}
                                         data={route.params.data}
                />}
            </Drawer.Screen>
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
            <Drawer.Screen
                name="Route"
                component={RouteScreen}
                options={
                    Platform.OS === 'web' ? {
                        headerLeft: () => null,
                        headerShown: false,
                    } : {headerTitle: " "}
                }/>
            <Drawer.Screen
                name="Navi"
                component={NaviScreen}
                options={({navigation}) => ({
                    headerTitle: "Navigation",
                    headerLeft: () => (

                        <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
                    )
                })}/>
        </Drawer.Navigator>
    );
}


export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <PaperProvider theme={theme}>
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
                <StatusBar style="auto"/>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
