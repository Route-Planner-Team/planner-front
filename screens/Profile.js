import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Keyboard, StatusBar, Animated} from 'react-native';
import {useTheme, Button, Avatar, FAB, List, IconButton, Dialog, Portal, Divider, TextInput, Text} from 'react-native-paper'
import config from "../config";


function ProfileScreen({ setRefresh, refresh, navigation, data}) {

    const {email, access_token} = data;
    const {colors} = useTheme();
    const [password, setPassword] = React.useState(null);
    const [confirmPassword, setConfirmPassword] = React.useState(null);

    //Modals attributes
    const [passwordModalVisible, setPasswordModalVisible] = React.useState(false);
    const togglePasswordModal = () => {
        setPasswordModalVisible(!passwordModalVisible);
    };

    const [emailModalVisible, setEmailModalVisible] = React.useState(false);
    const toggleEmailModal = () => {
        setEmailModalVisible(!emailModalVisible);
    };

    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const toggleDeleteModal = () => {
        setDeleteModalVisible(!deleteModalVisible);
    };


    const changePassword = async () => {
        await fetch(`${config.apiURL}/auth/change-password`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "new_password": password,
                    "confirm_new_password": confirmPassword
                }),
            }).then(response => response.json())
            .then(data => {
            })
            .catch(err => {
            });
    }
    const changeEmail = async (email) => {
        await fetch(`${config.apiURL}/auth/change-email`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                }),
            }).then(response => response.json())
            .then(data => {
                navigation.navigate('Login');
            })
            .catch(err => {
            });
    }
    const deleteActiveRoutes = async () => {
        try {
            const response = await fetch(`${config.apiURL}/routes`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setRefresh(!refresh)
        } catch (error) {
        }
    };


    function ChangeEmailDialog() {
        const [localEmail, setLocalEmail] = React.useState(null);
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            setVisibleDialog(false);
            setEmailModalVisible(false);
            changeEmail(localEmail);
        }
        const hideDialogCancel = () => {
            setVisibleDialog(false);
            setEmailModalVisible(false);
        }

        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;

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
            <Portal>
                <Animated.View style={{height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingRight: 12
                        }}>
                            <Dialog.Title>
                                Enter new email
                            </Dialog.Title>
                            <IconButton icon={'email'} size={26}/>
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{backgroundColor: colors.secondary, marginTop: 16, marginRight: 8}}
                                label="New email"
                                mode="outlined"
                                value={localEmail}
                                onChangeText={value => setLocalEmail(value)}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialogCancel}>Cancel</Button>
                            <Button onPress={hideDialogAccept}>Accept</Button>
                        </Dialog.Actions>

                    </Dialog>
                </Animated.View>
            </Portal>
        );
    }

    function ChangePasswordDialog() {
        const [localPassword, setLocalPassword] = React.useState(null);
        const [localConfirmPassword, setLocalConfirmPassword] = React.useState(null);
        const [showPassword, setShowPassword] = React.useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
        const handleTogglePassword = () => {
            setShowPassword(!showPassword);
        };
        const handleToggleConfirmPassword = () => {
            setShowConfirmPassword(!showConfirmPassword);
        };
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            setVisibleDialog(false);
            setPasswordModalVisible(false);
            setPassword(localPassword);
            setConfirmPassword(localConfirmPassword);
            changePassword();
        }
        const hideDialogCancel = () => {
            setVisibleDialog(false);
            setPasswordModalVisible(false);
        }

        const windowHeight = Dimensions.get('window').height + StatusBar.currentHeight;

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
            <Portal>
                <Animated.View style={{height: keyboardHeight}}>
                    <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingRight: 12
                        }}>
                            <Dialog.Title>
                                Enter password
                            </Dialog.Title>
                            <IconButton icon={'lock-outline'} size={26}/>
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{backgroundColor: colors.secondary, marginTop: 16, marginRight: 8}}
                                label="New password"
                                mode="outlined"
                                right={<TextInput.Icon icon="eye-outline" onPress={handleTogglePassword}/>}
                                secureTextEntry={!showPassword}
                                value={localPassword}
                                onChangeText={localPassword => setLocalPassword(localPassword)}
                            />
                            <TextInput
                                style={{backgroundColor: colors.secondary, marginTop: 16, marginRight: 8}}
                                label="Confirm new password"
                                mode="outlined"
                                right={<TextInput.Icon icon="eye-outline" onPress={handleToggleConfirmPassword}/>}
                                secureTextEntry={!showConfirmPassword}
                                value={localConfirmPassword}
                                onChangeText={localConfirmPassword => setLocalConfirmPassword(localConfirmPassword)}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialogCancel}>Cancel</Button>
                            <Button onPress={hideDialogAccept}>Accept</Button>
                        </Dialog.Actions>

                    </Dialog>
                </Animated.View>
            </Portal>
        );
    }

    function DeleteDialog() {
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            setVisibleDialog(false);
            setDeleteModalVisible(false);
            deleteActiveRoutes();
        }
        const hideDialogCancel = () => {
            setVisibleDialog(false);
            setDeleteModalVisible(false);
        }
        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 12
                    }}>
                        <Dialog.Title>
                            Confirm deletion
                        </Dialog.Title>
                        <IconButton icon={'delete-outline'} size={26}/>
                    </View>
                    <Divider/>
                    <Dialog.Content style={{padding: 16}}>
                        <Text>Are you sure you want permanently remove all active routes?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialogCancel}>No</Button>
                        <Button onPress={hideDialogAccept}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }


    return (

        <View style={styles.container}>
            {passwordModalVisible && <ChangePasswordDialog/>}
            {deleteModalVisible && <DeleteDialog/>}
            {emailModalVisible && <ChangeEmailDialog/>}
            <View style={[styles.headerContainer, {backgroundColor: colors.secondary}]}>
                <View style={styles.profilePicture}>
                    <Avatar.Icon size={100} icon="account-outline"/>
                </View>
            </View>
            <View style={[styles.contentContainer, {backgroundColor: colors.background}]}>
                <List.Item
                    title='Email'
                    description={email}
                    left={props => <IconButton icon={'email-outline'} size={26}/>}
                    onPress={toggleEmailModal}>
                </List.Item>
                <List.Item
                    title='Change the password'
                    description='**********'
                    onPress={togglePasswordModal}
                    left={props => <IconButton icon={'lock-outline'} size={26}/>}>
                </List.Item>
                <List.Item
                    title='Delete all active routes'
                    description='Clear routes history'
                    onPress={toggleDeleteModal}
                    left={props => <IconButton icon={'delete-outline'} size={26}/>}>
                </List.Item>
                <List.Item
                    title='Sign out'
                    description='Sign out of Route Planner'
                    onPress={() => navigation.navigate('Login')}
                    left={props => <IconButton icon={'exit-to-app'} size={26}/>}>
                </List.Item>
            </View>
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    headerContainer: {
        height: 250,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    contentContainer: {
        flex: 2,
        backgroundColor: 'green'
    },
    profilePicture: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 50
    },
    fab: {
        margin: 16,
        borderRadius: 50,
    },
});

export default ProfileScreen;
