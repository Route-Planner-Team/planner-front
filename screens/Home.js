
import React, { useCallback } from 'react';
import MapView from "react-native-maps";
import {View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import { Searchbar } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const snapPoints = ['10%', '50%', '90%'];


function Home({ navigation }) {
    const bottomSheetRef = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(true);
    
  
    const handleSnapPress = useCallback((index) => {
      bottomSheetRef.current?.snapToIndex(index);
      setIsOpen(true)
    })
  
    return (
      

      <SafeAreaView style={styles.container} >
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
      padding: 10,
    },
});

export default Home;
