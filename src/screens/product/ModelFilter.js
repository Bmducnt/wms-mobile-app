import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import { Feather} from '@expo/vector-icons';

import DatePickerBase from '../../components/Datepicker';
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../../helpers/device-height';
import { colors, device, gStyle } from "../../constants";

const ModelFilter = props => {
  const [listData,setlistData] = useState(props.listData);
  const [isDatePickerVisiblex,setisDatePickerVisiblex] = useState(false);
  const [tabSelect,settabSelect] = useState(null);
  const [fromTimeFilter,setfromTimeFilter] = useState(props.from_time);
  const onConfirm = (code) =>{
    setisDatePickerVisiblex(false);
    setfromTimeFilter(_convertDatetimeToTimestamp(code));
  }
  const renderObjDate = (obj) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            onPress={()=>settabSelect(obj.tab)}
            style={{
                flexDirection: "row",
                paddingVertical:10,
                backgroundColor:colors.whiteBg,
                width: "100%",
                borderBottomWidth:1,
                borderBottomColor:'#f0f1f6',
            }}
        >
            <View style={gStyle.flexRow}>
                <View style={[gStyle.flexCenter,{ width: 65,
                        marginRight:5,
                    }]}>
                    <Feather color={tabSelect ===obj.tab ? colors.brandPrimary:colors.black70} name={obj.icon} size={24}/>
                </View>
                <View style={{width:Dimensions.get("window").width-90,paddingVertical:6}}>
                    <View style={[gStyle.flexRowSpace]}>
                        <Text style={[styles.textValue,{color:tabSelect ===obj.tab ? colors.brandPrimary:colors.black70}]}>{props.t(obj.title)}</Text>
                    </View>
                    
                </View>
                
            </View>
            
        </TouchableOpacity>
      )
  }
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={true}
    >
        <TouchableWithoutFeedback
            >
            <View style={{
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center',
                position:'absolute',
                bottom:0
            }}>
                <View style={{
                    height: 450,
                    width: Dimensions.get("window").width ,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexRowSpace,{
                        paddingVertical:10,
                        paddingHorizontal:15,
                        borderTopLeftRadius:5,
                        borderTopRightRadius:5,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1.5,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <Text>{props.t('screen.module.product.filter')}</Text>
                        <TouchableOpacity 
                            onPress={() => props.onClose()}
                            activeOpacity={gStyle.activeOpacity}
                        >
                            <Feather color={colors.black70} name='chevron-down' size={26}/>
                        </TouchableOpacity>
                    
                    </View>
                    
                    <View style={[gStyle.flexRow,{paddingBottom:20}]}>
                        <FlatList
                            data={listData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                renderObjDate(item)
                            )}
                        />
                    </View>
                    <Text style={[styles.textLabel,{marginHorizontal:15}]}>{props.t('screen.datetimepicker.text_begin')}</Text>
                    <View style={[gStyle.flexRow,{marginHorizontal:15}]}>
                            
                        <TouchableOpacity 
                            onPress={() => setisDatePickerVisiblex(true)}
                            activeOpacity={gStyle.activeOpacity}
                            style={[gStyle.flexRowSpace,
                                {
                                    width:'100%',
                                    borderRadius:6,
                                    marginTop:8,
                                    height:50,
                                    paddingHorizontal:10,
                                    backgroundColor:colors.whiteBg
                                }
                            ]}
                            >
                            <Text style={{
                                color:colors.black,
                                ...gStyle.textBoxme16,
                                paddingLeft:5
                            }}>{_getDatetimeToTimestamp(fromTimeFilter)}</Text>
                            <Feather color={colors.greyInactive} name="calendar" size={26} />
                        </TouchableOpacity>
                    </View>
                    <DatePickerBase
                        isDatePickerVisible = {isDatePickerVisiblex}
                        typeLoad = {false}
                        trans = {props.t}
                        headerText ={props.t('screen.datetimepicker.text_begin')}
                        onCancel= {setisDatePickerVisiblex}
                        onConfirm={onConfirm}
                        >
                    </DatePickerBase>      
                    <View style={[gStyle.flexRow,{marginTop:20,paddingHorizontal:15}]}>
                        <TouchableOpacity style={[styles.bottomButton]} 
                            onPress={() => props.onSelect(tabSelect,fromTimeFilter)}>
                            {!props.isLoading ? <Text style={styles.textButton}>
                                {props.t('base.search')}
                            </Text>:<ActivityIndicator/>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'100%',
        paddingVertical:15,
        borderRadius:6,
        backgroundColor:colors.darkgreen
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxmeBold14,
    },
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme16,
        color:colors.black70
    },
});
export default ModelFilter;