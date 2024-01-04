import * as React from 'react';
import {
    ActivityIndicator,
    Button,
    Dialog, Divider,
    HelperText, IconButton,
    Paragraph,
    Portal,
    TextInput,
    useTheme
} from 'react-native-paper';
import {
    Animated,
    Dimensions,
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import config from "../config";

function LoginScreen({navigation}) {

    const {colors} = useTheme();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [inLoading, setInLoading] = React.useState(false);

    const [serverError, setServerError] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showForgotPasswordDialog, setShowForgotPasswordDialog] = React.useState(false);
    const [emailModalVisible, setEmailModalVisible] = React.useState(false);


    const [loginErrorMessage, setLoginErrorMessage] = React.useState(null);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleEmailModal = () => {
        setEmailModalVisible(!emailModalVisible);
    };

    const toggleForgotPassword = () => {
        setShowForgotPasswordDialog(!showForgotPasswordDialog);
    }

    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z]).{8,}$/;
        return passwordRegex.test(password);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const post = async () => {

        try {
            await fetch(
                `${config.apiURL}/auth/sign-in`, //server address
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',},
                    body: JSON.stringify({email, password}),
                })
                .then(response => {
                    response.json()
                        .then(data => {
                            if (data.error) {
                                // Handle error case
                                setLoginErrorMessage(data.error);
                                setServerError(true);
                            } else {
                                // Handle success case
                                setInLoading(true);
                                const {email, expires_in, access_token, refresh_token} = data;
                                setTimeout(() => {
                                    setInLoading(false);
                                    navigation.navigate('Root', {data: data});
                                }, 3000);

                            }
                        });
                })
        } catch (error) {
            console.error(error);
        }
    }
    const handleLogin = () => {
        // Check if email is valid
        if (!isValidEmail(email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError("");
        }

        // Check if password is valid
        if (!isValidPassword(password)) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        } else {
            setPasswordError("");
        }
        // If all validation checks pass, call the post()
        post();
    };
    const windowHeight = Dimensions.get('window').height - 8;
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


    const forgotPassword = async (email) => {
        await fetch(`${config.apiURL}/auth/forgot-password`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                }),
            }).then(response => response.json())
            .then(data => {
                toggleForgotPassword();
            })
            .catch(err => {
            });
    }

    function ChangeEmailDialog() {
        const [localEmail, setLocalEmail] = React.useState(null);
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            forgotPassword(localEmail);
            setVisibleDialog(false);
            setEmailModalVisible(false);
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
                                Enter your email
                            </Dialog.Title>
                            <IconButton icon={'email'} size={26}/>
                        </View>
                        <Divider/>
                        <Dialog.Content>
                            <TextInput
                                style={{backgroundColor: colors.secondary, marginTop: 16, marginRight: 8}}
                                label="Email"
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

    function ErrorDialog() {
        const [visible, setVisibleDialog] = React.useState(true);

        const hideDialog = () => {
            setVisibleDialog(false)
            setServerError(false)
        }

        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        Login failed
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {loginErrorMessage}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }

    function ForgotPasswordDialog() {
        const [visible, setVisibleDialog] = React.useState(true);

        const hideDialog = () => {
            setVisibleDialog(false)
            setShowForgotPasswordDialog(false);
        }

        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        Change password
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            An email has been sent to your address. Change the password using the link in the message.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Ok</Button>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Animated.View style={[styles.top, {height: keyboardHeight}]}>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={email}
                            mode="outlined"
                            error={emailError}
                            onChangeText={email => setEmail(email)}
                            left={<TextInput.Icon icon="email-outline"/>}
                        />
                        {emailError ? <HelperText style={styles.error}>{emailError}</HelperText> :
                            <HelperText>Email</HelperText>}
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            value={password}
                            error={passwordError}
                            mode="outlined"
                            onChangeText={password => setPassword(password)}
                            left={<TextInput.Icon icon="lock-outline"/>}
                            right={<TextInput.Icon icon="eye-outline" onPress={handleTogglePassword}/>}
                            secureTextEntry={!showPassword}
                        />
                        {passwordError ? <HelperText style={styles.error}>{passwordError}</HelperText> :
                            <HelperText>Password</HelperText>}
                    </View>
                    <View style={styles.input}>
                        <Button icon="login" mode="contained" onPress={handleLogin}>
                            Login
                        </Button>
                    </View>
                    {serverError &&
                        <ErrorDialog/>
                    }
                    {
                        inLoading &&
                        <LoadingDialog/>
                    }
                    {showForgotPasswordDialog && <ForgotPasswordDialog/>}
                    {emailModalVisible && <ChangeEmailDialog/>}
                </Animated.View>

                <View style={styles.bottomContainer}>
                    <View style={styles.bottom}>
                        <Text variant="bodyMedium">Don't have an account?</Text>
                        <Button mode="text" onPress={() => navigation.navigate('Signup')}>
                            Sign Up
                        </Button>
                    </View>
                    <View style={styles.bottom}>
                        <Text variant="bodyMedium">Forgot password?</Text>
                        <Button mode="text" onPress={() => toggleEmailModal()}>
                            Reset Password
                        </Button>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        height: '100%'
    },
    top: {
        paddingTop: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3
    },
    bottomContainer: {
        flexDirection: 'column',
        bottom: 10,
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: 10,
        width: 300
    },
    error: {
        color: '#B3261E'
    },
});
export default LoginScreen;
