import React from "react";
import {Button, Dialog, Divider, HelperText, IconButton, Portal, SegmentedButtons} from "react-native-paper";
import {View} from "react-native-web";

function PreferenceDialog({acceptCallback, savingPreference}) {
    const [visible, setVisibleDialog] = React.useState(true);
    const [routePreferenceDialog, setRoutePreferenceDialog] = React.useState(savingPreference);
    const hideDialog = () => {
        acceptCallback(routePreferenceDialog)
        setVisibleDialog(false);
    }

    return (
        <Portal>
            <Dialog style={{width: 600, alignSelf: 'center'}} visible={visible} onDismiss={hideDialog} dismissable={false}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Dialog.Title>
                        Saving preference
                    </Dialog.Title>
                    <IconButton icon={'leaf'} size={26}/>
                </View>
                <Divider/>
                <Dialog.Content style={{marginHorizontal: -5}}>
                    <SegmentedButtons
                        style={{marginTop: 16}}
                        value={routePreferenceDialog}
                        onValueChange={setRoutePreferenceDialog}
                        buttons={[
                            {value: 'distance', label: 'Distance'},
                            {value: 'duration', label: 'Duration',},
                            {value: 'fuel', label: 'Fuel',},
                        ]}
                    />
                    <HelperText>
                        Pick the value that is your priority in saving
                    </HelperText>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Accept</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default PreferenceDialog;
