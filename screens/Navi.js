import React from 'react';
import { StyleSheet, View, Linking, ScrollView } from 'react-native';
import { List, IconButton,  Avatar, Button, Card, Divider, useTheme, Portal, ActivityIndicator} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import config from "../config";

 
function NaviScreen({ route }) {

    const navigation = useNavigation();
    const [list, setDestList] = React.useState(route.params.list.name);
    const [visited, setVisited] = React.useState([]);
    const [day, setDay] = React.useState(route.params.routeday);
    const [routeID, setRouteID] = React.useState(route.params.list.routeid);
    const [i, setIndex] = React.useState(0);
    const [avoidTolls, setAvoidTolls] = React.useState(route.params.avoid_tolls);
    const [inLoading, setInLoading] = React.useState(false);
    const [disableBackButton, setDisableBackButton] = React.useState(false);



    
    React.useEffect(() => {
      const destlist = route.params.list.name
      const routeday = route.params.list.day
      const routeid = route.params.list.routeid
      const avoidtolls = route.params.list.avoid_tolls

      try{
        setDestList(destlist)
        setDay(routeday)
        setRouteID(routeid)
        setIndex(0);
        setAvoidTolls(avoidtolls)
      }catch(error){
        console.log("error");
      }
    }, [route.params.list.routeid]);
    
    const {colors} = useTheme();

    const incrementIndex = () => {
      setIndex(i + 1);
    };
    const decrementIndex = () => {
      setIndex(i - 1);
    };
    React.useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (disableBackButton) {
          e.preventDefault();
        }
      });
  
      return unsubscribe;
    }, [disableBackButton, navigation]);


    const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);
    const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(true);

    // Function to handle button click
    const handleNextButtonClick = () => {
      if (i < list.length - 1) {
        incrementIndex();
      }
    };
    const handlePrevButtonClick = () => {
      if (i > 0) {
        decrementIndex();
      }
    }
    const handleGoogleMaps = () => {
      const dest = list[i+1]
      openGoogleMapsNavigation(dest)
    };
    
    React.useEffect(() => {
      if (i >= list.length - 1) {
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


    const markWaypoint = async (isVisited) => {
      await fetch(`${config.apiURL}/routes/waypoint?should_keep=true`,
          {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${route.params.access_token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                routes_id: routeID,
                route_number: day,
                location_number: i,
                visited: isVisited
              }),
          }).then(response => response.json())
          .then(data => {
            console.log(data)
            setDisableBackButton(false)
          })
          .catch(err => 
          {
              console.log(err);
              setDisableBackButton(false)
          });        
  }

  const waypointInfo = async () => {
    setInLoading(true);
    await fetch(`${config.apiURL}/routes/waypoint/info`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${route.params.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              routes_id: route.params.list.routeid,
              route_number: route.params.list.day
            }),
        }).then(response => response.json())
        .then(data => {
          setVisited(data.map(x => x.visited))
          setInLoading(false);
        })
        .catch(err => 
        {
            setInLoading(false);
            console.log(err);
        });        
  }
  useFocusEffect(
    React.useCallback(() => {
      waypointInfo();
    }, [ ])
  );





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

      const openGoogleMapsNavigation = async (destinationPlace) => {
        const destinationLocation = await geocodePlace(destinationPlace);
        if (destinationLocation) {
          const destinationCoords = `${destinationLocation.lat},${destinationLocation.lng}`;
          const avoidTollsParam = avoidTolls ? '&avoid=tolls' : '';
      
          const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationCoords}&travelmode=driving&dir_action=navigate${avoidTollsParam}`;
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

    

      const [loadingVisited, setLoadingVisited] = React.useState(false);
      const [loadingUnvisited, setLoadingUnvisited] = React.useState(false);

      const handlePress = (isVisited) => {
        setDisableBackButton(true)
        markWaypoint(isVisited);
        if(isVisited){
          setLoadingVisited(true)
        }else{
          setLoadingUnvisited(true)
        }
  

        const newVisited = [...visited];
        newVisited[i] = isVisited;

        pressTimer = setTimeout(() => {
          setVisited(newVisited)
          setLoadingVisited(false)
          setLoadingUnvisited(false)
        }, 500);
      };

      function LoadingDialog() {
        return (
            <Portal>
                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator animating={true} color={colors.primary} size='large'/>
                </View>
            </Portal>
        );
    }

     


      return (
        <ScrollView style={styles.container}>
          <Divider/>
          <View style={styles.cardConatainer}>
            <Card mode='outlined' style={{backgroundColor: colors.background, borderRadius: 16, borderColor: colors.surfaceVariant}}>
            <Card.Title title={`Day ${day+1}`} subtitle="Your current location is"/>
                <Card.Content>
                  <View> 
                    <List.Item
                      title={list[i].split(', ')[0].length > 1 ? list[i].split(', ')[0] : list[i].split(', ')[1]}
                      description={list[i].split(', ').slice(1).join(', ')}
                      left={props => <Avatar.Icon size={81} color={colors.primary} style={{backgroundColor: colors.secondary}} icon="map-marker-account-outline" />}
                    ></List.Item>
                  </View>
                </Card.Content>
                <Card.Actions>
                {(visited[i] || visited[i] === null) &&
                <Button
                  mode="contained"
                  loading={loadingVisited}
                  onPress={() => handlePress(true)}
                  disabled={visited[i] === true}
                  icon={'checkbox-marked-circle-outline'}
                >
                  Visited
                </Button>
                }
                {(!visited[i] || visited[i] === null) &&

                <Button
                  mode="contained"
                  loading={loadingUnvisited}
                  onPress={() => handlePress(false)}
                  disabled={visited[i] === false}
                  icon={'close-circle-outline'}
                >
                  Unvisited
                </Button>
                }

         
                </Card.Actions>
                <Card.Actions>
                  <Button onPress={handlePrevButtonClick} disabled={isPrevButtonDisabled}>Previous</Button>
                  <Button onPress={handleNextButtonClick} disabled={isNextButtonDisabled}>Next</Button>
                </Card.Actions>
              </Card>
              <Card mode='outlined' style={{backgroundColor: colors.background, borderRadius: 16, borderColor: colors.surfaceVariant}}>
                <Card.Title title="Route" subtitle="Your next direction is"/>
                <Card.Content>
                  <View> 
                  <List.Item
                      title={list[i].split(', ')[0].length > 1 ? list[i].split(', ')[0] : list[i].split(', ')[1]}
                      description={list[i].split(', ').slice(1).join(', ')}
                      left={props => <Avatar.Icon size={46} icon="map-marker-outline" />}
                    ></List.Item>
                    <View style={[styles.line, { borderColor: colors.primaryContainer }]} />
                    { i+1 >= list.length ?
                      <List.Item
                        title={'No more destinations to visit'}
                        left={props => <Avatar.Icon size={46} icon="check" />}>
                      </List.Item> :
                      <List.Item
                      title={list[i+1].split(', ')[1].length > 1 ? list[i+1].split(', ')[0] : list[i+1].split(', ')[1]}
                      description={list[i+1].split(', ').slice(1).join(', ')}
                      left={props => <Avatar.Icon size={46} icon="map-marker-outline" />}>
                    </List.Item>
                    }
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    onPress={handleGoogleMaps}
                    disabled={i+1 === list.length}>
                      Open in Google Maps
                  </Button>
                </Card.Actions>
              </Card>
              {
              inLoading &&
              <LoadingDialog/>
            }
            </View>
        </ScrollView>
       );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardConatainer: {
        margin: 16,
        gap: 16
    },
    line: {
      borderLeftWidth: 4, 
      height: 72, 
      marginLeft: 21
    }
});



export default NaviScreen