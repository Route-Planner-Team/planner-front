import React, {useState, useEffect} from 'react';
import {Button, Divider, SegmentedButtons, Text, useTheme, Chip, Checkbox , Avatar, Card} from "react-native-paper";
import Modal from "react-native-modal";
import {StyleSheet, View, Dimensions} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const PriorityModal = (props) => {
  const {colors} = useTheme();
  const [activePriority, setActivePriority] = useState(props.activeDestination.priority)
  const [checked, setChecked] = useState(props.activeDestination.depot);
  const [selectedChipIndex, setSelectedChipIndex] = useState(() => {
    if (checked) {
      return 4;
    }
    return props.activeDestination.priority
  });



  const handleChipPress = (index) => {
    setSelectedChipIndex(index);
    if(index === 4){
      setChecked(true);
      setActivePriority(2);
    }
    else{
      setChecked(false);
      setActivePriority(index);
    }
  };

  const handleAcceptPress = () => {
    let destinationsFiltered = props.destinations.filter(x => x.address !== props.activeDestination.address);
    let activeDestination = {...props.activeDestination, priority: parseInt(activePriority), depot: checked}
    let activeIdx = props.destinations.findIndex(x => x.address === props.activeDestination.address);

    if(checked){
      const updatedList = destinationsFiltered.map((destination) => ({
        ...destination,
        depot: false,
      }));
      props.setDestinations([...updatedList.slice(0, activeIdx), activeDestination, ...updatedList.slice(activeIdx)]);
      props.setDepot(props.activeDestination);
    }
    else {
      props.setDestinations([...destinationsFiltered.slice(0, activeIdx), activeDestination, ...destinationsFiltered.slice(activeIdx)]);
    }
    props.setPriorityModalVisible(false)
  };
  const handleDeletePress = () => {
    props.deleteDestination(props.activeDestination)
    props.setPriorityModalVisible(false)
  }



  return (
    <View>
      {/* Rest of your component code */}
      
      <Modal
        statusBarTranslucent
        isVisible={props.priorityModalVisible}
        deviceHeight={Dimensions.get('screen').height}
        coverScreen={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {backgroundColor: colors.surfaceVariant}]}>
            <Card.Title
              title={props.activeDestination.address}
              left={(props) => <Avatar.Icon {...props} icon="city" />}
            />
            <View style={styles.chipContainer}>
              <Chip
                mode='outlined' 
                style={
                  selectedChipIndex === 1 ? 
                  {backgroundColor: colors.primary} : 
                  {backgroundColor: colors.secondaryContainer}
                }
                textStyle={{ color: selectedChipIndex === 1 ? 'white' : 'black' }}
                compact={true} 
                onPress={() => handleChipPress(1)}>
                  Low
              </Chip>
              <Chip
                mode='outlined' 
                style={
                  selectedChipIndex === 2 ? 
                  {backgroundColor: colors.primary} : 
                  {backgroundColor: colors.secondaryContainer}
                }
                textStyle={{ color: selectedChipIndex === 2 ? 'white' : 'black' }}
                onPress={() => handleChipPress(2)}>
                  Normal
              </Chip>
              <Chip
                mode='outlined' 
                style={
                  selectedChipIndex === 3 ? 
                  {backgroundColor: colors.primary} : 
                  {backgroundColor: colors.secondaryContainer}
                }
                textStyle={{ color: selectedChipIndex === 3 ? 'white' : 'black' }}
                onPress={() => handleChipPress(3)}>
                  High
              </Chip>
            </View>
            <View style={styles.chipContainer}>
              <Chip
                  mode='outlined'
                  icon={() => (
                    <Icon 
                      name="home-circle-outline" 
                      size={16} 
                      color={selectedChipIndex === 4 ? 'white' : 'black' } />
                )}
                  style={
                    selectedChipIndex === 4 ? 
                    {backgroundColor: colors.primary} : 
                    {backgroundColor: colors.secondaryContainer}
                  }
                  textStyle={{ color: selectedChipIndex === 4 ? 'white' : 'black' }}
                  onPress={() => handleChipPress(4)}>
                    Depot Point
                </Chip>
            </View>

                                  
            <Divider style={styles.divider}/>
            <View style={{flexDirection: 'row', alignSelf: 'flex-end', padding: 10}}>
            
            <Card.Actions>
              <Button
                onPress={handleDeletePress}
                icon='delete'>Delete
              </Button>
              <Button
                onPress={handleAcceptPress}
                icon='map-marker-plus'>
                  Set
              </Button>
              </Card.Actions>
              
            </View>
            
          </View>     
        </View>
      </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignSelf: 'center',
        borderRadius: 16
    },
    segmentedButtonsContainer: {
        width: 300,
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingBottom: 20,
    },
    acceptButton: {
        marginTop: 20,
        marginRight: 20,
        width: 120,
    },
    divider: {
        width: 350,
        height: 1,
        borderColor: '#CAC4D0',
    },
    text: {
        alignSelf: 'flex-start',
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        paddingTop: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
      },
    chipContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      alignSelf: 'flex-start', 
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 16
    }
     
});

export default PriorityModal;
