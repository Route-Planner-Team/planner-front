import {Button, Text} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {BottomSheetFooter} from "@gorhom/bottom-sheet";

const HomeCustomFooter = (props) => {

    return (
        <BottomSheetFooter {...props} bottomInset={31}>
            <Button style={styles.optimiseButton} mode={'contained'}>
                <View style={styles.optimiseButtonContent}>
                    <Icon style={styles.optimiseButtonIcon} name={'car-outline'}/>
                    <Text style={styles.optimiseButtonText}>Optimise Route</Text>
                </View>
            </Button>
        </BottomSheetFooter>);
}

const styles = StyleSheet.create({
    optimiseButton: {
        backgroundColor: '#6750A4',
        position: 'absolute',
        width: 320,
        height: 40,
        bottom: '5%',
        alignSelf: 'center',

    }, optimiseButtonContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8
    }, optimiseButtonText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center',
        lineHeight: 20,
        fontWeight: '500'
    }, optimiseButtonIcon: {
        fontSize: 18,
        lineHeight: 20,
        fontWeight: '500',
        color: 'white',
        alignSelf: 'center'
    }
});

export default HomeCustomFooter;
