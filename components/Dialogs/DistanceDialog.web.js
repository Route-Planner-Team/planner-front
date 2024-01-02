import React from "react";
import {Button, Dialog, Divider, IconButton, Portal, TextInput, useTheme, List, Checkbox} from "react-native-paper";
import {View} from "react-native-web";

function DistanceDialog({acceptCallback, cancelCallback, routeMaxDistance, noDistanceLimit, setNoDistanceLimit}) {
    const {colors} = useTheme();
    const [visible, setVisibleDialog] = React.useState(true);
    const [routeDistanceDialog, setRouteDistanceDialog] = React.useState(routeMaxDistance.toString());
    const [validError, setValidError] = React.useState(false);
    const [checked, setChecked] = React.useState(noDistanceLimit);

    const checking = () => {
        setChecked(!checked);
        setNoDistanceLimit(!checked);
    }
    const hideDialogCancel = () => {
        cancelCallback();
        setVisibleDialog(false);
    }
    const hideDialogAccept = () => {
        acceptCallback(routeDistanceDialog);
        setVisibleDialog(false);
    }
    const handleInputChange = (str) => {
        setRouteDistanceDialog(str)
        const validInput = /^[0]{1}$/;
        if (validInput.test(str) || !Number.isInteger(Number(str))) {
            setValidError(true);
        } else {
            setValidError(false);
        }
    };

    return (
        <Portal>
            <Dialog style={{width: 600, alignSelf: 'center'}} visible={visible} onDismiss={hideDialogCancel}
                    dismissable={false}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                    <Dialog.Title style={{flex: 1}}>
                        Distance limit per day
                    </Dialog.Title>
                    <IconButton icon={'map-marker-distance'} size={26}/>
                </View>
                <Divider/>
                <Dialog.Content>
                    <TextInput
                        style={{backgroundColor: colors.secondary, marginTop: 16}}
                        label="Your distance in kilometers"
                        mode="outlined"
                        keyboardType="numeric"
                        error={validError}
                        value={routeDistanceDialog}
                        onChangeText={handleInputChange}
                        disabled={noDistanceLimit}
                    />
                    <List.Item
                        title={'No limit'}
                        onPress={checking}
                        left={props => <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                        />}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialogCancel}>Cancel</Button>
                    <Button onPress={hideDialogAccept} disabled={validError}>Accept</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DistanceDialog;
