import React from "react";
import {Button, Dialog, Divider, IconButton, Portal, TextInput, useTheme} from "react-native-paper";
import {View} from "react-native-web";

function DistanceDialog({acceptCallback, cancelCallback, routeMaxDistance}) {
    const {colors} = useTheme();
    const [visible, setVisibleDialog] = React.useState(true);
    const [routeDistanceDialog, setRouteDistanceDialog] = React.useState(routeMaxDistance.toString());
    const hideDialogCancel = () => {
        cancelCallback();
        setVisibleDialog(false);
    }
    const hideDialogAccept = () => {
        acceptCallback(routeDistanceDialog);
        setVisibleDialog(false);
    }

    return (
        <Portal>
            <Dialog style={{width: 600, alignSelf: 'center'}} visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
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
                        value={routeDistanceDialog}
                        onChangeText={routeDistanceDialog => setRouteDistanceDialog(routeDistanceDialog)}
                    />

                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialogCancel}>Cancel</Button>
                    <Button onPress={hideDialogAccept}>Accept</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DistanceDialog;
