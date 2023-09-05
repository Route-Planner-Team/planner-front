import React, {useState, useEffect} from 'react';
import {Button, Divider, SegmentedButtons, Text, useTheme, List, Checkbox, IconButton} from "react-native-paper";
import Modal from "react-native-modal";
import {StyleSheet, View, Dimensions} from "react-native";

const PriorityModal = (props) => {
  const {colors} = useTheme();
  const [activePriority, setActivePriority] = useState(props.activeDestination.priority)
  const [checked, setChecked] = React.useState(props.activeDestination.depot);

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
            <Text style={[styles.text, {fontSize: 18}]}>{props.activeDestination.address}</Text>
            <Text style={[styles.text, {color: colors.onSurface}]}>Priority</Text>
            <SegmentedButtons 
              style={styles.segmentedButtonsContainer} 
              value={activePriority}
              onValueChange={(value) => {
                setActivePriority(value);
              }}
              buttons={[
                  {
                      value: 1,
                      label: 'Low',
                  },
                  {
                      value: 2,
                      label: 'Normal',
                  },
                  {
                      value: 3,
                      label: 'High'
                  },
            ]}
            />
            <View style={{flexDirection: "row", alignItems: 'center', alignSelf: 'flex-start', marginBottom: 16}}>
              <Text style={[styles.text, {color: colors.onSurface, alignSelf: 'flex-end'}]}>Depot point</Text>
              <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {setChecked(!checked)}}/>       
                           
            </View>
                                  
            <Divider style={styles.divider}/>
            <Button 
              style={styles.acceptButton} 
              buttonColor={colors.primary} 
              textColor={'white'}
              onPress={handleAcceptPress}>Apply</Button>
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
        maxHeight: 300,
        width: 360,
        alignSelf: 'center',
        top: '25%',
        borderRadius: 16
    },
    segmentedButtonsContainer: {
        width: 300,
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingBottom: 20
    },
    acceptButton: {
        marginTop: 20,
        height: 40,
        width: 200,
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
        paddingBottom: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
      },
     
});

export default PriorityModal;
