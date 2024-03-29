import React from "react";
import {Button, Dialog, Divider, IconButton, Portal, TextInput, useTheme} from "react-native-paper";
import {View} from "react-native-web";

function TimeDialog({acceptCallback, cancelCallback, routeMaxTime}) {
    const {colors} = useTheme();
    const [visible, setVisibleDialog] = React.useState(true);
    const [routeHoursDialog, setRouteHoursDialog] = React.useState(Math.floor(parseInt(routeMaxTime, 10) / 60).toString());
    const [routeMinutesDialog, setRouteMinutesDialog] = React.useState((parseInt(routeMaxTime, 10) % 60).toString());
    const hideDialogAccept = () => {
        acceptCallback(routeHoursDialog, routeMinutesDialog);
        setVisibleDialog(false);
    }
    const hideDialogCancel = () => {
        cancelCallback();
        setVisibleDialog(false);
    }

    return (
        <Portal>
            <Dialog visible={visible} style={{alignSelf: 'center', width: 600}}
                    onDismiss={hideDialogCancel} dismissable={false}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 12}}>
                    <Dialog.Title style={{flex: 1, zIndex: 3000}}>
                        Time limit per route
                    </Dialog.Title>
                    <IconButton icon={'timer'} size={26}/>
                </View>
                <Divider/>
                <Dialog.Content>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            style={{backgroundColor: colors.secondary, marginTop: 16, width: 130, marginRight: 8}}
                            label="Hours"
                            mode="outlined"
                            keyboardType="numeric"
                            value={routeHoursDialog}
                            onChangeText={routeHoursDialog => setRouteHoursDialog(routeHoursDialog)}
                        />
                        <TextInput
                            style={{backgroundColor: colors.secondary, marginTop: 16, width: 130}}
                            label="Minutes"
                            mode="outlined"
                            keyboardType="numeric"
                            value={routeMinutesDialog}
                            onChangeText={routeMinutesDialog => setRouteMinutesDialog(routeMinutesDialog)}
                        />
                    </View>

                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialogCancel}>Cancel</Button>
                    <Button onPress={hideDialogAccept}>Accept</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default TimeDialog;
