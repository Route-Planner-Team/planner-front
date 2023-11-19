import React from "react";
import {Button, Dialog, Divider, HelperText, IconButton, Portal, TextInput, useTheme} from "react-native-paper";
import {View} from "react-native-web";

function DaysDialog({acceptCallback, cancelCallback, routeDays}) {
    const {colors} = useTheme();
    const [visible, setVisibleDialog] = React.useState(true);
    const [routeDaysDialog, setRouteDaysDialog] = React.useState(routeDays);
    const [validError, setValidError] = React.useState(false);
    const hideDialogAccept = () => {
        acceptCallback(routeDaysDialog);
        setVisibleDialog(false);
    }
    const hideDialogCancel = () => {
        cancelCallback();
        setVisibleDialog(false);
    }
    const handleInputChange = (str) => {
        setRouteDaysDialog(str);

        const validInput = /^[1-7]{1}$/;
        if (validInput.test(str)) {
            setValidError(false)
        } else {
            setValidError(true)
        }
    };

    return (
        <Portal>
            <Dialog style={{width: 600, alignSelf: 'center'}} visible={visible}
                    onDismiss={hideDialogCancel} dismissable={false}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                    <Dialog.Title style={{flex: 1}}>
                        Number of days
                    </Dialog.Title>
                    <IconButton icon={'calendar'} size={26}/>
                </View>
                <Divider/>
                <Dialog.Content>
                    <TextInput
                        style={{backgroundColor: colors.secondary, marginTop: 16}}
                        label="Route days"
                        mode="outlined"
                        error={validError}
                        keyboardType="numeric"
                        value={routeDaysDialog}
                        onChangeText={handleInputChange}
                    />
                    <HelperText>Only values ​​between 1-7</HelperText>

                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialogCancel}>Cancel</Button>
                    <Button onPress={hideDialogAccept} disabled={validError}>Accept</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DaysDialog;
