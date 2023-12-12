import React, {useState, useEffect} from 'react';
import {Button, Divider, Text, useTheme} from "react-native-paper";
import Modal from "react-native-modal";
import {StyleSheet, View, Dimensions} from "react-native";

const WarningModal = (props) => {
  const {colors} = useTheme();

  return (
    <View>
      <Modal
        statusBarTranslucent
        isVisible={props.warning}
        deviceHeight={Dimensions.get('screen').height}
        coverScreen={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: colors.surfaceVariant}]}>
                    <Text style={[styles.text, {fontSize: 20}]}>Warning</Text>
            <Divider style={styles.divider}/>
                <Text style={[styles.text, {fontSize: 14, paddingTop: 16}]}>{props.warningMessage}. Change parameters and generate again</Text>
                <Button style={styles.acceptButton} onPress={() => props.setWarning(false)}>Ok</Button>
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
    acceptButton: {
        alignSelf: 'flex-end',
        marginTop: 8,
        marginRight: 8,
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
        fontSize: 15,
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

export default WarningModal;
