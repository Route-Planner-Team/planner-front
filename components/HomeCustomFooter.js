import {Button, Text} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {BottomSheetFooter} from "@gorhom/bottom-sheet";

const HomeCustomFooter = (props) => {

    return (
        <BottomSheetFooter {...props} bottomInset={50}>
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
            backgroundColor: 'purple',
            position: 'absolute',
            width: 320,
            height: 40,
            bottom: '5%',
            alignSelf: 'center',

        }, optimiseButtonContent: {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            gap: 8
        }, optimiseButtonText: {
            fontSize: 20,
            color: 'white',
        }, optimiseButtonIcon: {
            fontSize: 24,
            color: 'white'
        }
    });

export default HomeCustomFooter;
