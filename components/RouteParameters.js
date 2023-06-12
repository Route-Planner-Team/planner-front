import {View, StyleSheet} from "react-native";
import React from "react";
import {
    Button, Divider,
    SegmentedButtons,
    Switch,
    Text,
    TextInput, useTheme,
} from "react-native-paper";
import MaskInput from "react-native-mask-input/src/MaskInput";
import DropDownPicker from 'react-native-dropdown-picker';

const RouteParameters = (props) => {

    const [openDropdown, setOpenDropdown] = React.useState(false);
    const {colors} = useTheme();


    return (
        <View style={styles.container}>
            <View style={styles.columnContainer}>
                <View style={styles.leftContainerColumn}>
                    <Text>Tolls</Text>
                    <Text>Number of days</Text>
                    <Text>Time limit per route</Text>
                    <Text>Distance limit per route</Text>
                    <Text>Saving preference</Text>

                </View>
                <View style={styles.rightContainerColumn}>
                    <Switch value={props.tolls} onValueChange={props.setTolls}/>
                    <DropDownPicker style={styles.daysButton} containerStyle={{height: 37}} value={props.routeDays} setValue={props.setRouteDays} open={openDropdown} setOpen={setOpenDropdown} items={[
                        {
                            label: '1 day',
                            value: 1
                        },
                        {
                            label: '2 days',
                            value: 2
                        },
                        {
                            label: '3 days',
                            value: 3
                        },
                        {
                            label: '4 days',
                            value: 4
                        },
                        {
                            label: '5 days',
                            value: 5
                        },
                        {
                            label: '6 days',
                            value: 6
                        }
                    ]}/>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 3}}>
                        <TextInput mode={'outlined'} style={styles.timeInputField} outlineStyle={styles.inputFieldOutline}
                               placeholder={'0h'}
                               render={props => <MaskInput {...props}
                                                           mask={[/\d/, /\d/]}/>}/>
                        <Text style={{alignSelf: 'center', fontSize: 18, fontWeight: '500'}}>:</Text>
                        <TextInput mode={'outlined'} style={styles.timeInputField} outlineStyle={styles.inputFieldOutline}
                                   placeholder={'0m'}
                                   render={props => <MaskInput {...props}
                                                               mask={[/\d/, /\d/]}/>}/>
                    </View>
                    <TextInput mode={'outlined'} style={styles.inputField} outlineStyle={styles.inputFieldOutline}
                               placeholder={'0 km'}
                               render={props => <MaskInput {...props}
                                                           mask={[/\d/, /\d/, /\d/, ' ', 'km']}/>}></TextInput>
                </View>
            </View>
            <SegmentedButtons style={styles.segmentedButtonsContainer} value={props.savingPreference } onValueChange={props.setSavingPreference}
                              buttons={[
                                  {
                                      value: 'duration',
                                      label: 'Duration',
                                  },
                                  {
                                      value: 'distance',
                                      label: 'Distance',
                                  },
                                  {
                                      value: 'fuel',
                                      label: 'Fuel'
                                  },
                              ]}/>
            <Divider style={styles.divider}/>
            <Button style={styles.acceptButton} buttonColor={colors.primary} textColor={'white'} onPress={() => props.setShowParamScreen(false)}>Apply</Button>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: 'white',
        width: '100%',
        height: 520,
        display: 'flex',
        flexDirection: 'column',
    },
    columnContainer: {
        display: 'flex',
        maxHeight: '60%',
        flexDirection: 'row',
        flex: 2,
        padding: 15,
        gap: '50%'
    },
    leftContainerColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        gap: 37
    },
    rightContainerColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        gap: 10
    },
    daysButton: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 100,
        height: 37,
        borderWidth: 0,
        fontSize: 14,
    },
    timeInputField: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 45,
        height: 37,
        fontSize: 14
    },
    inputField: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 100,
        height: 37,
    },
    inputFieldOutline: {
        borderWidth: 0,
        borderRadius: 16,
    },
    segmentedButtonsContainer: {
        width: 350,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        bottom: 40
    },
    segmentedButtonElement: {},
    acceptButton:{
        height: 40,
        bottom: 20,
        width: 220,
        alignSelf: 'center'
    },
    divider:{
        width: '100%',
        borderWidth: 1,
        borderColor: '#CAC4D0',
        bottom: 35
    }
});

export default RouteParameters;
