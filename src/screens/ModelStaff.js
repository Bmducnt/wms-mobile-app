import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    FlatList
} from "react-native";
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../helpers/device-height';
import { colors, device, gStyle } from "../constants";

const ModelFilterStaff = props => {
  return (
    <Modal
        animationType="slide"
        transparent={false}
        presentationStyle="formSheet"
        visible={props.isVisible}
    >
        <View style={[gStyle.container]}>
            <View style={[gStyle.flexRowSpace,{
                paddingVertical:18,
                paddingHorizontal:15,
                backgroundColor:colors.cardLight
            }]}>
                <TouchableOpacity 
                    onPress={() => props.onClose(false)}
                    activeOpacity={gStyle.activeOpacity}
                >
                    <Text style={[styles.textValue,{...gStyle.textBoxme16}]}>{props.t('base.back')}</Text>
                </TouchableOpacity>
                <Text style={{...gStyle.textBoxmeBold14,color:colors.brandPrimary}}>{props.rightText}</Text>
            </View>
            <View style={[gStyle.flexRow,{marginTop:10,paddingBottom:80}]}>
                
            <FlatList
                data={props.listData}
                keyExtractor={({ staff_id }) => staff_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.onSelect(item.staff_id)} 
                        key={item.staff_id}
                        style={[gStyle.flex1,{
                        marginHorizontal:10,
                        marginVertical:3
                    }]}>
                            <View style={gStyle.flexRowSpace}>
                                <Text style={{ marginLeft: 3, color: colors.greyInactive , ...gStyle.textBoxme14 }}>
                                {props.t('screen.module.staff_report.text_email')}
                                </Text>
                                <Text style={{ color:  colors.greyInactive, ...gStyle.textBoxme14 }}>
                                    Đã đóng gói
                                </Text>
                            </View>
                            <View style={gStyle.flexRowSpace}>
                                <Text style={{ marginLeft: 3, color: colors.white , ...gStyle.textBoxme14 }}>
                                    {item.fullname} 
                                </Text>
                                <Text style={{ color:  colors.white, ...gStyle.textBoxmeBold14 }}>{item.value.toLocaleString()}</Text>
                            </View>
                            <View style={{
                                height:2,
                                marginTop:5,
                                backgroundColor:colors.cardLight
                            }} />
                    </TouchableOpacity>
                )}
            />
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    containerBottom:{
        position: 'absolute',
        width:'100%',
        backgroundColor:colors.blackBg,
        bottom: device.iPhoneNotch ? 10 : 0
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'92%',
        paddingVertical:15,
        marginHorizontal:15,
        borderRadius:6,
        backgroundColor:colors.boxmeBrand
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxme16,
    },
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme16,
        color:colors.white
    },
});
export default ModelFilterStaff;