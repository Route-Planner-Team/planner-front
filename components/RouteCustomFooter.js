import {Button, useTheme} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {BottomSheetFooter} from "@gorhom/bottom-sheet";
import {LinearGradient} from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const RouteCustomFooter = (props) => {
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const navigation = useNavigation();
    const {colors} = useTheme();
    const handleOptimize = () => {
        //TODO navi logic
        
      }
    return (
        <BottomSheetFooter {...props}
            style={styles.footerContainer}
            bottomInset={bottomSafeArea}>

            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={['transparent','white','white', 'white', 'white', 'white' ]}
                    start={{ x: 0.5, y: 0.0}}
                    end={{ x: 0.5, y: 1.0 }}
                    style={styles.gradientBackground}>
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.optimiseButton}
                            mode={'contained'}
                            icon={'navigation-variant-outline'}
                            onPress={handleOptimize}>
                            Navigate
                        </Button>

                    </View>
                </LinearGradient>
            </View>

        </BottomSheetFooter>


      );
}

const styles = StyleSheet.create({
    footerContainer: {
        height: '10%',
    },
    optimiseButton: {
        height: 40,
        width: '92%'
    },
    gradientBackground: {
        justifyContent: 'flex-end',
      },
    buttonContainer: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',

      },
      gradientContainer: {
        marginTop: 0, // Adjust this value to move the gradient up
        paddingBottom: 0, // Adjust this value to create space for the white mask at the bottom
      },
});

export default RouteCustomFooter;
