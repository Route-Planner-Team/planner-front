import React, { useCallback } from 'react';
import MapView from "react-native-maps";
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { Searchbar } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const snapPoints = ['12%', '50%', '90%'];


function HomeScreen({ navigation }) {
    const bottomSheetRef = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
  
    const handleSnapPress = useCallback((index) => {
      bottomSheetRef.current?.snapToIndex(index);
      setIsOpen(true)
    })
  
    return (
      <SafeAreaView style={styles.container}>
        <MapView style={styles.map}
                 initialRegion={
                    {
                        latitude: 52.46672421135597,
                        longitude:16.927230713146788,
                        latitudeDelta:0.01,
                        longitudeDelta:0.005
                    }}>
        </MapView>
        <BottomSheet style={styles.shadowProp}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            onClose={() => setIsOpen(false)}
        >
          <BottomSheetView style={styles.content}>
            <Searchbar 
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              disabled={true}
              />
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    content: {
      alignItems: 'center',
      paddingRight: 16,
      paddingLeft: 16,
    },
    shadowProp: {
        backgroundColor: 'white',  // <==== HERE
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        elevation: 24,
    },
});

export default HomeScreen;
