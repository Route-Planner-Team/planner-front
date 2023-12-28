import * as React from 'react';
import {Button, Dialog, HelperText, Paragraph, Portal, TextInput} from 'react-native-paper';
import {Animated, Dimensions, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import config from "../config";


function SignUpScreen({navigation}) {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [confirmError, setConfirmError] = React.useState("");

    const [serverError, setServerError] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [showConfirmEmailDialog, setShowConfirmEmailDialog] = React.useState(false);

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
                `${config.apiURL}/auth/sign-up`, //server address
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
                                setServerError(true);
                            } else {
                                setShowConfirmEmailDialog(true);
                            }
                        });
                })
        } catch (error) {
            console.error(error);
        }
    }
    const handleSignUp = () => {
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

        // Check if passwords match
        if (password !== confirmPassword) {
            setConfirmError("Passwords do not match");
            return;
        } else {
            setConfirmError("");
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

        console.log(keyboardHeight)

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    function EmailConfirmationDialog() {
        const [visible, setVisibleDialog] = React.useState(true);

        const hideDialog = () => {
            setVisibleDialog(false)
            navigation.navigate('Login');
        }

        return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        Verification Needed
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Please verify your account using the URL sent to your email.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
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
                        This login email already exists.
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Please try a different email address to register, or login to your existing account.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
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
                            error={emailError}
                            mode="outlined"
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
                    <View>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            error={confirmError}
                            mode="outlined"
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                            left={<TextInput.Icon icon="lock-outline"/>}
                            right={<TextInput.Icon icon="eye-outline" onPress={handleToggleConfirmPassword}/>}
                            secureTextEntry={!showConfirmPassword}
                        />
                        {confirmError ? <HelperText style={styles.error}>{confirmError}</HelperText> :
                            <HelperText>Confirm password</HelperText>}
                        {serverError &&
                            <ErrorDialog/>
                        }
                        {showConfirmEmailDialog && <EmailConfirmationDialog/>}
                    </View>

                    <View style={styles.input}>
                        <Button mode="contained" onPress={handleSignUp}>
                            Sign Up
                        </Button>
                    </View>
                </Animated.View>
                <View style={styles.bottom}>
                    <Text variant="bodyMedium">
                        Already have an account?
                    </Text>
                    <Button mode="text" onPress={() => navigation.navigate('Login')}>
                        Login
                    </Button>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    top: {
        paddingTop: 32,
        justifyContent: 'center',
        alignItems: 'center',
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


export default SignUpScreen;
