import * as React from 'react';
import { TextInput, HelperText, Button, Dialog, Portal, Paragraph, ActivityIndicator, useTheme} from 'react-native-paper';
import { StyleSheet, Text, View, Animated, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import config from "../config";

function AddressesScreen() {

    const {colors} = useTheme();

    
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
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});
export default AddressesScreen;
