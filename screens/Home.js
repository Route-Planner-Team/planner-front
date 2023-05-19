import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {View, StyleSheet, SafeAreaView} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Button, IconButton, List} from "react-native-paper";
import {ScrollView} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeCustomFooter from "../components/HomeCustomFooter";

const bottomSheetSnapPoints = ['12%', '50%', '85%'];

function HomeScreen({navigation}) {
    const bottomSheetRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const autocompleteRef = React.useRef(null);
    const [currentRegion, setCurrentRegion] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788, latitudeDelta: 0.01, longitudeDelta: 0.005
    });
    const [markerCoords, setMarkerCoords] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788
    })
    const [destinations, setDestinations] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(true);
    const [isMarkerVisible, setIsMarkerVisible] = React.useState(false);

    function handleSearchButtonPress() {
        if (!autocompleteRef.current.isFocused()) autocompleteRef.current.focus();
    };

    function goToDestination(data, details) {// 'details' is provided when fetchDetails = true
        console.log('Data: ', data)
        console.log('Details: ', details)
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
            longitude: newRegion.longitude
        }]);
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

    return (<SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
            <GooglePlacesAutocomplete placeholder='Enter Location'
                                      minLength={2}
                                      autoFocus={false}
                                      returnKeyType={'default'}
                                      fetchDetails={true}
                                      ref={autocompleteRef}
                                      onPress={(data, details = null) => {
                                          goToDestination(data, details)
                                      }}
                                      renderRightButton={() => <IconButton icon={'magnify'} size={26} style={{alignSelf: 'center'}} onPress={handleSearchButtonPress}/>}
                                      styles={{
                                          textInputContainer: {
                                              display: 'flex',
                                              flexDirection: 'row',
                                              alignSelf: 'center',
                                              width: 260,
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
                                          key: 'YOUR_API_KEY', language: 'en',
                                      }}/>
        </View>
        <MapView style={styles.map}
                 provider={PROVIDER_GOOGLE}
                 ref={mapRef}
                 initialRegion={currentRegion}>
            {isMarkerVisible ? <Marker coordinate={markerCoords} pinColor={'#6750A4'}/> : null}
        </MapView>
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={bottomSheetSnapPoints}
            onClose={() => setIsOpen(false)}
            footerComponent={HomeCustomFooter}
            backgroundComponent={props => <BottomSheetBackground {...props}/>}
        >
            <BottomSheetView>
                <ScrollView>
                    {destinations.map(dest => (<List.Item title={dest.address}
                                                          left={props => <List.Icon {...props} color={'#6750A4'}
                                                                                    icon={'radiobox-marked'}/>}
                                                          right={props => <Button
                                                              onPress={() => deleteDestination(dest)}>
                                                              <Icon {...props}
                                                                    style={{fontSize: 24, lineHeight: 24}}
                                                                    name={'delete-outline'}/>
                                                          </Button>}></List.Item>))}
                </ScrollView>
            </BottomSheetView>
        </BottomSheet>
    </SafeAreaView>);
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: '7%',
        zIndex: 10,
        padding: 10,
        backgroundColor: '#FFFBFE',
        width: 280,
        minHeight: 56,
        borderRadius: 28,
    }, map: {
        width: '100%',
        height: '90%'
    }, bottomSheet: {
        backgroundColor: 'white',
        borderRadius: 28,
        shadowColor: '#000',
        shadowOpacity: 0.57,
        shadowRadius: 15.19,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        elevation: 24
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
    }
});

export default HomeScreen;
