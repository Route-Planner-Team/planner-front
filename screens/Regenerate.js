import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions, StatusBar, Animated, Keyboard} from 'react-native';
import {IconButton,
        Portal, 
        FAB, 
        ActivityIndicator, 
        useTheme, 
        List, 
        Avatar, 
        Divider, 
        Dialog, 
        Button, 
        TextInput, 
        Checkbox} from 'react-native-paper';
import config from "../config";


  
function RegenerateScreen({ route }) {

    const {colors} = useTheme();
    const access_token = route.params.access_token;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRegenerate, setIsRegenerate] = React.useState(false);
    const [addresses, setAddresses] = React.useState([]);
    const [depot_address, setDepot] = React.useState();
    const [days, setDays] = React.useState(1);
    const routeID = route.params.routeID;

    const getUnvisited = async (index) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiURL}/routes/regenerate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              routes_id: routeID,
          }),
        });
  
        const data = await response.json();
        setDepot(data.depot_address)
        setAddresses(data.addresses)
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    React.useEffect(() => {
      getUnvisited();
    }, [routeID]);

    function RegenerateModal() {
      const {colors} = useTheme();
      const [checked, setChecked] = React.useState(false);
      const [validError, setValidError] = React.useState(false);
      const [regenerateDays, setRegenerateDays] = React.useState('1')
      const checking = () => {
        setChecked(!checked);
      }
      const handleInputChange = (str) => {
        setRegenerateDays(str);

        const validInput = /^[1-7]{1}$/;
        if (validInput.test(str)) {
            setValidError(false)
        }
        else{
            setValidError(true)
        }
    };


      const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;;
      let keyboardHeight = React.useRef(new Animated.Value(windowHeight)).current;

      React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            Animated.timing(keyboardHeight, {
              toValue: windowHeight - e.endCoordinates.height,
              duration: 150,
              useNativeDriver: false,
            }).start();
          });
      
          const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(keyboardHeight, {
              toValue: windowHeight,
              duration: 150,
              useNativeDriver: false,
            }).start();
          });
      
          return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
          };
      }, []);
    
      return (
        <View>
            <Portal>
              <Animated.View style={{ height: keyboardHeight}}>
                <Dialog visible={isRegenerate} onDismiss={() => setIsRegenerate(false)} >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                    <Dialog.Title style={{ flex: 1}}>
                        Regenarate settings
                    </Dialog.Title>
                    <IconButton icon={'cog-outline'} size={26} />
                </View>
                <Divider/>
                  <View>
                    <List.Item
                      style={{marginHorizontal: 16}}
                      title={'Number of days'}
                      right={props => <TextInput
                        style={{ backgroundColor: colors.secondary, width: 100}}
                        label="Days"
                        onChangeText={handleInputChange}
                        error={validError}
                        value={regenerateDays}
                        mode="outlined"
                        keyboardType="numeric"
                      />}
                      />
                      <List.Item
                        style={{marginHorizontal: 16}}
                        title={'Overwrite'}
                        right={props => <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={checking}
                        />}
                      />
                    </View>
                  <Dialog.Actions>
                    <Button>Cancel</Button>
                    <Button>Accept</Button>
                  </Dialog.Actions>
                </Dialog>
              </Animated.View>
              </Portal>
        </View>
        );
    }

    function LoadingDialog() {
        return (
          <Portal>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator animating={true} color={colors.primary} size='large'/>
            </View>
          </Portal>
        );
      }

    
    return (
     <View style={styles.container}>
      <Divider/>
      <ScrollView style={{height: '100%'}}>
        {depot_address &&
        <List.Item 
          title={depot_address.split(',')[0]}
          description={depot_address.split(', ').slice(1).join(', ')}
          left={props =><Avatar.Icon  icon='map-marker-outline' size={46} color={colors.tertiary} 
                style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
          right={() => <List.Icon icon="home-circle-outline" color="green" />}
        />}
        {addresses.map((address, index) => (
          <List.Item
            key={index}
            title={address.split(',')[0]}
            description={address.split(', ').slice(1).join(', ')}
            left={props =><Avatar.Icon  icon='map-marker-remove-outline' size={46} color={colors.tertiary} 
                  style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
          />
        ))}
        </ScrollView>
        <View style={styles.footer}>
          <FAB
            icon="share-outline"
            style={styles.fab}
            onPress={() => setIsRegenerate(true)}
          />

        </View>
      {isLoading && <LoadingDialog/>}
      {isRegenerate && <RegenerateModal/>}
     </View>
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
      position: 'absolute',
      alignSelf: 'flex-end',
      bottom: 0,
    },
    fab:
    {
      margin: 16,
      borderRadius: 64,
      width: 64, 
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
    },

});

export default RegenerateScreen;