import {View, StyleSheet} from "react-native";
import React from "react";
import {
    Button,
    SegmentedButtons,
    Switch,
    Text,
    TextInput,
} from "react-native-paper";
import MaskInput from "react-native-mask-input/src/MaskInput";
import DropDownPicker from 'react-native-dropdown-picker';

const RouteParameters = (props) => {

    const [openDropdown, setOpenDropdown] = React.useState(false);

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
                    <TextInput mode={'outlined'} style={styles.inputField} outlineStyle={styles.inputFieldOutline}
                               placeholder={'0h 0m'}
                               render={props => <MaskInput {...props}
                                                           mask={[/\d/, /\d/, 'h', ' ', /\d/, /\d/, 'm']}/>}/>
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
        </View>);
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 420,
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
        gap: 9
    },
    daysButton: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 100,
        height: 37,
        borderWidth: 0
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
        fontSize: 16
    },
    segmentedButtonElement: {}
});

export default RouteParameters;