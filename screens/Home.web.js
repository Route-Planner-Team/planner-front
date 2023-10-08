import React from 'react';
import {StyleSheet, View} from "react-native-web";
import {GoogleMapsWrapper} from "../components/GoogleMapsWrapper";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Map} from "../components/Map";
import config from "../config";
import {useTheme} from "react-native-paper";

function HomeScreen({data, setRefresh, refresh}) {
    const {colors} = useTheme();
    const autocompleteRef = React.useRef(null);

    return (
        <GoogleMapsWrapper>
            <Map style={styles.map}></Map>
            <View style={[styles.searchBar, {background: colors.secondary}]}>
                <GooglePlacesAutocomplete placeholder='Enter Location'
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
                                          }}/>
            </View>
        </GoogleMapsWrapper>);
}

const styles = StyleSheet.create(
    {
        map: {},
        searchBar: {
            top: '20px',
            left: '40px',
            position: 'absolute',
            width: 300,
        },
    }
);

export default HomeScreen;
