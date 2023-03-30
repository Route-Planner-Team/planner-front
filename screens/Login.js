import * as React from 'react';
import { Provider as PaperProvider, TextInput, HelperText, Button  } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

export const LoginScreen = ({navigation}) =>{

    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
  
    return (
      <View style={styles.container}>
        <View style={styles.top}>
            <View>
              <TextInput
              style={styles.input}
              value={login}
              mode="outlined"
              onChangeText={login => setLogin(login)}/>
              <HelperText>Email</HelperText>
            </View>
            <View>
              <TextInput
                style={styles.input}
                value={password}
                mode="outlined"
                onChangeText={password => setPassword(password)}
                secureTextEntry
              />
              <HelperText>Password</HelperText>
            </View>
            <View style={styles.input}>
              <Button icon="login" mode="contained" onPress={() => console.log('Pressed')}>
                Login
              </Button>
            </View>
        </View>
   
        <View style={styles.bottom}>
            <Text variant="bodyMedium">Don't have an account?</Text>
            <Button mode="text" onPress={() => navigation.navigate('Sign up')}>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    top: {
        flex: 1, 
        justifyContent: 'center'
    },
    bottom:{
        flex: 0.1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    input: {
        padding: 10,
        width: 300
    },
});
  