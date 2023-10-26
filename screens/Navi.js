import React from 'react';
import { StyleSheet, View, Linking} from 'react-native';
import { List, IconButton,  Avatar, Button, Card, Text, useTheme} from 'react-native-paper';
import config from "../config";
import Geolocation from 'react-native-geolocation-service';
import { color } from 'react-native-reanimated';
 
function NaviScreen({ route }) {

    const [list, setDestList] = React.useState(route.params.list);
    const [i, setIndex] = React.useState(0);
    const {colors} = useTheme();

    const incrementIndex = () => {
      setIndex(i + 1);
    };
    const decrementIndex = () => {
      setIndex(i - 1);
    };

    const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);
    const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(true);

    // Function to handle button click
    const handleNextButtonClick = () => {
      if (i < list.length - 2) {
        incrementIndex();
      }
    };
    const handlePrevButtonClick = () => {
      if (i > 0) {
        decrementIndex();
      }
    }
    const handleGoogleMaps = () => {
      const source = list[i]
      const dest = list[i+1]

      openGoogleMapsNavigation(source, dest)
    };
    
    React.useEffect(() => {
      if (i >= list.length - 2) {
        setIsNextButtonDisabled(true);
      } else {
        setIsNextButtonDisabled(false);
      }

      if (i <= 0) {
        setIsPrevButtonDisabled(true);
      } else {
        setIsPrevButtonDisabled(false);
      }
    }, [i, list]);





    const geocodePlace = async (placeName) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${config.googleAPIKey}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return location;
          }
        } catch (error) {
          console.error('Geocoding error', error);
        }
        return null;
      };

      const openGoogleMapsNavigation = async (sourcePlace, destinationPlace) => {
        const sourceLocation = await geocodePlace(sourcePlace);
        const destinationLocation = await geocodePlace(destinationPlace);

        console.log('wlaczam')
      
        if (sourceLocation && destinationLocation) {
          const sourceCoords = `${sourceLocation.lat},${sourceLocation.lng}`;
          const destinationCoords = `${destinationLocation.lat},${destinationLocation.lng}`;
      
          const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceCoords}&destination=${destinationCoords}`;
      
          Linking.canOpenURL(url)
            .then((supported) => {
              if (supported) {
                return Linking.openURL(url);
              } else {
                console.log('Cannot open Google Maps navigation');
              }
            })
            .catch((err) => console.error('An error occurred', err));
        } else {
          console.log('Could not obtain coordinates for the source or destination.');
        }
      };

      

    return (
        <View style={styles.container}>
          <View style={styles.cardConatainer}>
            <Card>
                <Card.Content>
                  <View> 
                    <List.Item
                      title={list[i].split(', ')[0].length > 1 ? list[i].split(', ')[0] : list[i].split(', ')[1]}
                      description={list[i].split(', ').slice(1).join(', ')}
                      left={props => <Avatar.Icon size={46} icon="map-marker-account-outline" />}
                    ></List.Item>
                    <View style={[styles.line, { borderColor: colors.primaryContainer }]} />
                    <List.Item
                      title={list[i+1].split(', ')[1].length > 1 ? list[i+1].split(', ')[0] : list[i+1].split(', ')[1]}
                      description={list[i+1].split(', ').slice(1).join(', ')}
                      left={props => <Avatar.Icon size={46} icon="map-marker-outline" />}>
                    </List.Item>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={handlePrevButtonClick} disabled={isPrevButtonDisabled}>Previous</Button>
                  <Button onPress={handleNextButtonClick} disabled={isNextButtonDisabled}>Next</Button>
                </Card.Actions>
              </Card>
              <Card>
                <Card.Content>
                  <View> 
                    
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={handleGoogleMaps}>Open Google Maps</Button>
                </Card.Actions>
              </Card>
            </View>
        </View>
       );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 80,
    },
    cardConatainer: {
        margin: 16,
        gap: 16
    },
    line: {
      borderLeftWidth: 4, 
      height: 70, 
      marginLeft: 21
    }
});



export default NaviScreen