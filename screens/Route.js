import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import {useTheme, Chip, List, Avatar, IconButton, Button, Menu, Divider , Text} from 'react-native-paper'
import BottomSheet, {BottomSheetView, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RouteCustomFooter from "../components/RouteCustomFooter";
import polyline from '@mapbox/polyline';
import Modal from "react-native-modal";

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

function RouteScreen({ route }) {
    const { colors } = useTheme();
    const [depotPoint, setDepotPoint] = React.useState();
    const [currentRegion, setCurrentRegion] = React.useState({latitude: 52.4, longitude: 16.92, latitudeDelta: 0.01, longitudeDelta: 0.1});
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

    React.useEffect(() => {
      const response = route.params.activeRoute;
      try{
        const polylineData = response[day].polyline;
        const decodedCoordinates = polyline.decode(polylineData);
        const updatedWaypoints = decodedCoordinates.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setDepotPoint(response[day].coords[0])
        setDestinations(response[day].coords)
        setFuel(response[day].fuel_liters)
        setDuration(response[day].duration_hours)
        setDistance(response[day].distance_km)
        setWaypoints(updatedWaypoints);
        setRouteID(response.routes_id)
        setDestinationList({name: response[day].coords.map(x => x.name),
          visited: response[day].coords.map(x => x.visited)})
      }
      catch(e){
        const polylineData = response[0].polyline;
        const decodedCoordinates = polyline.decode(polylineData);
        const updatedWaypoints = decodedCoordinates.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setDestinations(response[0].coords)
        setFuel(response[0].fuel_liters)
        setDuration(response[0].duration_hours)
        setDistance(response[0].distance_km)
        setWaypoints(updatedWaypoints);
        setSelectedChipIndex(0);
        setDepotPoint(response[0].coords[0])
        setDestinationList({name: response[0].coords.map(x => x.name),
          visited: response[0].coords.map(x => x.visited)})
      }
      setName(response.generation_date)
      setNumberOfRoutes(Object.keys(response).length - 10)
    }, [route.params.activeRoute, day]); // This effect will run whenever activeRoute changes
    
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


  //Modal attributes
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
        <View style={{ backgroundColor: 'white', padding: 16 }}>
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
        <SafeAreaView style={styles.container}>
            <MapView style={styles.map}
                    showsCompass={false}
                    customMapStyle={mapStyle}
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    initialRegion={currentRegion}
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
                      />
                      ))}
            </MapView>
            
            

            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={bottomSheetSnapPoints}
              onClose={() => setIsOpen(false)}
              footerComponent={(props) => (
                <RouteCustomFooter {...props} list={destinationList} routeid={routeID} routeday={day} access_token={route.params.access_token}/>
              )}
              backgroundComponent={props => <BottomSheetBackground {...props}/>}>
              <View style={styles.bottomsheetHeaderContainer}>
                <Text variant="headlineSmall" style={{alignSelf: 'center'}}>{name}</Text>
                <IconButton
                  icon="information-outline"
                  size={27}
                  style={{alignSelf: 'flex-end'}}
                  onPress={toggleModal}
                />
              </View>

              <View style={styles.chipsContainer}>
                {Array.from({ length: numberOfRoutes }, (_, index) => (
                  <Chip
                    key={index}
                    style={
                      selectedChipIndex === index ? 
                      {backgroundColor: colors.onSurfaceVariant} : 
                      {backgroundColor: colors.secondary}
                    }
                    textStyle={{ color: selectedChipIndex === index ? 'white' : 'black' }}
                    compact={true} 
                    onPress={() => handleChipPress(index)}>
                      Day {index+1}
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
                                          <List.Icon icon="home-circle-outline" color="green" /> : null)}
                            left={props =><Avatar.Text size={46} label={index+1} color={colors.tertiary} style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
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