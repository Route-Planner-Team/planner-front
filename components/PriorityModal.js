import React, {useState} from 'react';
import {Button, Divider, Portal, SegmentedButtons, Text, useTheme} from "react-native-paper";
import Modal from "react-native-modal";
import {StyleSheet} from "react-native";

const PriorityModal = (props) => {
    const {colors} = useTheme();
    const [activePriority, setActivePriority] = useState(props.activeDestination.priority)

    return (
        <Portal>
            <Modal style={styles.modal} visible={props.priorityModalVisible}>
                <Text style={styles.text}>Stop Priority</Text>
                <SegmentedButtons style={styles.segmentedButtonsContainer} value={activePriority}
                                  onValueChange={(value) => {
                                      let destinationsFiltered = props.destinations.filter(x => x.address !== props.activeDestination.address);
                                      let activeDestination = {...props.activeDestination, priority: parseInt(value)}
                                      let activeIdx = props.destinations.findIndex(x => x.address === props.activeDestination.address);
                                      props.setDestinations([...destinationsFiltered.slice(0, activeIdx), activeDestination, ...destinationsFiltered.slice(activeIdx)]);
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
                                  ]}/>
                <Divider style={styles.divider}/>
                <Button style={styles.acceptButton} buttonColor={colors.primary} textColor={'white'}
                        onPress={() => props.setPriorityModalVisible(false)}>Apply</Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        backgroundColor: 'white',
        maxHeight: 300,
        width: 360,
        alignSelf: 'center',
        top: '25%',
        borderRadius: 16
    },
    segmentedButtonsContainer: {
        width: 330,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16
    },
    acceptButton: {
        height: 40,
        width: 220,
        alignSelf: 'center'
    },
    divider: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#CAC4D0',
    },
    text: {
        fontSize: 14,
        padding:10
    }
});

export default PriorityModal;
