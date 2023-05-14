import React, {useCallback} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {View, StyleSheet, SafeAreaView} from 'react-native';
import BottomSheet, {BottomSheetFooter, BottomSheetView} from '@gorhom/bottom-sheet';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Button, List, Text} from "react-native-paper";
import {ScrollView} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeCustomFooter from "../components/HomeCustomFooter";

const bottomSheetSnapPoints = ['12%', '50%', '85%'];

function HomeScreen({navigation}) {
    const bottomSheetRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [currentRegion, setCurrentRegion] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788, latitudeDelta: 0.01, longitudeDelta: 0.005
    });
    const [markerCoords, setMarkerCoords] = React.useState({
        latitude: 52.46672421135597, longitude: 16.927230713146788
    })
    const [destinations, setDestinations] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(true);
    const [isMarkerVisible, setIsMarkerVisible] = React.useState(false);

    const handleSnapPress = useCallback((index) => {
        bottomSheetRef.current?.snapToIndex(index);
        setIsOpen(true)
    })

    return (<SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
            <GooglePlacesAutocomplete placeholder='Enter Location'
                                      minLength={2}
                                      autoFocus={false}
                                      returnKeyType={'default'}
                                      fetchDetails={true}
                                      onPress={(data, details = null) => {
                                          // 'details' is provided when fetchDetails = true
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
                                          }])
                                          mapRef.current.animateToRegion(newRegion, 1000)
                                      }}
                                      styles={{
                                          textInputContainer: {
                                              alignSelf: 'center', width: 220, height: 28
                                          }, textInput: {
                                              backgroundColor: '#FFFBFE',
                                              height: 28,
                                              fontSize: 16,
                                              lineHeight: 20,
                                              letterSpacing: 0.5,
                                          }, predefinedPlacesDescription: {
                                              color: '#1faadb',
                                          },
                                      }}
                                      query={{
                                          key: 'YOUR_GOOGLE_API_KEY', language: 'en',
                                      }}/>
            <Icon name={'magnify'} style={{fontSize:26, color:'purple'}}/>
        </View>
        <MapView style={styles.map}
                 provider={PROVIDER_GOOGLE}
                 ref={mapRef}
                 initialRegion={currentRegion}>
            {isMarkerVisible ? <Marker coordinate={markerCoords} pinColor={'purple'}/> : null}
        </MapView>
        <BottomSheet style={styles.bottomSheet}
                     ref={bottomSheetRef}
                     snapPoints={bottomSheetSnapPoints}
                     onClose={() => setIsOpen(false)}
                     footerComponent={HomeCustomFooter}
        >
            <BottomSheetView style={styles.destinationListContainer}>
                <ScrollView>
                    {destinations.map(dest => (<List.Item title={dest.address}
                                                          left={props => <List.Icon {...props} color={'purple'}
                                                                                    icon={'radiobox-marked'}/>}
                                                          right={props => <List.Icon {...props}
                                                                                     icon={'delete-outline'}/>}></List.Item>))}
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
        padding: 16,
        backgroundColor: '#FFFBFE',
        width: 280,
        borderRadius: 28,
    }, map: {
        width: '100%',
        height: '90%'
    }, bottomSheet: {
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        elevation: 24
    }, destinationListItem: {
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
