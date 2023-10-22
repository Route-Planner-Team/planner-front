import React, {useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native-web";
import {GoogleMapsWrapper} from "../components/GoogleMapsWrapper";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Map} from "../components/Map";
import config from "../config";
import {
    Avatar,
    Button,
    Dialog,
    Divider,
    FAB, HelperText,
    IconButton,
    List,
    Portal, SegmentedButtons,
    Switch,
    TextInput,
    useTheme
} from "react-native-paper";
import {Animated, Dimensions, Keyboard, StatusBar, Text} from "react-native";
import PriorityModal from "../components/PriorityModal";
import {LinearGradient} from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import route from "./Route";


function HomeScreen({data, setRefresh, refresh}) {
    const {colors} = useTheme();
    const navigation = useNavigation();
    const autocompleteRef = useRef(null);
    const AUTOCOMPLETE_PLACEHOLDER = 'Enter Location';


    const [depot, setDepot] = useState();
    const [currentRegion, setCurrentRegion] = useState({
        lat: 52.46672421135597, lng: 16.927230713146788
    })
    const [markerCoords, setMarkerCoords] = useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788
    });
    const [destinations, setDestinations] = useState([]);
    const [isMarkerVisible, setIsMarkerVisible] = useState(false);

    const [tolls, setTolls] = React.useState(false);
    const [routeDays, setRouteDays] = React.useState('1');
    const [routeMaxTime, setRouteMaxTime] = React.useState(480);
    const [routeMaxDistance, setRouteMaxDistance] = React.useState(200); // in kilometers
    const [savingPreference, setSavingPreference] = React.useState('distance');



    const [routeSettingsModalVisible, setRouteSettingsModalVisible] = React.useState(false);
    const [daysModalVisible, setDaysModalVisible] = React.useState(false);
    const [priorityModalVisible, setPriorityModalVisible] = React.useState(false);
    const [activePriorityDestination, setActivePriorityDestination] = React.useState();
    const [isModalOfDaysVisible, setModalOfDaysVisible] = React.useState(false);
    const [isModalOfTimeVisible, setModalOfTimeVisible] = React.useState(false);
    const [isModalOfDistanceVisible, setModalOfDistanceVisible] = React.useState(false);
    const [isModalOfPreferenceVisible, setModalOfPreferenceVisible] = React.useState(false);


    function handleAutocompletePress(data, details) {
        const newRegion = {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
        };
        setCurrentRegion(newRegion);
        setMarkerCoords({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng
        });
        setIsMarkerVisible(true);
        setDestinations([...destinations, {
            address: data.description,
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            priority: 2,
            depot: false
        }]);
        autocompleteRef.current.setAddressText('');
    }

    function deleteDestination(destination) {
        const destinationsFiltered = destinations.filter(d => d.address !== destination.address);
        setDestinations(destinationsFiltered);

        if (destinationsFiltered.length > 0) {
            const lastDest = destinationsFiltered[destinationsFiltered.length - 1];
            setMarkerCoords({latitude: lastDest.latitude, longitude: lastDest.longitude});
            if (currentRegion.latitude === destination.latitude && currentRegion.longitude === destination.longitude) {
                const newRegion = {
                    lat: lastDest.latitude,
                    lng: lastDest.longitude,
                }
                setCurrentRegion(newRegion);
            }
        } else {
            setIsMarkerVisible(false);
        }
    }

    return (
        <GoogleMapsWrapper>
            <Map style={styles.map}></Map>
            <FAB icon={'cog-outline'}
                 size={'medium'}
                 onPress={() => setRouteSettingsModalVisible(!routeSettingsModalVisible)}
                 style={[styles.fab, {backgroundColor: colors.secondary}]}>
            </FAB>
            <View style={[styles.navigationContainer, {background: colors.background}]}>
                <View style={styles.searchBarContainer}>
                    <GooglePlacesAutocomplete placeholder={AUTOCOMPLETE_PLACEHOLDER}
                                              minLength={2}
                                              autoFocus={false}
                                              returnKeyType={'default'}
                                              fetchDetails={true}
                                              ref={autocompleteRef}
                                              query={{
                                                  key: config.googleAPIKey, language: 'en',
                                              }}
                                              requestUrl={{
                                                  useOnPlatform: 'web',
                                                  url: config.CORSProxyGoogleApiUrl
                                              }}
                                              onPress={(data, details = null) => {
                                                  handleAutocompletePress(data, details)
                                              }}
                                              renderLeftButton={() => <IconButton icon={'menu'} size={26}
                                                                                  style={{alignSelf: 'center'}}
                                                                                  onPress={() => navigation.openDrawer()}/>}

                                              styles={{
                                                  textInput: {
                                                      backgroundColor: colors.secondary,
                                                      alignSelf: 'center'
                                                  },

                                                  row: {
                                                      backgroundColor: colors.secondary,

                                                  },
                                                  poweredContainer: {
                                                      backgroundColor: colors.secondary,

                                                  },
                                                  listView:{
                                                      backgroundColor: colors.secondary,
                                                      marginBottom: 25,
                                                  },
                                              }}
                                              styles={{
                                                  textInput: {
                                                      backgroundColor: colors.white,
                                                      alignSelf: 'center',
                                                      borderWidth: 1,
                                                      borderColor: colors.grey,
                                                      borderRadius: 12
                                                  },

                                                  row: {
                                                      backgroundColor: colors.background,

                                                  },
                                                  poweredContainer: {
                                                      backgroundColor: colors.background,

                                                  },
                                                  listView: {
                                                      backgroundColor: colors.background,
                                                      marginBottom: 25,
                                                  },
                                              }}/>
                </View>
                <View style={styles.destinationsContainer}>
                    <ScrollView>
                        <Divider></Divider>
                        {!destinations.length ?
                            <View style={styles.emptyContent}>
                                <Avatar.Icon size={225} icon="map-marker-plus" color={colors.onSurfaceDisabled}
                                             style={{backgroundColor: 'transparent'}}/>
                                <Text
                                    style={{
                                        color: colors.onSurfaceDisabled,
                                        alignSelf: 'center',
                                        textAlign: 'center'
                                    }}>
                                    Add at least three stops and select a depot point to optimize your route
                                </Text>
                            </View> : destinations.map(dest => (
                                <View key={dest.address}>
                                    <List.Item
                                        title={dest.address.split(', ')[0]}
                                        description={dest.address.split(', ').slice(1).join(', ')}
                                        left={props => <List.Icon {...props} color={colors.primary}
                                                                  icon={'radiobox-marked'}/>}
                                        right={() => (dest.depot ?
                                            <List.Icon icon="home-circle-outline" color="green"/> : null)}
                                        onPress={() => {
                                            setActivePriorityDestination(dest);
                                            setPriorityModalVisible(true);
                                        }
                                        }
                                    />
                                    <Divider/>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={styles.optimiseButtonContainer}>
                    <LinearGradient
                        colors={['transparent', colors.background, colors.background, colors.background, colors.background, colors.background]}
                        start={{x: 0.5, y: 0}}
                        end={{x: 0.5, y: 1}}
                        style={styles.gradientBackground}
                    >
                        <Button
                            style={styles.optimiseButton}
                            mode={'contained'}
                            icon={'car-outline'}
                            onPress={() => {
                            }}>
                            Optimise Route
                        </Button>
                    </LinearGradient>
                </View>
            </View>
            {priorityModalVisible && <PriorityModal
                priorityModalVisible={priorityModalVisible}
                setPriorityModalVisible={setPriorityModalVisible}
                setDepot={setDepot}
                activeDestination={activePriorityDestination}
                destinations={destinations}
                setDestinations={setDestinations}
                deleteDestination={deleteDestination}/>}
            <View>
                <Modal
                    statusBarTranslucent
                    isVisible={routeSettingsModalVisible}
                    onBackdropPress={() => setRouteSettingsModalVisible(true)}
                    style={{
                        margin: 0,
                        width: 600,
                        alignSelf: 'center'
                    }}
                >
                    <View style={{backgroundColor: colors.background}}>
                        <Text style={{padding: 16}}>Your route settings</Text>
                        <Divider/>
                        <List.Item
                            title='Tolls'
                            right={props =><Switch value={tolls} onValueChange={(value) => setTolls(value)}/>}>
                        </List.Item>

                        <List.Item
                            onPress={() => {setRouteSettingsModalVisible(!routeSettingsModalVisible);
                                            setDaysModalVisible(!daysModalVisible);}}
                            title='Number of days'
                            description={`${routeDays} days`}
                            right={props => <IconButton icon={'calendar'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={() => {
                                setRouteSettingsModalVisible(!routeSettingsModalVisible);
                                setModalOfTimeVisible(!isModalOfTimeVisible);
                            }}
                            title='Time limit per route'
                            description={`${routeMaxTime} minutes`}
                            right={props => <IconButton icon={'timer'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={() => {
                                setRouteSettingsModalVisible(!routeSettingsModalVisible);
                                setModalOfDistanceVisible(!isModalOfDistanceVisible);
                            }}
                            title='Distance limit per route'
                            description={`${routeMaxDistance} km`}
                            right={props => <IconButton icon={'map-marker-distance'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={() => {
                                setRouteSettingsModalVisible(!routeSettingsModalVisible);
                                setModalOfPreferenceVisible(!isModalOfPreferenceVisible);
                            }}
                            title='Saving preference'
                            description={`${savingPreference.charAt(0).toUpperCase() + savingPreference.slice(1)}`}
                            right={props => <IconButton icon={'leaf'} size={26}/>}>
                        </List.Item>
                    </View>
                </Modal>

                {isModalOfDaysVisible && <DaysDialog/>}
                {isModalOfTimeVisible && <TimeDialog/>}
                {isModalOfDistanceVisible && <DistanceDialog/>}
                {isModalOfPreferenceVisible && <PreferenceDialog/>}
            </View>
        </GoogleMapsWrapper>);

    function DaysDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routeDaysDialog, setRouteDaysDialog] = React.useState(routeDays);
        const [validError, setValidError] = React.useState(false);
        const hideDialogAccept = () => {
            setModalVisible(!modalVisible);
            setModalOfDaysVisible(!isModalOfDaysVisible);
            setVisibleDialog(false);
            setRouteDays(routeDaysDialog);
        }
        const hideDialogCancel = () => {
            setModalVisible(!modalVisible);
            setModalOfDaysVisible(!isModalOfDaysVisible);
            setVisibleDialog(false);
        }
        const handleInputChange = (str) => {
            setRouteDaysDialog(str);

            const validInput = /^[1-7]{1}$/;
            if (validInput.test(str)) {
                setValidError(false)
            }
            else{
                setValidError(true)
            }
        };

        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;;
        let keyboardHeight = React.useRef(new Animated.Value(windowHeight)).current;

        React.useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight - e.endCoordinates.height,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, []);


        return (
            <Portal>
                <Animated.View style={{ height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel}  dismissable={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{ flex: 1}}>
                                Number of days
                            </Dialog.Title>
                            <IconButton icon={'calendar'} size={26} />
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{ backgroundColor: colors.secondary, marginTop: 16 }}
                                label="Route days"
                                mode="outlined"
                                error={validError}
                                keyboardType="numeric"
                                value={routeDaysDialog}
                                onChangeText={handleInputChange}
                            />
                            <HelperText>Only values ​​between 1-7</HelperText>

                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialogCancel}>Cancel</Button>
                            <Button onPress={hideDialogAccept} disabled={validError}>Accept</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Animated.View>
            </Portal>
        );
    }
    function TimeDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routeHoursDialog, setRouteHoursDialog] = React.useState(Math.floor(parseInt(routeMaxTime, 10) / 60).toString());
        const [routeMinutesDialog, setRouteMinutesDialog] = React.useState((parseInt(routeMaxTime, 10) % 60).toString());
        const hideDialogAccept = () => {
            setModalVisible(!modalVisible);
            setModalOfTimeVisible(!isModalOfTimeVisible);
            setVisibleDialog(false);
            setRouteMaxTime(60*parseInt(routeHoursDialog, 10) + parseInt(routeMinutesDialog, 10));
        }
        const hideDialogCancel = () => {
            setModalVisible(!modalVisible);
            setModalOfTimeVisible(!isModalOfTimeVisible);
            setVisibleDialog(false);
        }

        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;;
        let keyboardHeight = React.useRef(new Animated.Value(windowHeight)).current;

        React.useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight - e.endCoordinates.height,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, []);

        return (
            <Portal>
                <Animated.View style={{ height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel}  dismissable={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{ flex: 1, zIndex: 3000 }}>
                                Time limit per route
                            </Dialog.Title>
                            <IconButton icon={'timer'} size={26} />
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <View style={{ flexDirection: 'row'}}>
                                <TextInput
                                    style={{ backgroundColor: colors.secondary, marginTop: 16, width: 130, marginRight: 8}}
                                    label="Hours"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    value={routeHoursDialog}
                                    onChangeText={routeHoursDialog => setRouteHoursDialog(routeHoursDialog)}
                                />
                                <TextInput
                                    style={{ backgroundColor: colors.secondary, marginTop: 16, width: 130  }}
                                    label="Minutes"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    value={routeMinutesDialog}
                                    onChangeText={routeMinutesDialog => setRouteMinutesDialog(routeMinutesDialog)}
                                />
                            </View>

                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialogCancel}>Cancel</Button>
                            <Button onPress={hideDialogAccept}>Accept</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Animated.View>
            </Portal>
        );
    }
    function DistanceDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routeDistanceDialog, setRouteDistanceDialog] = React.useState(routeMaxDistance.toString());
        const hideDialogCancel = () => {
            setRouteSettingsModalVisible(!routeSettingsModalVisible);
            setModalOfDistanceVisible(!isModalOfDistanceVisible);
            setVisibleDialog(false);
        }
        const hideDialogAccept = () => {
            setRouteSettingsModalVisible(!routeSettingsModalVisible);
            setModalOfDistanceVisible(!isModalOfDistanceVisible);
            setVisibleDialog(false);
            setRouteMaxDistance(parseInt(routeDistanceDialog, 10));
        }
        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;;
        let keyboardHeight = React.useRef(new Animated.Value(windowHeight)).current;

        React.useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight - e.endCoordinates.height,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                Animated.timing(keyboardHeight, {
                    toValue: windowHeight,
                    duration: 150,
                    useNativeDriver: false,
                }).start();
            });

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, []);

        return (
            <Portal>
                <Animated.View style={{ height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel}  dismissable={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{ flex: 1 }}>
                                Distance limit per day
                            </Dialog.Title>
                            <IconButton icon={'map-marker-distance'} size={26} />
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{ backgroundColor: colors.secondary, marginTop: 16 }}
                                label="Your distance in kilometers"
                                mode="outlined"
                                keyboardType="numeric"
                                value={routeDistanceDialog}
                                onChangeText={routeDistanceDialog => setRouteDistanceDialog(routeDistanceDialog)}
                            />

                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialogCancel}>Cancel</Button>
                            <Button onPress={hideDialogAccept}>Accept</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Animated.View>
            </Portal>
        );
    }
    function PreferenceDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routePreferenceDialog, setRoutePreferenceDialog] = React.useState(savingPreference);
        const hideDialog = () => {
            setRouteSettingsModalVisible(!routeSettingsModalVisible);
            setModalOfPreferenceVisible(!isModalOfPreferenceVisible);
            setVisibleDialog(false);
            setSavingPreference(routePreferenceDialog);
        }

        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}  dismissable={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Dialog.Title>
                            Saving preference
                        </Dialog.Title>
                        <IconButton icon={'leaf'} size={26} />
                    </View>
                    <Divider/>
                    <Dialog.Content style={{marginHorizontal: -5}}>
                        <SegmentedButtons
                            style={{marginTop: 16}}
                            value={routePreferenceDialog}
                            onValueChange={setRoutePreferenceDialog}
                            buttons={[
                                {value: 'distance', label: 'Distance'},
                                {value: 'duration', label: 'Duration',},
                                {value: 'fuel', label: 'Fuel',},
                            ]}
                        />
                        <HelperText>
                            Pick the value that is your priority in saving
                        </HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Accept</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

const styles = StyleSheet.create(
    {
        map: {},
        navigationContainer: {
            top: '20px',
            left: '5px',
            position: 'absolute',
            width: '375px',
            height: '675px',
            borderRadius: 28,
            flexDirection: 'column',
            padding: 10
        },
        searchBarContainer: {
            top: '22px',
            flex: 2
        },
        destinationsContainer: {
            flex: 4,
        },
        optimiseButtonContainer: {
            flex: 1,
        },
        emptyContent: {
            alignItems: 'center',
            margin: 8,
        },
        optimiseButton: {
            height: 40,
        },
        gradientBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        fab: {
            position: 'absolute',
            marginRight: 60,
            marginTop: 60,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
        }
    }
);

export default HomeScreen;
