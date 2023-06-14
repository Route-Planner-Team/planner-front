import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import BottomSheet, {BottomSheetFooter, BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Button, Divider, FAB, IconButton, List, useTheme} from "react-native-paper";
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue} from 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import config from "../config";
import RouteParameters from "../components/RouteParameters";
import PriorityModal from "../components/PriorityModal";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";

const bottomSheetSnapPoints = ['12%', '50%', '90%'];

function HomeScreen({route, navigation}) {

    //bottom sheet attributes
    const bottomSheetRef = React.useRef(null);
    const {colors} = useTheme();
    const animatedPosition = useSharedValue(0);
    const windowHeight = Dimensions.get('window').height;
    const [isAnimatedViewActive, setIsAnimatedViewActive] = React.useState(false);
    const [isPickingDepotAddress, setIsPickingDepotAddress] = React.useState(false);
    const opacity = useDerivedValue(() => {
        const bottomSheetPos = animatedPosition.value / windowHeight;
        if (bottomSheetPos > 0.14 && bottomSheetPos < 0.16) {
            return -50 * bottomSheetPos + 8;
        } else if (bottomSheetPos > 0.16) {
            return 0;
        } else if (bottomSheetPos < 0.14) {
            return 1;
        }
    });
    const animatedBottomSheetStyle = useAnimatedStyle(() => {
        return {
            borderBottomColor: 'white',
            opacity: opacity.value,
        };
    });
    const border = useDerivedValue(() => {
        const bottomSheetPos = animatedPosition.value / windowHeight;
        if (bottomSheetPos > 0.15 && bottomSheetPos < 0.2) {
            return -5 * bottomSheetPos + 1;
        } else if (bottomSheetPos > 0.2) {
            return 0;
        } else if (bottomSheetPos < 0.15) {
            return 0.25;
        }
    });
    const animatedSearchbarStyle = useAnimatedStyle(() => {
        return {
            borderWidth: border.value,
        };
    });
    const handleAnimatedViewInteraction = () => {
        setIsAnimatedViewActive(true);
    };

    const handleAnimatedViewRelease = () => {
        setIsAnimatedViewActive(false);
    };


    //Scroll view attributes
    const scrollViewRef = React.useRef(null);
    const handleScroll = (event) => {
        const {contentOffset} = event.nativeEvent;
        const currentPosition = contentOffset.y;
    };


    const mapRef = React.useRef(null);
    const autocompleteRef = React.useRef(null);
    const [currentRegion, setCurrentRegion] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788, latitudeDelta: 0.01, longitudeDelta: 0.005
    });
    const [markerCoords, setMarkerCoords] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788
    });
    const [destinations, setDestinations] = React.useState([]);
    const [depot, setDepot] = React.useState({address: 'Depot address...'});
    const [isOpen, setIsOpen] = React.useState(true);
    const [isMarkerVisible, setIsMarkerVisible] = React.useState(false);
    const [tolls, setTolls] = React.useState(false);
    const [savingPreference, setSavingPreference] = React.useState('distance');
    const [routeDays, setRouteDays] = React.useState(1);
    const [routeMaxTime, setRouteMaxTime] = React.useState(480); // in minutes
    const [routeMaxDistance, setRouteMaxDistance] = React.useState(200); // in kilometers
    const [showParamScreen, setShowParamScreen] = React.useState(false);
    const [priorityModalVisible, setPriorityModalVisible] = React.useState(false);
    const [activePriorityDestination, setActivePriorityDestination] = React.useState();

    function handleSearchButtonPress() {
        if (!autocompleteRef.current.isFocused()) autocompleteRef.current.focus();
    }

    const optimiseRoute = async () => {
        await fetch(`${config.apiURL}/routes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${route.params.data.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    depot_address: depot.address,
                    addresses: destinations.map(x => x.address),
                    priorities: destinations.map(x => x.priority),
                    days: routeDays,
                    distance_limit: routeMaxDistance,
                    duration_limit: routeMaxTime,
                    preferences: savingPreference,
                    avoid_tolls: tolls
                }),
            }).then(res => navigation.navigate('Route'))
            .catch(err => console.log(err));

    }

    const renderFooter = (props) => {
        const {bottom: bottomSafeArea} = useSafeAreaInsets();
        return (
            <BottomSheetFooter {...props}
                               style={styles.footerContainer}
                               bottomInset={bottomSafeArea}>


                <LinearGradient
                    colors={['transparent', 'white']}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.gradientBackground}
                >
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.optimiseButton}
                            mode={'contained'}
                            icon={'car-outline'}
                            onPress={() => optimiseRoute()}>
                            Optimise Route
                        </Button>
                    </View>
                </LinearGradient>
            </BottomSheetFooter>
        );
    }

    function goToDestination(data, details) {// 'details' is provided when fetchDetails = true
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
        if (isPickingDepotAddress) {
            setDepot({
                address: data.description,
                latitude: newRegion.latitude,
                longitude: newRegion.longitude
            });
        } else {
            setDestinations([...destinations, {
                address: data.description,
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
                priority: 1
            }]);
        }
        setIsPickingDepotAddress(false);
        mapRef.current.animateToRegion(newRegion, 1000);
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
                    {...style},
                ]}
            />
        );
    };


    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={-310}>
                <SafeAreaView style={styles.container}>
                    <Animated.View style={[styles.searchBarContainer, animatedSearchbarStyle]}
                                   onTouchStart={handleAnimatedViewInteraction}
                                   onTouchEnd={handleAnimatedViewRelease}
                    >
                        <GooglePlacesAutocomplete placeholder='Enter Location'
                                                  minLength={2}
                                                  autoFocus={false}
                                                  returnKeyType={'default'}
                                                  fetchDetails={true}
                                                  ref={autocompleteRef}
                                                  onPress={(data, details = null) => {
                                                      goToDestination(data, details)
                                                  }}
                                                  onTouchStart={() => setIsAnimatedViewActive(false)}
                                                  onTouchEnd={() => setIsAnimatedViewActive(true)}
                                                  listViewDisplayed={isAnimatedViewActive ? false : true}
                                                  renderRightButton={() => <IconButton icon={'magnify'} size={26}
                                                                                       style={{alignSelf: 'center'}}
                                                                                       onPress={handleSearchButtonPress}/>}
                                                  renderLeftButton={() => <IconButton icon={'menu'} size={26}
                                                                                      style={{alignSelf: 'center'}}
                                                                                      onPress={() => navigation.openDrawer()}/>}
                                                  styles={{
                                                      textInputContainer: {
                                                          display: 'flex',
                                                          flexDirection: 'row',
                                                          alignSelf: 'center',
                                                          width: '100%',
                                                          height: 28
                                                      }, textInput: {
                                                          backgroundColor: '#FFFBFE',
                                                          height: 28,
                                                          fontSize: 16,
                                                          lineHeight: 20,
                                                          letterSpacing: 0.5,
                                                      }, predefinedPlacesDescription: {
                                                          color: '#1faadb',
                                                      }, poweredContainer: {
                                                          backgroundColor: '#FFFBFE'
                                                      }, row: {
                                                          backgroundColor: '#FFFBFE'
                                                      }


                                                  }}
                                                  query={{
                                                      key: config.googleAPIKey, language: 'en',
                                                  }}/>
                    </Animated.View>
                    <MapView style={styles.map}
                             provider={PROVIDER_GOOGLE}
                             ref={mapRef}
                             initialRegion={currentRegion}>
                        {isMarkerVisible ? <Marker coordinate={markerCoords} pinColor={colors.primary}/> : null}
                    </MapView>
                    {priorityModalVisible && <PriorityModal priorityModalVisible={priorityModalVisible}
                                                            setPriorityModalVisible={setPriorityModalVisible}
                                                            activeDestination={activePriorityDestination}
                                                            destinations={destinations}
                                                            setDestinations={setDestinations}/>}
                    {!showParamScreen &&
                        <FAB icon={'cog-outline'} size={'medium'} onPress={() => setShowParamScreen(true)} style={{
                            position: 'absolute',
                            borderRadius: 46,
                            right: 20,
                            top: '15%',
                            backgroundColor: 'white'
                        }}>

                        </FAB>}
                    {/*showParamScreen && <View style={{width: '100%', height: '100%', backgroundColor:'rgba(0,0,0,0.25)'}}/>*/}
                    {showParamScreen &&
                        <RouteParameters setTolls={setTolls} setSavingPreference={setSavingPreference} tolls={tolls}
                                         savingPreference={savingPreference} routeDays={routeDays}
                                         setRouteDays={setRouteDays} showParamScreen={showParamScreen}
                                         setShowParamScreen={setShowParamScreen} routeMaxDistance={routeMaxDistance}
                                         setRouteMaxDistance={setRouteMaxDistance} routMaxTime={routeMaxTime}
                                         setRouteMaxTime={setRouteMaxTime}/>}
                    {!showParamScreen &&
                        <Animated.View style={[styles.rectangle, {position: 'absolute'}, animatedBottomSheetStyle]}/>}
                    {!showParamScreen && <BottomSheet
                        ref={bottomSheetRef}
                        animatedPosition={animatedPosition}
                        snapPoints={bottomSheetSnapPoints}
                        onClose={() => setIsOpen(false)}
                        footerComponent={renderFooter}
                        backgroundComponent={props => <BottomSheetBackground {...props}/>}
                    >
                        <BottomSheetView style={{paddingTop: 25}}>
                            <List.Item style={{paddingTop: 10, backgroundColor: colors.secondary}}
                                       title={depot.address}
                                       titleStyle={{color: '#79747E'}}
                                       onPress={() => {
                                           setIsPickingDepotAddress(true);
                                           autocompleteRef.current.focus();
                                       }}
                                       left={props => <List.Icon {...props} color={colors.primary}
                                                                 icon={'home-city-outline'}/>}
                                       right={props => <Button
                                           onPress={() => {
                                               setIsPickingDepotAddress(true);
                                               autocompleteRef.current.focus();
                                           }}>
                                           <Icon {...props}
                                                 style={{fontSize: 24, lineHeight: 24}}
                                                 name={'pencil-outline'}/>
                                       </Button>}>
                            </List.Item>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    height: 1,
                                }}
                            >
                                <Divider style={{width: '100%', borderWidth: 1, borderColor: '#CAC4D0'}}/>
                            </View>
                        </BottomSheetView>
                        <BottomSheetScrollView ref={scrollViewRef} onScroll={handleScroll}>
                            {destinations.map(dest => (<List.Item style={{paddingTop: 20}}
                                                                  title={dest.address}
                                                                  key={dest.address}
                                                                  left={props => <List.Icon {...props}
                                                                                            color={colors.primary}
                                                                                            icon={'radiobox-marked'}/>}
                                                                  right={props => <View
                                                                      style={{display: 'flex', flexDirection: 'row'}}>
                                                                      <Button
                                                                          style={{width: 30, marginRight: 10}}
                                                                          onPress={() => {
                                                                              setActivePriorityDestination(dest);
                                                                              setPriorityModalVisible(true);
                                                                          }}>
                                                                          <Icon {...props}
                                                                                style={{
                                                                                    width: 30,
                                                                                    fontSize: 24,
                                                                                    lineHeight: 24
                                                                                }}
                                                                                name={'pencil-outline'}/>
                                                                      </Button>
                                                                      <Button
                                                                          onPress={() => deleteDestination(dest)}
                                                                          style={{width: 30}}>
                                                                          <Icon {...props}
                                                                                style={{
                                                                                    width: 30,
                                                                                    fontSize: 24,
                                                                                    lineHeight: 24
                                                                                }}
                                                                                name={'delete-outline'}/>
                                                                      </Button>
                                                                  </View>}>
                            </List.Item>))}
                        </BottomSheetScrollView>
                    </BottomSheet>}
                    <StatusBar style="auto"/>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
    }, searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: '6%',
        zIndex: 3,
        padding: 10,
        backgroundColor: '#FFFBFE',
        width: '92%',
        minHeight: 56,
        borderRadius: 28,
    }, map: {
        width: '100%',
        height: '100%'
    }, bottomSheet: {
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.57,
        shadowRadius: 15.19,
        shadowOffset: {
            width: 0,
            height: 12,
        },
    },
    destinationListItem: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        isolation: 'isolate',
        width: 360,
        height: 72,
        flex: 0,
        alignSelf: 'stretch',
        flexGrow: 0
    },
    rectangle: {
        width: '100%',
        height: '17%',
        backgroundColor: 'white',
        zIndex: 2,
        borderWidth: 0.25,
    },
    footerContainer: {
        height: '10%',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optimiseButton: {
        width: '92%',
        height: 40,
        justifyContent: 'flex-start'

    }, optimiseButtonContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
