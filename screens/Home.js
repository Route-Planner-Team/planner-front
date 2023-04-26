import * as React from 'react';
import MapView from "react-native-maps";
import {View} from "react-native";
import {StyleSheet} from "react-native";

function Home({naviation}) {
   return (
    <View style={styles.container}>
        <MapView style={styles.map}
                 initialRegion={
                    {
                        latitude: 52.46672421135597,
                        longitude:16.927230713146788,
                        latitudeDelta:0.01,
                        longitudeDelta:0.005
                    }}>
        </MapView>
    </View>
   )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Home;
