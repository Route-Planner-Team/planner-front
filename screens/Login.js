import * as React from 'react';
import { Provider as PaperProvider, TextInput, HelperText, Button, Dialog, Portal, Paragraph} from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");

    const [serverError, setServerError] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };
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
              'http://127.0.0.1:8000/auth/sign-in', //server address
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ email, password }),
              })
              .then(response => {
                  response.json()
                      .then(data => {
                        if (response.status === 200 && data !== null) {
                          navigation.navigate("Root");
                        }
                        else if (response.status === 200 && data === null){
                          setServerError(true);
                        }
                      });
              })
      }
      catch (error) {
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
              We cannot find an account with that email address
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Please check the email or sign up to create a new account.
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
      <View style={styles.container}>
        <View style={styles.top}>
            <View>
              <TextInput
              style={styles.input}
              value={email}
              mode="outlined"
              error={emailError}
              onChangeText={email => setEmail(email)}
              left={<TextInput.Icon icon="email-outline"/>}
              />
              {emailError ? <HelperText style={styles.error}>{emailError}</HelperText> : <HelperText>Email</HelperText>}
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
              {passwordError ? <HelperText style={styles.error}>{passwordError}</HelperText> : <HelperText>Password</HelperText>}
            </View>
            <View style={styles.input}>
              <Button icon="login" mode="contained" onPress={handleLogin}>
                Login
              </Button>
            </View>
            { serverError &&
              <ErrorDialog/>
            }
        </View>

        <View style={styles.bottom}>
            <Text variant="bodyMedium">Don't have an account?</Text>
            <Button mode="text" onPress={() => navigation.navigate('Signup')}>
              Sign Up
            </Button>
        </View>
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    top: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottom:{
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
