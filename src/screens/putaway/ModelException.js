import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,StyleSheet
} from "react-native";
import { FontAwesome} from '@expo/vector-icons';
import TextInputComponent from '../../components/TextInputComponent';
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../../helpers/device-height';
import { colors, device, gStyle } from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const ModelException = props => {
  const [quantity_error, setquantity_error] = React.useState(0);

  return (
    <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={props.visible}
    >
        <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>

            <View style={[gStyle.flexRowSpace,{
                        paddingVertical:14,
                        paddingHorizontal:10,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1
                    }]}>
                        <Text>{translate('screen.module.pickup.detail.text_confirm_stock_btn')}</Text>
                        <TouchableOpacity
                            onPress={() => props.onClose(false)}
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              width:30,
                              height:30,
                              borderRadius:30/2,
                              backgroundColor:colors.greyInactive
                          }}
                            activeOpacity={gStyle.activeOpacity}
                        >
                            <FontAwesome name="close" size={20} color={colors.white} />

                        </TouchableOpacity>

                    </View>
            <View>
                <TextInputComponent
                    navigation={props.navigation}
                    textLabel = {translate('screen.module.pickup.detail.exception_input_text')}
                    inputValue = {'0'}
                    keyboardType={'numeric'}
                    autoChange = {true}
                    ediTable={true}
                    autoFocus={true}
                    showSearch = {false}
                    showScan = {false}
                    onPressCamera = {setquantity_error}
                    onSubmitEditingInput = {setquantity_error}
                    textPlaceholder={''}>
                </TextInputComponent>
            </View>
            <View style={[gStyle.flexRowCenter,{marginTop:20}]}>
                <TouchableOpacity style={[styles.bottomButton,
                        {borderRadius:3,width:"45%",backgroundColor:colors.primary}]}
                    onPress={() => {props.onSubmit(quantity_error,'LOST_ITEM')}
                    }>
                    <Text style={styles.textButton}>
                    {translate('screen.module.pickup.detail.exception_btn_out')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton,
                        {backgroundColor :colors.boxmeBrand,
                        borderRadius:3,width:"45%"}]}
                    onPress={() => {props.onSubmit(quantity_error,'OVER_ITEM')}
                    }>
                    <Text style={[styles.textButton]}>
                    {translate('screen.module.pickup.detail.exception_btn_over')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    containerBottom:{
        position: 'absolute',
        width:'100%',
        bottom: device.iPhoneNotch ? 20 : 0
      },
      bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'92%',
        paddingVertical: 13,
        marginHorizontal:5,
        borderRadius:6,
        backgroundColor: colors.boxmeBrand,
      },
      textButton :{
          textAlign:'center',
          color:colors.white,
          ...gStyle.textBoxme14,
      },
});
export default ModelException;
