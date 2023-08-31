import React, { useRef,memo } from "react";
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { colors, gStyle } from "../constants";
import CountDown from './CountDown';
import {translate} from "../i18n/locales/IMLocalized";

const ModelTasksRc = props => {

    const [modalVisible, setmodalVisible] = React.useState(props.modalVisible);

    const onPressMenu = () =>{
      setmodalVisible(false)
      props.navigation.navigate("ListTasks",{})
    }

    return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setmodalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <CountDown
                    until={10}
                    timeToShow={[ 'S']}
                    onFinish={() => setmodalVisible(false)}
                    onPress={() => setmodalVisible(false)}
                    digitStyle={{backgroundColor: colors.yellow}}
                    digitTxtStyle={{color: colors.white}}
                    size={18}
                  />
                  <Text style={{
                    ...gStyle.textBoxme14
                  }}>{translate('screen.module.taks.alert1')}{" "}{translate('screen.module.taks.alert2')} </Text>
                  <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => onPressMenu()}>
                      <Text style={styles.textStyle}>{translate('screen.module.taks.btn_received')}</Text>
                  </Pressable>
                </View>
            </View>
            </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        marginTop:10,
        borderRadius: 4,
        paddingHorizontal: 13,
        paddingVertical:8,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: colors.darkgreen,
      },
      buttonClose: {
        backgroundColor:colors.darkgreen,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
})

export default memo(ModelTasksRc);
