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
    Text,
    Checkbox,
    Snackbar,
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LogBox } from 'react-native';
import LoadingModal from "../components/LoadingModal";
import config from "../config";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);



function RegenerateScreen({ route }) {


    const {colors} = useTheme();
    const navigation = useNavigation();
    const { access_token } = route.params.data;
    const setPlacesCallback = route.params.setPlaces;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRegenerate, setIsRegenerate] = React.useState(false);
    const [addresses, setAddresses] = React.useState([]);
    const [priorities, setPriorities] = React.useState([]);
    const [depot_address, setDepot] = React.useState();
    const [visibleSnackBar, setVisibleSnackBar] = React.useState(false);
    const [visibleLoadingModal, setVisibleLoadingModal] = React.useState(false);
    const [message, setMessage] = React.useState(null);

    const onToggleSnackBar = () => setVisibleSnackBar(!visibleSnackBar);
    const onDismissSnackBar = () => setVisibleSnackBar(false);
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
            console.log(JSON.stringify(data))
            if(data.message){
                setMessage(data.message)
            }
            else{
                setDepot(data.depot_address)
                setAddresses(data.addresses)
                setPriorities([2, ...data.priorities])
            }

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUnvisited();
        }, [routeID])
    );
    function RegenerateModal() {
        const {colors} = useTheme();

        const handleAccept = () => {
            const mergedPlaces = [depot_address, ...addresses];
            const modifiedplaces = mergedPlaces.map((place, index) => ({
                address: place.name,
                depot: index === 0,
                latitude: place.latitude,
                longitude: place.longitude,
                priority: priorities[index],
            }));
            if (setPlacesCallback) {
                setPlacesCallback([{id: routeID}, ...modifiedplaces]);
            }
            setIsRegenerate(false);
            console.log(setPlacesCallback)
            navigation.navigate('Home');
        }
        const handleCancel = () => {
            setIsRegenerate(false);
        }


        return (
            <View>
                <Portal>
                    <Dialog visible={isRegenerate} onDismiss={handleCancel} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                            <Dialog.Title style={{ flex: 1}}>
                                Regenarate route
                            </Dialog.Title>
                        </View>
                        <Divider/>
                        <Dialog.Content style={{paddingTop: 16}}>
                            <Text>Do you want to import these addresses and regenerate the route?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleCancel}>Cancel</Button>
                            <Button onPress={handleAccept}>Accept</Button>
                        </Dialog.Actions>
                    </Dialog>
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
                        title={depot_address.name}
                        description={depot_address.name.split(', ').slice(1).join(', ')}
                        left={props =><Avatar.Icon  icon='map-marker-outline' size={46} color={colors.tertiary}
                                                    style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
                        right={() => <List.Icon icon="home-circle-outline" color="green" />}
                    />}
                {addresses && addresses.map((address, index) => (
                    <List.Item
                        key={index}
                        title={address.name}
                        description={address.name.split(', ').slice(1).join(', ')}
                        left={props =><Avatar.Icon  icon='map-marker-remove-outline' size={46} color={colors.tertiary}
                                                    style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
                    />
                ))}
                {message &&
                    <View style={styles.emptyContent}>
                        <Avatar.Icon size={225} icon="checkbox-blank-off-outline" color={colors.onSurfaceDisabled} style={{backgroundColor: 'transparent'}}/>
                        <Text style={{color: colors.onSurfaceDisabled, alignSelf: 'center', textAlign: 'center'}}>
                            {message}
                        </Text>
                    </View>
                }
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
            {visibleLoadingModal &&
                <LoadingModal
                    isLoading={visibleLoadingModal}
                />}
            <Snackbar
                visible={visibleSnackBar}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Undo',
                    onPress: () => {
                        // Do something
                    },
                }}>
                Your route has been generated.
            </Snackbar>
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
    emptyContent: {
        alignItems: 'center',
        margin: 8,
    }

});

export default RegenerateScreen;
