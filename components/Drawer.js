import React from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import { useTheme, Avatar, List, Divider  } from 'react-native-paper';
import config from "../config";


function DrawerScreen({navigation, data})  {
    const { email, expires_in, access_token, refresh_token } = data;
    const { colors } = useTheme();
    const [routes, setRoutes] = React.useState(0);


    const getActiveRoutes = async () => {
      fetch(`${config.apiURL}/routes/active`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          navigation.navigate('Route', {data: data})
        })
        .catch(error => {
          // Handle any errors here
          console.error(error);
        });
    }
    const handleRoutes = () => {
      getActiveRoutes();
    }

    return (
      <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            keyboardVerticalOffset={-310}>
      <View style={styles.container}>
          <View style={{backgroundColor: `rgba(${colors.primaryContainer}, 0.5)`, height: '20%'}}>
            <Avatar.Text size={50} label="RP" color={colors.tertiary} style={[styles.avatar, {backgroundColor: colors.tertiaryContainer}]}/>
            <View style={styles.user}>
              <Text style={{color: colors.onSurface}}>Route Planner</Text>  
              <Text style={{color: colors.onSurfaceDisabled}}>{email}</Text>  
            </View>
          </View>
          <ScrollView style={styles.scrollView}>
            <List.Item
              title="Active routes"
            />
            <List.Item
              title={`Previous routes`}
              left={props => <List.Icon {...props} icon="arrow-right"/>}
              onPress={handleRoutes}
            />
            
            
          </ScrollView>
          
          <View style={styles.bottom}>
          <Divider />
            <List.Item 
              title="My profile"
              left={props => <List.Icon {...props} icon="account-outline" />}
              onPress={() => navigation.navigate('Profile')}
            />
            <List.Item
              title="New route"
              left={props => <List.Icon {...props} icon="plus" />}
              onPress={() => navigation.navigate('Home')}
            />
            <List.Item
              title="Statistics"
              left={props => <List.Icon {...props} icon="chart-line-variant" />}
              onPress={() => navigation.navigate('Statistics')}
            />
            <List.Item
              title="Options"
              left={props => <List.Icon {...props} icon="cog-outline"
               />}
              onPress={() => navigation.navigate('Options')}
            />
          </View>
      </View>
      </KeyboardAvoidingView>
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