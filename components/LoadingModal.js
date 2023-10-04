import React, {useState, useEffect} from 'react';
import {Button, Divider, Portal, SegmentedButtons, Text, useTheme, ActivityIndicator} from "react-native-paper";
import Modal from "react-native-modal";
import {StyleSheet, View, Dimensions} from "react-native";

const LoadingModal = (props) => {
  const {colors} = useTheme();

  return (
    <View>
      {/* Rest of your component code */}
      
      <Modal
        statusBarTranslucent
        isVisible={props.isLoading}
        deviceHeight={Dimensions.get('screen').height}
        coverScreen={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: colors.surfaceVariant}]}>
                <Text style={[styles.text, {fontSize: 20}]}>Optimising route</Text>
                <Text style={[styles.text, {fontSize: 14}]}>Finding the best order...</Text>
                <Divider style={styles.divider}/>
            <   ActivityIndicator style={styles.indicator}  size={'large'} animating={true} color={colors.primary} />
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
    indicator: {
        paddingTop: 20
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

export default LoadingModal;
