import * as React from 'react';
import { TextInput, Checkbox, List, Dialog, Portal, Divider, ActivityIndicator, useTheme} from 'react-native-paper';
import { StyleSheet, Text, View, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import config from "../config";

function AddressesScreen({route}) {

    const {colors} = useTheme();
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const [checkedItems, setCheckedItems] = React.useState([]);
    const handleCheckboxToggle = (index) => {
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      setCheckedItems(newCheckedItems);
    };

    

    useFocusEffect(
      React.useCallback(() => {
        getAddresses();
      }, [ ])
    );


    const getAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiURL}/addresses`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${route.params.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if(data.addresses){
          setData(data.addresses)
        }
        setIsLoading(false);

      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };


    
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
        <ScrollView>
          {data && data.filter(item => item.count > 1).map((item, index) => (
            <View>
              <List.Item 
                style={{marginHorizontal: 16}}
                key={index}
                title={`${item.address}`}
                description={`Used ${item.count} times`} 
                left={props =>
                  <Checkbox
                    status={checkedItems[index] ? 'checked' : 'unchecked'}
                    onPress={() => {
                      handleCheckboxToggle(index);
                    }}
                  />
              }/>
              <Divider/>
              </View>
          ))}
        </ScrollView>
        {isLoading && <LoadingDialog/>}
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});
export default AddressesScreen;
