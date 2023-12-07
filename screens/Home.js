import React from 'react';
import {
    Dimensions,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    Animated,
    StatusBar
} from 'react-native';
import {
    Button, 
    Divider, 
    FAB, 
    IconButton, 
    List, 
    useTheme, 
    Switch,
    Dialog, 
    Portal, 
    TextInput,
    SegmentedButtons,
    HelperText,
    Avatar,
    Checkbox,
} from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheet, { BottomSheetFooter, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import PriorityModal from "../components/PriorityModal";
import LoadingModal from "../components/LoadingModal";
import WarningModal from "../components/WarningModal";
import config from "../config";
import Geocoder from 'react-native-geocoding';


const bottomSheetSnapPoints = ['12%', '55%', '85%'];

function HomeScreen({data, setRefresh, refresh}) {

    const navigation = useNavigation();

    const { email, expires_in, access_token, refresh_token } = data;
    const [isLoading, setIsLoading] = React.useState(false);
    const [warning, setWarning] = React.useState(false);
    const [warningMess, setWarningMess] = React.useState("");
    //Bottom sheet attributes
    const bottomSheetRef = React.useRef(null);
    const handleCloseBottomSheet = () => bottomSheetRef.current.snapToIndex(0)
    const {colors} = useTheme();
    const scrollViewRef = React.useRef(null);
    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            handleCloseBottomSheet();
        });
        return () => {
            keyboardDidShowListener.remove();
        };
      }, []);

    const mapRef = React.useRef(null);
    const autocompleteRef = React.useRef(null);
    const [currentRegion, setCurrentRegion] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788, latitudeDelta: 0.01, longitudeDelta: 0.005
    });
    const [markerCoords, setMarkerCoords] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788
    });
    const [destinations, setDestinations] = React.useState([]);
    const [depot, setDepot] = React.useState();
    const [isMarkerVisible, setIsMarkerVisible] = React.useState(false);
    const [tolls, setTolls] = React.useState(false);
    const [savingPreference, setSavingPreference] = React.useState('distance');
    const [routeDays, setRouteDays] = React.useState('1');
    const [routeMaxTime, setRouteMaxTime] = React.useState(480); 
    const [routeMaxDistance, setRouteMaxDistance] = React.useState(200); // in kilometers
    const [priorityModalVisible, setPriorityModalVisible] = React.useState(false);
    const [activePriorityDestination, setActivePriorityDestination] = React.useState();
    const [optimise, setOptimise] = React.useState(false);
    const [noTimeLimit, setNoTimeLimit] = React.useState(false);

    React.useEffect(() => {
        let depot = destinations.filter(x => x.depot === true)
        if(destinations.length >= 3 && depot.length !== 0){
            setOptimise(true)
        }
        else{
            setOptimise(false)
        }
      }, [destinations]);

    function handleSearchButtonPress() {
        if (!autocompleteRef.current.isFocused()) autocompleteRef.current.focus();
    }

    const optimiseRoute = async () => {
        setIsLoading(true);
        let stops = destinations.filter(x => x.depot !== true)
        const bddy = JSON.stringify({
            depot_address: depot.address,
            addresses: stops.map(x => x.address),
            priorities: stops.map(x => x.priority),
            days: routeDays,
            distance_limit: routeMaxDistance,
            duration_limit: routeMaxTime,
            preferences: savingPreference,
            avoid_tolls: tolls
        })
        console.log(bddy)
        await fetch(`${config.apiURL}/routes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    depot_address: depot.address,
                    addresses: stops.map(x => x.address),
                    priorities: stops.map(x => x.priority),
                    days: routeDays,
                    distance_limit: routeMaxDistance,
                    duration_limit: routeMaxTime,
                    preferences: savingPreference,
                    avoid_tolls: tolls
                }),
            }).then(response => response.json())
            .then(data => {
                if (data.error !== undefined){
                    console.log(data)
                    setWarning(true);
                    setWarningMess(data.error)
                }
                else{
                    setRefresh(!refresh) //Refresh drawer navigation list
                    const activeRoute = data.routes[0];
                    navigation.navigate('Route', { activeRoute, access_token })
                }
                setIsLoading(false);
            })
            .catch(err => 
            {
                console.log(err);
                setWarning(true);
                setIsLoading(false);
            });
                
    }
                
    const renderFooter = (props) => {
        const {bottom: bottomSafeArea} = useSafeAreaInsets();
        return (
            <BottomSheetFooter {...props}
                               style={styles.footerContainer}
                               bottomInset={bottomSafeArea}>


                <LinearGradient
                    colors={['transparent', colors.background,colors.background,colors.background, colors.background, colors.background ]}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.gradientBackground}
                >
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.optimiseButton}
                            mode={'contained'}
                            disabled={!optimise}
                            icon={'car-outline'}
                            onPress={() => optimiseRoute()}>
                            Optimise Route
                        </Button>
                    </View>
                </LinearGradient>
            </BottomSheetFooter>
        );
    }
    const handleDoubleTap = async (event) => {
        Geocoder.init(`${config.googleAPIKey}`);
        const { coordinate } = event.nativeEvent;
        try {
            const addressComponent = await Geocoder.from(coordinate.latitude, coordinate.longitude);
            const address = addressComponent.results[0].formatted_address;
            autocompleteRef.current.clear();
            setMarkerCoords({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
            });
            setIsMarkerVisible(true);
            setDestinations([...destinations, {
                address: address,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                priority: 2,
                depot: false
            }]);
            mapRef.current.animateToRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            }, 1000);
            setTimeout(() => {
                setActivePriorityDestination({
                    address: address,
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    priority: 2,
                    depot: false
                });
                setPriorityModalVisible(true);
            }, 500);
          } catch (error) {
            console.error('Error in reverse geocoding:', error);
          }
      };

    function goToDestination(data, details) { // 'details' is provided when fetchDetails = true
        autocompleteRef.current.clear();
        const newRegion = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        };
        setCurrentRegion(newRegion);
        setMarkerCoords({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        });
        setIsMarkerVisible(true);
        setDestinations([...destinations, {
            address: data.description,
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            priority: 2,
            depot: false
        }]);
            
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => {
            setActivePriorityDestination({
                address: data.description,
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
                priority: 2,
                depot: false
            });
            setPriorityModalVisible(true);
        }, 1000); 
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
                    latitude: lastDest.latitude,
                    longitude: lastDest.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.005
                }
                setCurrentRegion(newRegion);
                mapRef.current.animateToRegion(newRegion, 1000);
            }
        } else {
            setIsMarkerVisible(false);
        }
    }
    const BottomSheetBackground = ({style}) => {
        return (
            <View
                style={[
                    styles.bottomSheet,
                    {backgroundColor: colors.background, elevation: 8},
                    {...style},
                ]}
            />
        );
    };



    
    //Modals attributes
    const [isModalOfDaysVisible, setModalOfDaysVisible] = React.useState(false);
    const [isModalOfTimeVisible, setModalOfTimeVisible] = React.useState(false);
    const [isModalOfDistanceVisible, setModalOfDistanceVisible] = React.useState(false);
    const [isModalOfPreferenceVisible, setModalOfPreferenceVisible] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);
    const toggleModal = () => {
        handleCloseBottomSheet();
        setModalVisible(!modalVisible);
    };
    const toggleModalOfDays = () => {
        setModalVisible(!modalVisible);
        setModalOfDaysVisible(!isModalOfDaysVisible);
    };
    const toggleModalOfTime = () => {
        setModalVisible(!modalVisible);
        setModalOfTimeVisible(!isModalOfTimeVisible);
    };
    const toggleModalOfDistance = () => {
        setModalVisible(!modalVisible);
        setModalOfDistanceVisible(!isModalOfDistanceVisible);
    };
    const toggleModalOfPreference = () => {
        setModalVisible(!modalVisible);
        setModalOfPreferenceVisible(!isModalOfPreferenceVisible);
    };
    const toggleSwitch = (value) => {
        setTolls(value); 
    };

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
        const [checked, setChecked] = React.useState(noTimeLimit);
        const [routeHoursDialog, setRouteHoursDialog] = React.useState(routeMaxTime > 0 ? Math.floor(parseInt(routeMaxTime, 10) / 60).toString() : '8');
        const [routeMinutesDialog, setRouteMinutesDialog] = React.useState(routeMaxTime > 0 ?(parseInt(routeMaxTime, 10) % 60).toString() : '0');
        const [validError, setValidError] = React.useState(false);
        const hideDialogAccept = () => {
            setModalVisible(!modalVisible);
            setModalOfTimeVisible(!isModalOfTimeVisible);
            setVisibleDialog(false);
            if(checked){
                setRouteMaxTime(null);
            }
            else{
                setRouteMaxTime(60*parseInt(routeHoursDialog, 10) + parseInt(routeMinutesDialog, 10));
            }
        }
        const hideDialogCancel = () => {
            setModalVisible(!modalVisible);
            setModalOfTimeVisible(!isModalOfTimeVisible);
            setVisibleDialog(false);
        }
        const checking = () => {
            setChecked(!checked);
            setNoTimeLimit(!checked);
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
                            disabled={checked}
                        />
                        <TextInput
                            style={{ backgroundColor: colors.secondary, marginTop: 16, width: 130  }}
                            label="Minutes"
                            mode="outlined"
                            keyboardType="numeric"
                            value={routeMinutesDialog}
                            onChangeText={routeHoursDialog => setRouteMinutesDialog(routeHoursDialog)}
                            disabled={checked}
                        />
                </View>
                <List.Item 
                    title={'No limit'}
                    left={props => <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={checking}
                    />}
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
    function DistanceDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routeDistanceDialog, setRouteDistanceDialog] = React.useState(routeMaxDistance.toString());
        const [validError, setValidError] = React.useState(false);
        const hideDialogCancel = () => {
            setModalVisible(!modalVisible);
            setModalOfDistanceVisible(!isModalOfDistanceVisible);
            setVisibleDialog(false);
        }
        const hideDialogAccept = () => {
            setModalVisible(!modalVisible);
            setModalOfDistanceVisible(!isModalOfDistanceVisible);
            setVisibleDialog(false);
            setRouteMaxDistance(parseInt(routeDistanceDialog, 10));
        }
        const handleInputChange = (str) => {
            setRouteDistanceDialog(str)
            const validInput = /^[0]{1}$/;
            if (validInput.test(str) || !Number.isInteger(Number(str))) {
                setValidError(true);
            }
            else{
                setValidError(false);
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
                    error={validError}
                    keyboardType="numeric"
                    value={routeDistanceDialog}
                    onChangeText={handleInputChange}
                />

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
    function PreferenceDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [routePreferenceDialog, setRoutePreferenceDialog] = React.useState(savingPreference);
        const hideDialog = () => {
            setModalVisible(!modalVisible);
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


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex: 1}}>
            <MapView style={styles.map}
                             provider={PROVIDER_GOOGLE}
                             ref={mapRef}
                             initialRegion={currentRegion}
                             onLongPress={handleDoubleTap}
                             >
                        {isMarkerVisible ? <Marker coordinate={markerCoords} pinColor={colors.primary}/> : null}
            </MapView>
            
            <View style ={styles.headerContainer}>
                    
                <View style={[styles.searchBarContainer, {backgroundColor: colors.secondary}]}>
                    
                    <GooglePlacesAutocomplete 
                    
                        placeholder='Enter Location'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        ref={autocompleteRef}
                        
                        onPress={(data, details = null) => {
                            goToDestination(data, details)
                        }}
                        renderRightButton={() => <IconButton icon={'magnify'} size={26}
                                                            style={{alignSelf: 'center'}}
                                                            onPress={handleSearchButtonPress}/>}
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

                        query={{
                            key: config.googleAPIKey, language: 'en',
                        }}/>
                </View>
                <FAB icon={'cog-outline'} 
                    size={'medium'} 
                    onPress={toggleModal} 
                    style={[styles.fab, {backgroundColor: colors.secondary}]}>
                </FAB>      
            </View>

            
            
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={bottomSheetSnapPoints}
                footerComponent={renderFooter}
                backgroundComponent={props => <BottomSheetBackground {...props}/>}
            >
                <Divider bold={true}/>

                <BottomSheetScrollView
                    ref={scrollViewRef}
                    style={{marginBottom: 48}}
                >
                    
                    {!destinations.length &&
                    <View style={styles.emptyContent}>
                        <Avatar.Icon size={225} icon="map-marker-plus" color={colors.onSurfaceDisabled} style={{backgroundColor: 'transparent'}}/>
                        <Text style={{color: colors.onSurfaceDisabled, alignSelf: 'center', textAlign: 'center'}}>
                            Add at least three stops and select a depot point to optimize your route
                        </Text>
                    </View>
                    }
                    
                    {destinations.map(dest => (
                        
                        <View key={dest.address}>
                            <List.Item 
                                title={dest.address.split(', ')[0]}
                                description={dest.address.split(', ').slice(1).join(', ')}
                                left={props => <List.Icon {...props} color={colors.primary} icon={'radiobox-marked'}/>}
                                right={() => (dest.depot ? <List.Icon icon="home-circle-outline" color="green" /> : null)}
                                onPress={() => 
                                    {
                                        setActivePriorityDestination(dest);
                                        setPriorityModalVisible(true);
                                    }
                                }
                            />
                            <Divider/>
                        </View>
                    ))
                    }
                    
                </BottomSheetScrollView>
                
            </BottomSheet> 

            {isLoading && 
            <LoadingModal 
                isLoading={isLoading}
            />}
            {warning && 
            <WarningModal 
                warningMessage={warningMess}
                warning={warning}
                setWarning={setWarning}
            />}
            {priorityModalVisible && 
            <PriorityModal 
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
                    isVisible={modalVisible}
                    onBackdropPress={toggleModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}
                >
                    <View style={{ backgroundColor: colors.background}}>
                        <Text style={{padding: 16}}>Your route settings</Text>
                        <Divider/>
                        <List.Item 
                            title='Tolls'
                            right={props =><Switch value={tolls} onValueChange={toggleSwitch}/>}>
                        </List.Item>

                        <List.Item
                            onPress={toggleModalOfDays}
                            title='Number of days'
                            description={`${routeDays} days`}
                            right={props => <IconButton icon={'calendar'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={toggleModalOfTime}
                            title='Time limit per route'
                            description={routeMaxTime > 0 ? (routeMaxTime % 60 === 0 ? `${Math.floor(routeMaxTime/60)} hours` : 
                            `${Math.floor(routeMaxTime/60)} hours ${Math.floor(routeMaxTime % 60)} minutes`) :
                            "No limit"}
                            right={props => <IconButton icon={'timer'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={toggleModalOfDistance}
                            title='Distance limit per route'
                            description={`${routeMaxDistance} km`}
                            right={props => <IconButton icon={'map-marker-distance'} size={26}/>}>
                        </List.Item>
                        <List.Item
                            onPress={toggleModalOfPreference}
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    );
}


const styles = StyleSheet.create({
    searchBarContainer: {
        position: 'absolute',
        zIndex: 3,
        flexDirection: 'row',
        backgroundColor: 'red',
        alignSelf: 'center',
        marginHorizontal: 16,
        marginTop: 36,
        borderRadius: 28,
        elevation: 8,
    }, headerContainer: {
        position: 'absolute',
        zIndex: 0,
        width: '100%',
    }, fab:{
        margin: 16,
        marginTop: 124,
        borderRadius: 50,
        width: 50, 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    }, map: {
        minHeight: '100%',
        minWidth: '100%',
    }, bottomSheet: {
        backgroundColor: 'white',
        borderRadius: 15,
    }, emptyContent: {
        alignItems: 'center',
        margin: 8,
    },
    footerContainer: {
        height: '10%',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optimiseButton: {
        width: '92%',
        justifyContent: 'flex-start'
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    buttonContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
