import {Button, Text} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {BottomSheetFooter} from "@gorhom/bottom-sheet";
import {LinearGradient} from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeCustomFooter = (props) => {
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    return (
        <BottomSheetFooter {...props}
            style={styles.footerContainer} 
            bottomInset={bottomSafeArea}>


            <LinearGradient
                colors={['transparent', 'white']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradientBackground}
            />

            <View style={styles.buttonContainer}>
                <Button style={styles.optimiseButton} mode={'contained'} icon={'car-outline'}>
                    Optimise Route
                </Button>
            </View>
        </BottomSheetFooter>
      
      
      );
}

const styles = StyleSheet.create({
    footerContainer: {
        height: '10%',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',

      },
    optimiseButton: {
        width: '92%',
        height: 40,
        justifyContent: 'flex-start'

    }, optimiseButtonContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    gradientBackground: {
        ...StyleSheet.absoluteFill,
      },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default HomeCustomFooter;
