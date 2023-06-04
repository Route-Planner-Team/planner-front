import {View, StyleSheet} from "react-native";
import {
    Button,
    Checkbox,
    RadioButton,
    SegmentedButtons,
    Switch,
    Text,
    TextInput,
    ToggleButton
} from "react-native-paper";
import MaskInput from "react-native-mask-input/src/MaskInput";

const RouteParameters = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.columnContainer}>
                <View style='containerColumn'>
                    <Text>Tolls</Text>
                    <Text>Number of days</Text>
                    <Text>Time limit per route</Text>
                    <Text>Distance limit per route</Text>
                    <Text>Saving preference</Text>

                </View>
                <View style='containerColumn'>
                    <Switch/>
                    <Button style={styles.daysButton}>5 days</Button>
                    <TextInput mode={'flat'} style={styles.inputField} placeholder={'0h 0m'}
                               render={props => <MaskInput {...props}
                                                           mask={[/\d/, /\d/, 'h', ' ', /\d/, /\d/, 'm']}/>}/>
                    <TextInput mode={'flat'} style={styles.inputField} placeholder={'0 km'}
                               render={props => <MaskInput {...props}
                                                           mask={[/\d/, /\d/, /\d/, ' ', 'km']}/>}></TextInput>
                </View>
            </View>
            <SegmentedButtons style={styles.segmentedButtonsContainer} buttons={[
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
        maxHeight: '50%',
        flexDirection: 'row',
        flex: 2
    },
    containerColumn: {
        display: 'flex',
        flexDirection: 'row'
    },
    daysButton: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 100,
        height: 37
    },
    inputField: {
        backgroundColor: '#EFE9F5',
        borderRadius: 16,
        width: 100,
        height: 37,
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
