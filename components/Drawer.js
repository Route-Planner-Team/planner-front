import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Avatar, List, Divider  } from 'react-native-paper';
import config from "../config";


function DrawerScreen({navigation, data, avatar, name, refresh})  {
    const { email, expires_in, access_token, refresh_token } = data;
    const { colors } = useTheme();
    const [dates, setDates] = React.useState([])
    const getActiveRoutes = async () => {
      try {
        const response = await fetch(`${config.apiURL}/routes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if(data.message){
          setDates([])
        }else{
          setDates(data.routes.map(x => x.name))
        }

      } catch (error) {
        console.error(error);
      }
    };
    const getSpecificRoute = async (index) => {
      try {
        const response = await fetch(`${config.apiURL}/routes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
        const activeRoute = data.routes[index];

        navigation.navigate('Route', { activeRoute, access_token })
      } catch (error) {
        console.error(error);
      }
    };
    React.useEffect(() => {
      getActiveRoutes();
    }, []);
    React.useEffect(() => {
      getActiveRoutes();
    }, [refresh]);



    return (
      <View style={styles.container}>
          <View style={{backgroundColor: `rgba(${colors.primaryContainer}, 0.5)`, height: '20%'}}>
            {avatar ? <Avatar.Image source={{uri: avatar}} style={styles.avatar}/>
            :  <Avatar.Icon size={50} icon="account-outline" 
              style={[styles.avatar, {backgroundColor: colors.tertiaryContainer}]}/>}
            <View style={styles.user}>
              <Text style={{color: colors.onSurface}}>{name}</Text>  
              <Text style={{color: colors.onSurfaceDisabled}}>{email}</Text>  
            </View>
          </View>
          <ScrollView style={styles.scrollView}>
            <List.Item
              title="Active routes"
            />
            {dates.length > 0 && dates[0] !== undefined ? dates.map((date, index) => (
                <List.Item
                  key={index}
                  title={date}
                  left={props => <List.Icon {...props} icon="arrow-right"/>}
                  onPress={() => getSpecificRoute(index)}
                />
              ))
              :
              <List.Item
                  title={'No active routes'}
                  left={props => <List.Icon {...props} icon="arrow-right"/>}
                />
            }
            
            
          </ScrollView>
          
          <View style={styles.bottom}>
       
          <Divider />
            <List.Item
              title="New route"
              left={props => <List.Icon {...props} icon="car-outline" />}
              onPress={() => navigation.navigate('Home')}
            />
            <List.Item 
              title="My profile"
              left={props => <List.Icon {...props} icon="account-outline" />}
              onPress={() => navigation.navigate('Profile')}
            />
            <List.Item
              title="Statistics"
              left={props => <List.Icon {...props} icon="map-check-outline" />}
              onPress={() => navigation.navigate('Statistics')}
            />
          </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        marginLeft: 16,
        marginTop: 40,
        flexDirection: 'column',
      },
    user: {
        marginLeft: 16,
        marginTop: 8,
        flexDirection: 'column',
    },
    scrollView: {
      flexDirection: 'column',
    },
    bottom: {
      justifyContent: 'flex-end'
    }
})

export default DrawerScreen;