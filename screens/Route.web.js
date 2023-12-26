import React from 'react';
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
import {Map} from "../components/Map";
import {GoogleMapsWrapper} from "../components/GoogleMapsWrapper";
import {ScrollView, StyleSheet, View} from "react-native-web";
import polyline from "@mapbox/polyline";
import {TouchableOpacity} from "react-native";
import Modal from "react-native-modal";
import {useNavigation} from '@react-navigation/native';
import config from "../config";

function RouteScreen({route, setRefresh, refresh}) {


    const {colors} = useTheme();
    const navigation = useNavigation();
    const mapRef = React.useRef(null);
    const access_token = route.params.access_token;

    // refs don't work well with useEffect(), so a re-render has to be forced when mapRef is null
    const [mapRefForceRefresh, setMapRefForceRefresh] = React.useState(false);

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
    const [polylineCoords, setPolylineCoords] = React.useState([]);
    const [destinationMarkerCoords, setDestinationMarkerCoords] = React.useState([]);

    const [routeParametersModalVisible, setRouteParametersModalVisible] = React.useState(false);

    const scrollViewRef = React.useRef(null);


    const handleChipPress = (index) => {
        setSelectedChipIndex(index);
        setDay(index);
    };

    React.useEffect(() => {
        const response = route.params.activeRoute;
        let polylineData = null;
        let decodedPolyline = null;
        let currentDay = day;

        const routeEntriesCount = response.subRoutes.length
        setNumberOfRoutes(routeEntriesCount)


        if (day >= routeEntriesCount) {
            setDay(0);
            setSelectedChipIndex(0);
            currentDay = 0;
        }

        try {
            polylineData = response.subRoutes[currentDay].polyline;
            decodedPolyline = polyline.decode(polylineData);
            const updatedWaypoints = decodedPolyline.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDestinations(response.subRoutes[currentDay].coords)
            setFuel(response.subRoutes[currentDay].fuel_liters)
            setDuration(response.subRoutes[currentDay].duration_hours)
            setDistance(response.subRoutes[currentDay].distance_km)
            setWaypoints(updatedWaypoints);
            setRouteID(response.routes_id);
        } catch (error) {
            polylineData = response.subRoutes[0].polyline;
            decodedPolyline = polyline.decode(polylineData);
            const updatedWaypoints = decodedPolyline.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDestinations(response.subRoutes[0].coords)
            setFuel(response.subRoutes[0].fuel_liters)
            setDuration(response.subRoutes[0].duration_hours)
            setDistance(response.subRoutes[0].distance_km)
            setWaypoints(updatedWaypoints);
            setSelectedChipIndex(0);
        }
        setName(response.name)

        setDestinationList({
            name: response.subRoutes[currentDay].coords.map(x => x.name),
            visited: response.subRoutes[currentDay].coords.map(x => x.visited)
        })

        setPolylineCoords(decodedPolyline.map(x => {
            return {lat: x[0], lng: x[1]}
        }));
        setDestinationMarkerCoords(destinations.map(d => {
            return {lat: d.latitude, lng: d.longitude}
        }));

        if (!mapRef.current) {
            setMapRefForceRefresh(!mapRefForceRefresh);
        }

    }, [route.params.activeRoute, day, destinations, mapRefForceRefresh]); // This effect will run whenever ac

    React.useLayoutEffect(() => {
        mapRef.current?.drawPolyline(polylineCoords);
        mapRef.current?.drawDestinationMarkers(destinationMarkerCoords);
    }, [polylineCoords, destinationMarkerCoords, mapRefForceRefresh]);

    const toggleRouteParametersModal = () => {
        setRouteParametersModalVisible(!routeParametersModalVisible);
    };

    const [isModalOfNameVisible, setModalOfNameVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const toggleModalOfName = () => {
        setEditModalVisible(!editModalVisible);
        setModalOfNameVisible(!isModalOfNameVisible);
    };
    const moveToRegenerate = () => {
        setEditModalVisible(!editModalVisible);
        console.log(routeID)
        navigation.navigate('Regenerate', {access_token, routeID});
    };
    const toggleEditModal = () => {
        setEditModalVisible(!editModalVisible);
    };

    function EditModalComponent() {
        return (
            <View>
                <Modal
                    statusBarTranslucent
                    isVisible={editModalVisible}
                    onBackdropPress={toggleEditModal}
                >
                    <View style={{backgroundColor: 'white', borderRadius: 28, width: 600, alignSelf: 'center'}}>
                        <Text style={{padding: 16}}>Edit route</Text>
                        <List.Item
                            title={`Rename`}
                            description={`${name}`}
                            onPress={toggleModalOfName}
                            left={props => <IconButton icon={'pencil-circle-outline'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`Regenerate`}
                            description={`Use unvisted destinations and recreate your route`}
                            left={props => <IconButton icon={'refresh'} size={26}/>}
                            onPress={moveToRegenerate}
                        >
                        </List.Item>
                    </View>
                </Modal>
            </View>
        );
    }

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

    function NameDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const [nameDialog, setNameDialog] = React.useState(name);
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

        return (
            <Portal>
                <Dialog style={{alignSelf:'center', width: 600, borderRadius: 28}} visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
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
            </Portal>
        );

    }

    return (
        <GoogleMapsWrapper>
            <Map ref={mapRef}></Map>
            <View style={[styles.navigationContainer, {background: colors.background}]}>
                <View style={styles.headerContainer}>
                    <IconButton icon={'menu'} size={26}
                                style={{flex: 1}}
                                onPress={() => navigation.openDrawer()}/>
                    <Text variant="headlineSmall" style={{flex: 4}}>{name}</Text>
                    <IconButton
                        icon="clipboard-edit-outline"
                        size={27}
                        onPress={toggleEditModal}
                    />
                </View>
                <Divider bold={true}/>
                <View style={styles.chipsContainer} horizontal={true}>
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
                <ScrollView
                    ref={scrollViewRef}
                    style={{width: '100%'}}
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
                            >
                            </List.Item>
                            <Divider/>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.propertiesContainer}>
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
            </View>
            <EditModalComponent/>
            {isModalOfNameVisible && <NameDialog/>}
        </GoogleMapsWrapper>
    )
        ;
};


const styles = StyleSheet.create({
        map: {},
        navigationContainer: {
            top: '20px',
            left: '5px',
            position: 'absolute',
            width: '400px',
            height: '675px',
            borderRadius: 28,
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 20,
            gap: 10
        },
        chipsContainer: {
            gap: 5,
            flexDirection: 'row',
            width: '375px',
            height: '50px'
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
        },
        destinationListContainer: {
            alignItems: 'center'
        },
    }
);

export default RouteScreen;
