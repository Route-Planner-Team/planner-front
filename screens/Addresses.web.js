import * as React from 'react';
import { Text, Checkbox, List, FAB, Portal, Divider, ActivityIndicator, useTheme, Dialog, Button, IconButton} from 'react-native-paper';
import { StyleSheet, View, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import config from "../config";

function AddressesScreen({route}) {

    const {colors} = useTheme();
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalVisible, setVisible] = React.useState(false);
    const [destinations, setDestinations] = React.useState([]);
    const navigation = useNavigation();
    const setPlacesCallback = route.params.setPlaces;

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
    function ImportModal() {
        const handleAccept = () => {
            const filteredDest = data.filter((data, index) => checkedItems[index]);
            const modifiedDest = filteredDest.map(dest => ({address: dest.name,
                depot: false,
                latitude: dest.latitude,
                longitude: dest.longitude,
                priority: 2 }));
            if (setPlacesCallback) {
                setPlacesCallback([{id: 0}, ...modifiedDest]);
            }
            navigation.navigate('Home');
        };





        return (
            <View>
                <Portal>
                    <Dialog style={{width: 600, alignSelf: 'center'}} visible={modalVisible} onDismiss={() => setVisible(false)} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{ flex: 1}}>
                                Import addresses.
                            </Dialog.Title>
                        </View>
                        <Divider/>
                        <Dialog.Content style={{marginTop: 16}}>
                            <Text variant="bodyMedium">Do you want to import these addresses to a new route?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setVisible(false)}>No</Button>
                            <Button onPress={handleAccept}>Yes</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Divider/>
            <ScrollView>
                {data && data.filter(item => item.count > 1).map((item, index) => (
                    <View key={index}>
                        <List.Item
                            style={{paddingHorizontal: 16}}
                            title={`${item.name}`}
                            description={`Used ${item.count} times`}
                            onPress={() => {
                                handleCheckboxToggle(index);
                            }}
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
            <View style={styles.footer}>
                <FAB
                    icon="share-outline"
                    style={styles.fab}
                    onPress={() => setVisible(true)}
                />

            </View>
            {isLoading && <LoadingDialog/>}
            {modalVisible && <ImportModal/>}
        </View>
    );
}
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
export default AddressesScreen;
