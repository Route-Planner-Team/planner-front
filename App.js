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
import StatisticsScreen from './screens/Statistics.js';
import NaviScreen from './screens/Navi.js';
import ProfileScreen from './screens/Profile';
import DrawerScreen from './components/Drawer';
import HomeScreen from "./screens/Home";
import RouteScreen from "./screens/Route";
import RegenerateScreen from "./screens/Regenerate";
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)


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

const darkTheme = { //TODO
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6750A4',
        secondary: '#efe9f5',
    }

}


function Root({route}) {

    const {colors} = useTheme();

    const [avatar, setAvatar] = React.useState(null);
    const [name, setName] = React.useState('Route Planner');
    const [refresh, setRefresh] = React.useState(false);
    const [calendar, setCalendar] = React.useState(false);
    const [places, setPlaces] = React.useState([]);

    return (

      <Drawer.Navigator
      screenOptions={{
        headerTransparent: false
        }}
        drawerContent={props => <DrawerScreen{...props} data={route.params.data} avatar={avatar} name={name} refresh={refresh}/>}
        backBehavior='history'>
        <Drawer.Screen
            name="Home"
            options={{
                headerLeft: () => null,
                headerShown: false,
            }}>
            {props => <HomeScreen
                data={route.params.data}
                refresh={refresh}
                setRefresh={setRefresh}
                places={places}
                setPlaces={setPlaces}
            />}
        </Drawer.Screen>
        <Drawer.Screen
            name="Profile"
            options={({navigation}) => ({
                headerTitle: "My profile",
                headerTransparent: true,
                drawerItemStyle: { height: 0 },
                headerLeft: () => (
                    <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
               )

            })}>
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
            options={({navigation}) => ({
                headerTransparent: false,
                headerTitle: "Statistics",
                headerStyle: {
                    backgroundColor: colors.surfaceVariant
                  },
                headerLeft: () => (

                    <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
                ),
                headerRight: () => (

                    <IconButton icon='calendar-range-outline' onPress={() => setCalendar(!calendar)}></IconButton>
                )
            })}>
                {props => <StatisticsScreen {...props}
                    setCalendar={setCalendar}
                    calendar={calendar}
                    data={route.params.data}
                />}
            </Drawer.Screen>

        <Drawer.Screen
            name="Route"
            options={Platform.OS !== 'web' ? {
                headerTransparent: true,
                headerTitle: " "
            } : {
                headerLeft: () => null,
                headerShown: false
            }}>
            {props => <RouteScreen {...props}
                setRefresh={setRefresh}
                refresh={refresh}
                data={route.params.data}
                setPlaces={setPlaces}
            />}
        </Drawer.Screen>
        <Drawer.Screen
            name="Navi"
            component={NaviScreen}s
            options={({ navigation }) => ({
                headerTransparent: false,
                headerTitle: "Navigation",
                headerStyle: {
                    backgroundColor: colors.surfaceVariant
                  },
                headerLeft: () => (

                     <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
                )
            })}/>
        <Drawer.Screen
            name="Regenerate"
            options={({ navigation }) => ({
                headerTransparent: false,
                headerTitle: "Regenerate",
                headerStyle: {
                    backgroundColor: colors.surfaceVariant
                  },
                headerLeft: () => (

                     <IconButton icon='arrow-left' onPress={() => navigation.goBack()}></IconButton>
                )
            })}>
                {props => <RegenerateScreen {...props}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}


export default function App() {
    const {colors} = useTheme();
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
                        <Stack.Screen
                            name="Regenerate"
                            component={RegenerateScreen}
                            options={{
                                headerShown: true,
                                headerShadowVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.surfaceVariant,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="Navi"
                            component={NaviScreen}
                            options={{
                                headerShown: true,
                                headerShadowVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.surfaceVariant,
                                },
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
                <StatusBar style="auto"/>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
