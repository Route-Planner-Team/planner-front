import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { useFocusEffect } from '@react-navigation/native';
import {
    Portal,
    IconButton,
    FAB,
    ActivityIndicator,
    useTheme,
    List,
    Text,
    Avatar,
    Divider,
    Dialog,
    Button,
    DataTable,
    TextInput,
    Checkbox,
    Snackbar,
   } from 'react-native-paper';
import {BarChart, PieChart} from "react-native-chart-kit";
import config from "../config";


function StatisticsScreen({calendar, setCalendar, data}) {

    const {colors} = useTheme();
    const { email, expires_in, access_token, refresh_token } = data;

    const barChartConfig = {
        color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
        backgroundGradientFrom: 'transparent',
        backgroundGradientTo: 'transparent',
        fillShadowGradientFrom: 'rgba(103, 80, 164)',
        fillShadowGradientTo: 'rgba(103, 80, 164)',
        fillShadowGradientFromOpacity: 1,
        fillShadowGradientToOpacity: 1,
        strokeWidth: 3, // optional, default 3
        barPercentage: 1,
        useShadowColorFromDataset: false, // optional
    };

    const priorityLabels = ["Low Priority", "Normal Priority", "High Priority"];


    //dates
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();
    const initialEndDate = new Date(currentDateString);
    const initialStartDate = new Date();
    initialStartDate.setFullYear(currentDate.getFullYear() - 1);
    const [startDate, setStartDate] = React.useState(initialStartDate)
    const [endDate, setEndDate] = React.useState(initialEndDate)


    //data
    const [summedFuelLiters, setSummedFuelLiters] = React.useState('0')
    const [summedDurationHours, setSummedDurationHours] = React.useState('0')
    const [summedDistanceKm, setSummedDistanceKm] = React.useState('0')
    const [completedRoutes, setCompletedRoutes] = React.useState('0')
    const [visited, setVisited] = React.useState('0')
    const [unvisited, setUnvisited] = React.useState('0')
    const [summedDaysOfWeekToComplete , setSummedDaysOfWeekToComplete] = React.useState({
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0,
        "Sunday": 0
    })
    const [summedVisitedPriorities , setSummedVisitedPriorities] = React.useState({
        "Priority 1": 2,
        "Priority 2": 7,
        "Priority 3": 3
    })
    const [mostFrequentlyVisitedLocations , setMostFrequentlyVisitedLocations] = React.useState([])

    const weekdaysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const colorsOrder = {
        secondary: colors.secondary,
        primary: colors.primary,
        tertiary: colors.tertiary
      };
    const barData =
        {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            datasets: [
                {
                    data: weekdaysOrder.map((day) => summedDaysOfWeekToComplete[day])
                }
            ]
        };
    const pieData =  Object.entries(summedVisitedPriorities).map(([priority, value], index) => ({
        name: priorityLabels[index],
        value: value,
        color: Object.values(colorsOrder)[index] // Get the color based on the index
    }));

    const postStats = async () => {

        const increasedEndDate = new Date(endDate);
        increasedEndDate.setDate(endDate.getDate() + 1);

        let formattedStartDate = startDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }).replace(/\//g, '.');
        let formattedEndDate = increasedEndDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }).replace(/\//g, '.');

        await fetch(`${config.apiURL}/stats`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_date: formattedStartDate,
                end_date: formattedEndDate
            }),
        }).then(response => response.json())
        .then(data => {
            console.log(data.number_of_visited_locations)
            console.log(data)
            setSummedFuelLiters(data.summed_fuel_liters)
            setSummedDurationHours(data.summed_duration_hours)
            setSummedDistanceKm(data.summed_distance_km)
            setCompletedRoutes(data.number_of_completed_routes)
            setVisited(data.number_of_visited_locations)
            setUnvisited(data.number_of_unvisited_locations)
            setSummedDaysOfWeekToComplete(data.summed_days_of_week_to_complete)
            setSummedVisitedPriorities(data.summed_visited_priorities)
            setMostFrequentlyVisitedLocations(data.most_frequently_visited_locations)
        })
        .catch(err =>
        {
            console.log(err);
        });
    }





    useFocusEffect(
        React.useCallback(() => {
            postStats();
        }, [])
    );


    function CalendarModal() {
        const [visible, setVisibleDialog] = React.useState(true);
        const hideDialogAccept = () => {
            setVisibleDialog(false);
            setCalendar(false);
            postStats();
        }
        const hideDialogCancel = () => {
            setVisibleDialog(false);
            setCalendar(false);
        }
        return (
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialogCancel} dismissable={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 12 }}>
                    <Dialog.Title>
                        Change date range
                    </Dialog.Title>
                </View>
                <Divider/>
              <Dialog.Content style={{padding: 16}}>
                <Text>Pick the date range for which display statistics.</Text>
                <View>
                    <View style={{marginVertical: 36}}>
                    <DatePickerInput
                        locale="en-GB"
                        label="Start date"
                        value={startDate}
                        onChange={(d) => setStartDate(d)}
                        inputMode="start"
                        animationType='fade'
                    />
                    </View>
                    <View style={{marginVertical: 36}}>
                    <DatePickerInput
                    disableStatusBarPadding={true}
                        locale="en-GB"
                        label="End date"
                        value={endDate}
                        onChange={(d) => setEndDate(d)}
                        inputMode="start"
                        animationType='fade'
                    />
                    </View>
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
    return (
     <ScrollView style={styles.container}>
        <Divider/>
        <List.Section style={styles.list}>
            <List.Subheader>Look at your data in numbers</List.Subheader>
            <Divider/>
            <List.Item
                title="Completed routes"
                description={completedRoutes}
                left={() => <List.Icon icon="truck-check-outline" />} />
            <List.Item
                title="Visited locations"
                description={visited}
                left={() => <List.Icon icon="map-marker-check-outline" />}
            />
            <List.Item
                title="Unvisited locations"
                description={unvisited}
                left={() => <List.Icon icon="map-marker-off-outline" />}
            />

            <Divider/>

            <List.Item
                title="Routes completed each day."
                left={() => <List.Icon icon="chart-bar" />} />
        </List.Section>
         <BarChart
             style={{alignSelf: 'center'}}
             data={barData}
             width={1000}
             height={300}
             chartConfig={barChartConfig}
             showValuesOnTopOfBars={true}
             withHorizontalLabels={false}
         />

        <List.Section style={[styles.list, {marginTop: 18}]}>
            <Divider/>
            <List.Item
                title="Summed distance kilometers."
                description={summedDistanceKm}
                left={() => <List.Icon icon="map-marker-distance" />} />
            <List.Item
                title="Summed duration hours."
                description={summedDurationHours}
                left={() => <List.Icon icon="timer" />}
            />
            <List.Item
                title="Summed fuel liters."
                description={summedFuelLiters}
                left={() => <List.Icon icon="barrel" />}
            />
            <Divider/>
            <List.Item
                title="Summed visited priorities."
                left={() => <List.Icon icon="chart-pie" />} />
        </List.Section>
        <View style={[styles.list, {alignItems: 'center'}]}>
            <PieChart
                data={pieData}
                width={800}
                height={500}
                chartConfig={barChartConfig}
                accessor={"value"}
                backgroundColor={"transparent"}
                hasLegend={true}
                style={{alignSelf: 'center'}}
                absolute
            />
        </View>
        <List.Section style={[styles.list, {marginTop: 0}]}>
            <Divider/>

            <List.Item
                title="Most frequently visited locations."
                left={() => <List.Icon icon="map-marker-check" />} />

            {mostFrequentlyVisitedLocations && mostFrequentlyVisitedLocations.map((loc, index) => (
                <List.Item
                    key={index}
                    title={loc.address}
                    description={loc.count}
                />
            ))}
        </List.Section>

        {calendar && <CalendarModal/>}

     </ScrollView>
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list:{
        margin: 16
    }
});

export default StatisticsScreen;
