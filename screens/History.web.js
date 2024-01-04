import * as React from 'react';
import { TextInput, Checkbox, List, Dialog, Portal, Divider, ActivityIndicator, useTheme} from 'react-native-paper';
import { StyleSheet, Text, View, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import config from "../config";

function HistoryScreen({navigation, data}) {

    const {colors} = useTheme();
    const { email, expires_in, access_token, refresh_token } = data;
    const [viewData, setViewData] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false);


    useFocusEffect(
        React.useCallback(() => {
            getRoutes();
        }, [])
    );

    const getRoutes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${config.apiURL}/routes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(data.message){
                setIsLoading(false);
            }else{
                const names = data.routes.map(x => x.name)
                const completed = data.routes.map(x => x.routes_completed)
                const merged = names.map((name, index) => ({
                    name: name,
                    completed: completed[index],
                }));

                setViewData(merged)
                setIsLoading(false);
            }

        } catch (error) {
            setIsLoading(false);
        }
    };
    const getSpecificRoute = async (index) => {
        try {
            const response = await fetch(`${config.apiURL}/routes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            const activeRoute = data.routes[index];
            navigation.navigate('Route', { activeRoute, access_token })
        } catch (error) {
        }
    };



    function LoadingDialog() {
        return (
            <Portal>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={colors.primary} size='large'/>
                </View>
            </Portal>
        );
    }

    return (
        <View style={styles.container}>
            <Divider/>
            <ScrollView>
                <View style={styles.header}>
                    <List.Subheader>Name</List.Subheader>
                    <List.Subheader>Completed</List.Subheader>
                </View>
                {viewData && viewData.map((item, index) => (
                    <View key={index}>
                        <List.Item
                            title={item.name}
                            left={props => <List.Icon {...props} icon="arrow-right"/>}
                            right={() => (item.completed ? <List.Icon icon="check" color="green" /> : null)}
                            onPress={() => getSpecificRoute(index)}
                        />
                        <Divider/>
                    </View>
                ))}
            </ScrollView>
            {isLoading && <LoadingDialog/>}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
export default HistoryScreen;
