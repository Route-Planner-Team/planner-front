import React from 'react';
import {
    Animated,
    Dimensions, Image,
    Keyboard,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    Divider,
    IconButton,
    List,
    Portal,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RouteCustomFooter from "../components/RouteCustomFooter";
import polyline from '@mapbox/polyline';
import Modal from "react-native-modal";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import config from "../config";

const mapStyle = [
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

function RouteScreen({ route, initialRegion, setRefresh, refresh, data, setPlaces }) {
    const { email, expires_in, access_token, refresh_token } = data;
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [depotPoint, setDepotPoint] = React.useState();
    const [currentRegion, setCurrentRegion] = React.useState(null);
    const [destinations, setDestinations] = React.useState([]);
    const [fuel, setFuel] = React.useState();
    const [duration, setDuration] = React.useState();
    const [distance, setDistance] = React.useState();
    const [name, setName] = React.useState();
    const [numberOfRoutes, setNumberOfRoutes] = React.useState(1);
    const [waypoints, setWaypoints] = React.useState([]);
    const [day, setDay] = React.useState(0);
    const [selectedChipIndex, setSelectedChipIndex] = React.useState(0);
    const [routeID, setRouteID] = React.useState('0');
    const [destinationList, setDestinationList] = React.useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const toggleDeleteModal = () => {
        setDeleteModalVisible(!deleteModalVisible);
        toggleEditModal();
    };


    React.useEffect(() => {

        const response = route.params.activeRoute;
        try {
            const polylineData = response.subRoutes[day].polyline;
            const decodedCoordinates = polyline.decode(polylineData);
            const updatedWaypoints = decodedCoordinates.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDepotPoint(response.subRoutes[day].coords[0])
            setDestinations(response.subRoutes[day].coords)
            setFuel(response.subRoutes[day].fuel_liters)
            setDuration(response.subRoutes[day].duration_hours)
            setDistance(response.subRoutes[day].distance_km)
            setCurrentRegion(
                {latitude: response.subRoutes[day].coords[0].latitude,
                longitude: response.subRoutes[day].coords[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.1});
            setWaypoints(updatedWaypoints);
            setRouteID(response.routes_id)
            setDestinationList({
                name: response.subRoutes[day].coords.map(x => x.name),
                visited: response.subRoutes[day].coords.map(x => x.visited),
                routeid: response.routes_id,
                day: day
            })
            mapRef.current.animateToRegion(
                {latitude: response.subRoutes[day].coords[0].latitude,
                    longitude: response.subRoutes[day].coords[0].longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.1},
                1000
            )
        } catch (e) {
            const polylineData = response.subRoutes[0].polyline;
            const decodedCoordinates = polyline.decode(polylineData);
            const updatedWaypoints = decodedCoordinates.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDestinations(response.subRoutes[0].coords)
            setFuel(response.subRoutes[0].fuel_liters)
            setDuration(response.subRoutes[0].duration_hours)
            setDistance(response.subRoutes[0].distance_km)
            setWaypoints(updatedWaypoints);
            setSelectedChipIndex(0);
            setRouteID(response.routes_id)
            setDepotPoint(response.subRoutes[0].coords[0])
            setDestinationList({
                name: response.subRoutes[0].coords.map(x => x.name),
                visited: response.subRoutes[0].coords.map(x => x.visited),
                routeid: response.routes_id,
                day: 0
            })
        }
        setNumberOfRoutes(response.days)
        setName(response.name)


    }, [route.params.activeRoute, day]); // This effect will run whenever activeRoute changes

    useFocusEffect(
      React.useCallback(() => {
        setRefresh(!refresh)
      }, [ ])
    );


    //map attributes
    const mapRef = React.useRef(null);
    const [mapInUse, setMapInUse] = React.useState(false);
    const changeRoute = (index) => {
        setDay(index);
    };


    //bottom sheet attributes
    const bottomSheetRef = React.useRef(null);
    const bottomSheetSnapPoints = ['12%', '55%', '85%'];
    const scrollViewRef = React.useRef(null);
    const handleChipPress = (index) => {
        setSelectedChipIndex(index);
        changeRoute(index);
    };
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

    const renameRoute = async (newName) => {
        await fetch(`${config.apiURL}/routes/rename`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    routes_id: routeID,
                    name: newName,
                }),
            }).then(response => response.json())
            .then(data => {
                console.log(data)
                setName(data.name)
                setRefresh(!refresh)
            })
    }


    //Modals attributes
    const [modalVisible, setModalVisible] = React.useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    function ModalComponent() {
        return (
            <View>
                <TouchableOpacity onPress={toggleModal}>
                    <Text>Open Modal</Text>
                </TouchableOpacity>
                <Modal
                    statusBarTranslucent
                    isVisible={modalVisible}
                    onBackdropPress={toggleModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}
                >
                    <View style={{backgroundColor: 'white', padding: 16}}>
                        <Text>Route properties</Text>
                        <List.Item
                            title={`${Math.round(fuel * 100) / 100} liters`}
                            left={props => <IconButton icon={'fuel'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`${Math.round(duration * 100) / 100} hours`}
                            left={props => <IconButton icon={'timer'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`${Math.round(distance * 100) / 100} kilometers`}
                            left={props => <IconButton icon={'map-marker-distance'} size={26}/>}
                        >
                        </List.Item>
                    </View>
                </Modal>
            </View>
        );
    }

    const [isModalOfNameVisible, setModalOfNameVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const toggleEditModal = () => {
        setEditModalVisible(!editModalVisible);
    };
    const toggleModalOfName = () => {
        setEditModalVisible(!editModalVisible);
        setModalOfNameVisible(!isModalOfNameVisible);
    };
    const moveToRegenerate = () => {
        setEditModalVisible(!editModalVisible);
        console.log(routeID)
        navigation.navigate('Regenerate', {data, routeID, setPlaces});
    };

    const deleteRoute = async () => {
        try {
            const response = await fetch(`${config.apiURL}/routes?routes_id=` + routeID, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setRefresh(!refresh)
            navigation.navigate('Home')
        } catch (error) {
            console.error(error);
        }
    };


    function EditModalComponent() {
        return (
            <View>
                <TouchableOpacity onPress={toggleEditModal}>
                    <Text>Open Modal</Text>
                </TouchableOpacity>
                <Modal
                    statusBarTranslucent
                    isVisible={editModalVisible}
                    onBackdropPress={toggleEditModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}
                >
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={{padding: 16}}>Edit route</Text>
                        <List.Item
                            title={`Rename`}
                            description={`${name}`}
                            onPress={toggleModalOfName}
                            left={props => <IconButton icon={'pencil-circle-outline'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`Regenrate`}
                            description={`Use unvisted destinations and recreate your route`}
                            left={props => <IconButton icon={'refresh'} size={26}/>}
                            onPress={moveToRegenerate}
                        >
                        </List.Item>
                        <List.Item
                            title={`Delete route`}
                            description={'Delete this route'}
                            left={props => <IconButton icon={'trash-can-outline'} size={26}/>}
                            onPress={toggleDeleteModal}
                        >
                        </List.Item>
                    </View>
                </Modal>
            </View>
        );
    }

    function DeleteDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            setVisibleDialog(false);
            setDeleteModalVisible(false);
            deleteRoute();
        }
        const hideDialogCancel = () => {
            setVisibleDialog(false);
            setDeleteModalVisible(false);
        }
        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 12
                    }}>
                        <Dialog.Title>
                            Confirm deletion
                        </Dialog.Title>
                        <IconButton icon={'delete-outline'} size={26}/>
                    </View>
                    <Divider/>
                    <Dialog.Content style={{padding: 16}}>
                        <Text>Are you sure you want permanently remove this route?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialogCancel}>No</Button>
                        <Button onPress={hideDialogAccept}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }

    function NameDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [nameDialog, setNameDialog] = React.useState(name.toString());
        const [validError, setValidError] = React.useState(false);
        const hideDialogCancel = () => {
            setEditModalVisible(!editModalVisible);
            setModalOfNameVisible(!isModalOfNameVisible);
            setVisibleDialog(false);
        }
        const hideDialogAccept = () => {
            setEditModalVisible(!editModalVisible);
            setModalOfNameVisible(!isModalOfNameVisible);
            setVisibleDialog(false);
            renameRoute(nameDialog);
        }
        const handleInputChange = (str) => {
            setNameDialog(str)
        };
        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;
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
                <Animated.View style={{height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{flex: 1}}>
                                Rename
                            </Dialog.Title>
                            <IconButton icon={'rename-box'} size={26}/>
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{backgroundColor: colors.secondary, marginTop: 16}}
                                label="New name"
                                mode="outlined"
                                value={nameDialog}
                                onChangeText={handleInputChange}
                                maxLength={20}
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


    return (
        <SafeAreaView style={styles.container}>
            <MapView style={styles.map}
                     showsCompass={false}
                     customMapStyle={mapStyle}
                     provider={PROVIDER_GOOGLE}
                     ref={mapRef}
                     initialRegion={currentRegion || initialRegion}
                     onMapReady={() => setMapInUse(true)}
                     onRegionChange={() => setMapInUse(true)}
                     onRegionChangeComplete={() => setMapInUse(false)}>
                <Polyline
                    coordinates={waypoints}
                    strokeColor={colors.primary}
                    strokeWidth={3}
                />
                {destinations.map((destinations, index) => (
                    <Marker
                        key={index}
                        coordinate={destinations}
                        pinColor={colors.primary}
                        style={{width: 100, height:100}}
                    >
                        <Image source={{uri:`https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${index}|6750A4|000000`}} style={{width:21, height:34}}></Image>
                    </Marker>
                ))}
            </MapView>


            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={bottomSheetSnapPoints}
                onClose={() => setIsOpen(false)}
                footerComponent={(props) => (
                    <RouteCustomFooter {...props} list={destinationList} routeid={routeID} routeday={day}
                                       access_token={route.params.access_token}/>
                )}
                backgroundComponent={props => <BottomSheetBackground {...props}/>}>
                <View style={styles.bottomsheetHeaderContainer}>
                    <Text variant="headlineSmall" style={{alignSelf: 'center'}}>{name}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <IconButton
                            icon="clipboard-edit-outline"
                            size={27}
                            onPress={toggleEditModal}
                        />
                        <IconButton
                            icon="information-outline"
                            size={27}
                            onPress={toggleModal}
                        />
                    </View>
                </View>

                <View style={styles.chipsContainer}>
                    {Array.from({length: numberOfRoutes}, (_, index) => (
                        <Chip
                            key={index}
                            style={
                                selectedChipIndex === index ?
                                    {backgroundColor: colors.onSurfaceVariant} :
                                    {backgroundColor: colors.secondary}
                            }
                            textStyle={{color: selectedChipIndex === index ? 'white' : 'black'}}
                            compact={true}
                            onPress={() => handleChipPress(index)}>
                            Day {index + 1}
                        </Chip>
                    ))}
                </View>
                <Divider bold={true}/>
                <BottomSheetScrollView
                    ref={scrollViewRef}
                    style={{marginBottom: 48}}
                >

                    {destinations.map((destination, index) => (
                        <View key={index}>
                            <List.Item
                                title={destination.name.split(', ')[0].length > 1 ? destination.name.split(', ')[0] : destination.name.split(', ')[1]}
                                description={destination.name.split(', ').slice(1).join(', ')}
                                right={() => (index === 0 || index === destinations.length - 1 ?
                                    <List.Icon icon="home-circle-outline" color="green"/> : null)}
                                left={props => <Avatar.Text size={46} label={index + 1} color={colors.tertiary} style={{
                                    backgroundColor: colors.tertiaryContainer,
                                    marginLeft: '5%',
                                }}/>}
                                onPress={() => {
                                    mapRef.current.animateToRegion(
                                        {
                                            latitude: destination.latitude,
                                            longitude: destination.longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01
                                        },
                                        1000
                                    )
                                }}
                            >
                            </List.Item>
                            <Divider/>
                        </View>
                    ))}
                </BottomSheetScrollView>
            </BottomSheet>
            <StatusBar style="auto"/>

            <ModalComponent/>
            <EditModalComponent/>
            {isModalOfNameVisible && <NameDialog/>}
            {deleteModalVisible && <DeleteDialog/>}

        </SafeAreaView>


    );
};


const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            width: '100%',
            height: '100%'
        },
        bottomsheetHeaderContainer: {
            marginLeft: 16,
            marginVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        chipsContainer: {
            gap: 8,
            marginLeft: 16,
            marginBottom: 8,
            flexDirection: 'row',
        },
        fab: {
            width: 50,
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
        },
        menu: {
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FFFBFE',
            width: 56,
            minHeight: 56,
            borderRadius: 28,
        },
        info: {
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FFFBFE',
            width: 56,
            minHeight: 56,
            borderRadius: 28,
            marginHorizontal: 5,
        },
        rectangle: {
            width: '100%',
            height: '15%',
            backgroundColor: 'white',
            zIndex: 2,
        },
        bottomSheet: {
            backgroundColor: 'white',
            borderRadius: 15,
        }
    }
);

export default RouteScreen;
