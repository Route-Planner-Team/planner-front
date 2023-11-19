import React, {useCallback, useRef} from 'react';
import {Avatar, Chip, Divider, IconButton, List, Switch, Text, useTheme} from 'react-native-paper'
import {Map} from "../components/Map";
import {GoogleMapsWrapper} from "../components/GoogleMapsWrapper";
import {ScrollView, StyleSheet, View} from "react-native-web";
import polyline from "@mapbox/polyline";
import {TouchableOpacity} from "react-native";
import Modal from "react-native-modal";
import {useNavigation} from '@react-navigation/native';

function RouteScreen({route}) {


    const {colors} = useTheme();
    const navigation = useNavigation();
    const mapRef = React.useRef(null);

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

        // this logic has to be rebuilt!
        // routes array has to be implemented on API level
        const routeEntriesCount = Object.keys(response).length - 10;
        setNumberOfRoutes(routeEntriesCount)

        if (day >= routeEntriesCount)
        {
            setDay(0);
            currentDay = 0;
        }

        try {
            polylineData = response[currentDay].polyline;
            decodedPolyline = polyline.decode(polylineData);
            const updatedWaypoints = decodedPolyline.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDestinations(response[currentDay].coords)
            setFuel(response[currentDay].fuel_liters)
            setDuration(response[currentDay].duration_hours)
            setDistance(response[currentDay].distance_km)
            setWaypoints(updatedWaypoints);
            setRouteID(response.routes_id);
        } catch (error) {
            polylineData = response[0].polyline;
            decodedPolyline = polyline.decode(polylineData);
            const updatedWaypoints = decodedPolyline.map((point) => ({
                latitude: point[0],
                longitude: point[1],
            }));
            setDestinations(response[0].coords)
            setFuel(response[0].fuel_liters)
            setDuration(response[0].duration_hours)
            setDistance(response[0].distance_km)
            setWaypoints(updatedWaypoints);
            setSelectedChipIndex(0);
        }
        setName(response.generation_date)

        setDestinationList({name: response[currentDay].coords.map(x => x.name),
            visited: response[currentDay].coords.map(x => x.visited)})

        setPolylineCoords(decodedPolyline.map(x => {return {lat: x[0], lng: x[1]}}));
        setDestinationMarkerCoords(destinations.map(d => {return {lat: d.latitude, lng: d.longitude}}));

        if (!mapRef.current)
        {
            setMapRefForceRefresh(!mapRefForceRefresh);
        }

    }, [route.params.activeRoute, day, destinations, mapRefForceRefresh]); // This effect will run whenever ac

    React.useLayoutEffect( () => {
        mapRef.current?.drawPolyline(polylineCoords);
        mapRef.current?.drawDestinationMarkers(destinationMarkerCoords);
    }, [polylineCoords, destinationMarkerCoords, mapRefForceRefresh]);

    const toggleRouteParametersModal = () => {
        setRouteParametersModalVisible(!routeParametersModalVisible);
    };

    function RouteParametersModal() {
        return (
            <View>
                <Modal
                    statusBarTranslucent
                    isVisible={routeParametersModalVisible}
                    onBackdropPress={toggleRouteParametersModal}
                    style={{
                        alignItems: 'center'
                    }}
                >
                    <View style={{ backgroundColor: 'white', padding: 16, width: 600, borderRadius: 28 }}>
                        <Text>Route properties</Text>
                        <List.Item
                            title={`${Math.round(fuel* 100)/100} liters`}
                            left={props => <IconButton icon={'fuel'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`${Math.round(duration* 100)/100} hours`}
                            left={props => <IconButton icon={'timer'} size={26}/>}
                        >
                        </List.Item>
                        <List.Item
                            title={`${Math.round(distance* 100)/100} kilometers`}
                            left={props => <IconButton icon={'map-marker-distance'} size={26}/>}
                        >
                        </List.Item>
                    </View>
                </Modal>
            </View>
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
                        icon="information-outline"
                        size={27}
                        style={{flex: 1}}
                        onPress={toggleRouteParametersModal}
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
                                    <List.Icon icon="home-circle-outline" color="green" /> : null)}
                                left={props =><Avatar.Text size={46} label={index+1} color={colors.tertiary} style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
                            >
                            </List.Item>
                            <Divider/>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <RouteParametersModal/>
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
            width: '400',
            height: '675px',
            borderRadius: 28,
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 10
        },
        chipsContainer: {
            gap: 2,
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
        }
    }
);

export default RouteScreen;
