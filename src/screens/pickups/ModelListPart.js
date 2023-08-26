import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Image
} from "react-native";
import { Feather,AntDesign,Octicons } from "@expo/vector-icons";

import { 
    colors, 
    device, 
    gStyle,
    images
} from "../../constants";


const ModelListPart = (props) => {
    const [listData,setlistData] = useState(props.data);

    const onSelect = async (val) =>{
        props.onSubmit(val);
        props.onClose(false);
    };



    const renderPickupItem = (obj) => {
        return (
            <View >
                <TouchableOpacity
                    activeOpacity={gStyle.activeOpacity}
                    onPress={() => onSelect(obj.part_id)}
                    style={[styles.container,{
                            backgroundColor:colors.whiteBg,
                            paddingVertical:8,
                            borderRadius:3,
                            marginVertical:5
                    }]}
                >
                    <View style={gStyle.flexRowSpace}>
                        <View style={gStyle.flexRow}>
                            <View >
                                <Text style={[styles.textCode, { ...gStyle.textBoxmeBold14 }]} 
                                    numberOfLines={1} ellipsizeMode="tail">
                                    {props.t('screen.module.handover.b2b_part_pk')} {obj.pickup_code}
                                </Text>
                                <View style={[styles.containerStatus]}>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black70 }]} numberOfLines={1}>
                                        {props.t('screen.module.handover.b2b_part_quantity')}
                                    </Text>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black,paddingLeft:3 }]} numberOfLines={1}>
                                        {obj.total}
                                    </Text>
                                </View>
                                <View style={[styles.containerStatus]}>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black70 }]} numberOfLines={1}>
                                    {props.t('screen.module.handover.b2b_vas')}{" "}
                                        <Octicons name={ obj.is_vas === 1 ? "check-circle-fill" : "blocked"} size={16} color={
                                            obj.is_vas === 1 ? colors.darkgreen : colors.red} /> 
                                    </Text>
                                </View>
                                <View style={[styles.containerStatus]}>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black70 }]} numberOfLines={1}>
                                    {props.t('screen.module.handover.b2b_status')}
                                    </Text>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:obj.is_available ? colors.darkgreen : colors.boxmeBrand,paddingLeft:3 }]} numberOfLines={1}>
                                        {!obj.is_available ? `${props.t('screen.module.handover.b2b_status_done')}` : 
                                        `${props.t('screen.module.handover.b2b_status_await')}`}
                                    </Text>
                                </View>
                                <View style={[styles.containerStatus]}>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black70 }]} numberOfLines={1}>
                                        {props.t('screen.module.handover.b2b_part_email')}
                                    </Text>
                                    <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.black,paddingLeft:3 }]} numberOfLines={1}>
                                        {obj.picker_by}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                    </View>
                    <View style={[styles.containerRight]}>
                        <View style={gStyle.flexRow}>
                            <View style={[gStyle.flexCenter,{height : 25,width:25,backgroundColor:colors.boxmeBrand,borderRadius:50}]}>
                                <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>{obj.part_id}</Text>
                            </View>
                            <Feather color={colors.greyInactive} name="chevron-right" size={22} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <Modal 
        animationType="slide"
        presentationStyle="formSheet"
        visible={true}
        >
        <TouchableWithoutFeedback style={gStyle.flex1}>
        <View style={[gStyle.container]}>
            <View
                style={{
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: "#f0f1f6"
            }}
            >
                <View
                style={[
                    gStyle.flexRowSpace,
                    {
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    borderBottomColor: "#f0f1f6",
                    borderBottomWidth: 1.5,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    backgroundColor: colors.whiteBg,
                    },
                ]}
                >
                    <Text>
                        {props.t('screen.module.handover.b2b_part_header')}
                    </Text>
                    <TouchableOpacity
                    onPress={() => props.onClose(false)}
                    activeOpacity={gStyle.activeOpacity}
                    style={gStyle.flexCenter}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    
                    </TouchableOpacity>
                </View>
                
                <View style={[gStyle.flexRow, { paddingBottom: 100,marginTop:10,marginHorizontal:5}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={listData}
                        keyExtractor={(item, index) => item +index.toString()}
                        renderItem={({ item }) => (
                            renderPickupItem(item)
                        )}
                    />
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginVertical: 0.5,
      width: '100%'
    },
    containerStatus: {
      marginLeft: 10,
      flexDirection: 'row'
    },
    percentBar: {
      height: 1,
      width: `100%`,
      marginLeft: device.iPhoneNotch ? '20%' : '22%',
      backgroundColor: colors.borderLight
    },
    textCode: {
      ...gStyle.textBoxme14,
      color: colors.black70,
      marginTop: 2,
      marginLeft: 10,
    },
    containerRight: {
      alignItems: 'flex-end',
      flex: 1
    },
    imageAvatar: {
      width: 45,
      height: 50,
      borderRadius:45
    },
    blockRight: {
      alignItems: 'flex-end',
      position: 'absolute',
      top: 60,
      right: 15,
    },
    textRight: {
      ...gStyle.textBoxme14,
      color: colors.black70
    }
  });
export default ModelListPart;
