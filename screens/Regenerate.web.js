import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Checkbox,
    Dialog,
    Divider,
    FAB,
    IconButton,
    List,
    Portal,
    Snackbar,
    TextInput,
    useTheme,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import LoadingModal from "../components/LoadingModal";
import config from "../config";


function RegenerateScreen({route, refresh, setRefresh}) {

    const {colors} = useTheme();
    const access_token = route.params.access_token;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRegenerate, setIsRegenerate] = React.useState(false);
    const [addresses, setAddresses] = React.useState([]);
    const [priorities, setPriorities] = React.useState([]);
    const [depot_address, setDepot] = React.useState();
    const [savingPreference, setSavingPreference] = React.useState('fuel');
    const [days, setDays] = React.useState(1);
    const [visibleSnackBar, setVisibleSnackBar] = React.useState(false);
    const [visibleLoadingModal, setVisibleLoadingModal] = React.useState(false);


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
            setDepot(data.depot_address)
            setAddresses(data.addresses)
            setPriorities(data.priorities)
            setSavingPreference(data.savingPreference)
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const optimiseRoute = async (overwrite) => {

        let link = `${config.apiURL}/routes`
        if (overwrite) {
            link = `${config.apiURL}/routes?routes_id=${routeID}`
        }

        setVisibleLoadingModal(true)
        await fetch(link,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    depot_address: depot_address,
                    addresses: addresses,
                    priorities: priorities,
                    days: days,
                    distance_limit: null,
                    duration_limit: null,
                    preferences: 'fuel',
                    avoid_tolls: false
                }),
            }).then(response => response.json())
            .then(data => {
                if (data.error !== undefined) {
                    console.log(data)
                    setVisibleLoadingModal(false)
                } else {
                    setRefresh(!refresh)
                    setVisibleLoadingModal(false)
                    onToggleSnackBar();
                }
            })
            .catch(err => {
                console.log(err);
                setVisibleLoadingModal(false)
            });
    }


    useFocusEffect(
        React.useCallback(() => {
            getUnvisited();
        }, [routeID])
    );

    function RegenerateModal() {
        const {colors} = useTheme();
        const [checked, setChecked] = React.useState(false);
        const [validError, setValidError] = React.useState(false);
        const [regenerateDays, setRegenerateDays] = React.useState('1')
        const checking = () => {
            setChecked(!checked);
        }
        const handleAccept = () => {
            setIsRegenerate(false)
            setDays(regenerateDays);
            optimiseRoute(checked);
        }
        const handleCancel = () => {
            setIsRegenerate(false);
        }
        const handleInputChange = (str) => {
            setRegenerateDays(str);

            const validInput = /^[1-7]{1}$/;
            if (validInput.test(str)) {
                setValidError(false)
            } else {
                setValidError(true)
            }
        };

        return (
            <Portal>
                <Dialog visible={isRegenerate} onDismiss={() => setIsRegenerate(false)}
                        style={{width: 600, alignSelf: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                        <Dialog.Title style={{flex: 1}}>
                            Regenarate settings
                        </Dialog.Title>
                        <IconButton icon={'cog-outline'} size={26}/>
                    </View>
                    <Divider/>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row'}}>
                            <List.Item style={{width: 400}} title={'Number of days'}/>
                            <TextInput
                                style={{backgroundColor: colors.secondary, width: 100}}
                                label="Days"
                                onChangeText={handleInputChange}
                                error={validError}
                                value={regenerateDays}
                                mode="outlined"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <List.Item style={{width: 400}} title={'Overwrite'}/>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={checking}
                            />
                        </View>
                    </View>
                    <Dialog.Actions>
                        <Button onPress={handleCancel}>Cancel</Button>
                        <Button onPress={handleAccept}>Accept</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }

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
        <View style={styles.container}>
            <Divider/>
            <ScrollView style={{height: '100%'}}>
                {depot_address &&
                    <List.Item
                        title={depot_address.split(',')[0]}
                        description={depot_address.split(', ').slice(1).join(', ')}
                        left={props => <Avatar.Icon icon='map-marker-outline' size={46} color={colors.tertiary}
                                                    style={{
                                                        backgroundColor: colors.tertiaryContainer,
                                                        marginLeft: '5%',
                                                    }}/>}
                        right={() => <List.Icon icon="home-circle-outline" color="green"/>}
                    />}
                {addresses.map((address, index) => (
                    <List.Item
                        key={index}
                        title={address.split(',')[0]}
                        description={address.split(', ').slice(1).join(', ')}
                        left={props => <Avatar.Icon icon='map-marker-remove-outline' size={46} color={colors.tertiary}
                                                    style={{
                                                        backgroundColor: colors.tertiaryContainer,
                                                        marginLeft: '5%',
                                                    }}/>}
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
                Hey there! I'm a Snackbar.
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

});

export default RegenerateScreen;
