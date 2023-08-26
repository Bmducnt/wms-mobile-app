import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions,
    Alert
} from "react-native";
import { Feather} from '@expo/vector-icons';
import DatePickerBase from './Datepicker';
import TextInputComponent from './TextInputComponent';

import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp,_getTimeDefaultTo} from '../helpers/device-height';
import { colors, gStyle } from "../constants";

//
import findDetailFnskuMove from '../services/products/find';

const BottomModal = props => {
  const [isDatePickerVisibley,setisDatePickerVisibley] = useState(false);
  const [isLoadTime,setisLoadTime] = useState(false);
  const [outboundType,setoutboundType] = useState(props.outboundType);
  const [batchControl,setbatchControl] = useState(props.batchControl);
  const [batchControlCode,setbatchControlCode] = useState(null);
  const [tabSelect,settabSelect] = useState(null);
  const [expireDate,setexpireDate] = useState(null);
  const [listData,setlistData] = useState([]);

  const findListExpried = async () =>{
    const response = await findDetailFnskuMove(props.trackingCode,{'check_expried' :1});
    if (response.status === 403){
      permissionDenied(this.props.navigation);
    };
    if (response.status === 200){
        setlistData(response.data.results)
    }
  }

  useEffect(() => {
    findListExpried()
  }, [])

  const onConfirm = (code) =>{
      if (code !== 'N/A' && code !== 'None'){
          if(_convertDatetimeToTimestamp(new Date(code)) <= _getTimeDefaultTo()){
            Alert.alert(
                '',
                props.t('screen.module.pickup.detail.expire_date_err'),
                [
                  {
                    text: props.t("base.confirm"),
                    onPress: () => setisDatePickerVisibley(false),
                  },
                ],
                {cancelable: false},
            );
            return true;
          }else{
            setexpireDate(_convertDatetimeToTimestamp(new Date(code)));
            setisDatePickerVisibley(false);
          }
          
      }
    
  }

  const onSubmit = async (expire_date) => {
      if (batchControl === 1){
        if(!batchControlCode){
            Alert.alert(
                '',
                props.t('screen.module.pickup.detail.lot_err'),
                [
                  {
                    text: props.t("base.confirm"),
                    onPress: null,
                  },
                ],
                {cancelable: false},
            );
            return true;
        }
      }
      if (outboundType === 2){
        if (expire_date !== 'N/A' && expire_date !== 'None'){
            if(expire_date <= _getTimeDefaultTo()){
                Alert.alert(
                    '',
                    props.t('screen.module.pickup.detail.expire_date_err'),
                    [
                      {
                        text: props.t("base.confirm"),
                        onPress: null,
                      },
                    ],
                    {cancelable: false},
                );
                return true;
            }else{
                props.onSubmit(expire_date,batchControlCode)
            }
        }
      }else{
        props.onSubmit(expire_date,batchControlCode)
      }
    
  }

  const onSelectDateSugget = async (tab_m) => {
    settabSelect(tab_m);
    setexpireDate(_convertDatetimeToTimestamp(new Date(tab_m)));
  }

  const onOpenDatimePicker = async () => {
    setisDatePickerVisibley(true)
  }

  const renderObjSugget = (item) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            onPress={()=>onSelectDateSugget(item.expire_date)}
            style={{
                marginVertical:6,
            }}
        >
            <View style={[gStyle.flexRow,{
                    paddingHorizontal:10,
                    paddingVertical:10,
                    borderRadius:6,
                    backgroundColor:colors.white}]}>
                <View style={[gStyle.flexCenter]}>
                    <Feather color={tabSelect ===item.expire_date ? colors.darkgreen:colors.black70} 
                        name={tabSelect ===item.expire_date ?  'check-circle':'circle'} size={14}/>
                </View>
                <View style={{paddingVertical:6,marginLeft:5}}>
                    <Text style={[styles.textValue,{color:colors.black}]}>
                        {item.expire_date}
                    </Text>
                    
                </View>
                
            </View>
            
        </TouchableOpacity>
      )
  };
  
  return (
    <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={true}
    >
        <TouchableWithoutFeedback
            >
            <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                <View style={{
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexRowSpace,{
                        paddingVertical:14,
                        paddingHorizontal:15,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1.5,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <Text style={{color:colors.blackBlur}}>{props.t('screen.module.pickup.detail.list_expried')}</Text>
                        <TouchableOpacity 
                            onPress={() => props.onCloseModel()}
                            activeOpacity={gStyle.activeOpacity}
                            style={gStyle.flexCenter}
                        >
                            <Feather color={colors.blackBlur} name='chevron-down' size={20}/>
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={[styles.textLabel,{
                            paddingHorizontal:15,
                            marginBottom:-10
                        }]}>{props.t('screen.module.cycle_check.update.label_quantity')}</Text>
                        <TextInputComponent
                            navigation={props.navigation}
                            textLabel = {null}
                            keyboardType={'numeric'}
                            ediTable={true}
                            autoChange = {true}
                            autoFocus={true}
                            showSearch = {false}
                            showScan = {false}
                            onPressCamera = {props.onSetQuantity}
                            onSubmitEditingInput = {props.onSetQuantity}
                            textPlaceholder={''}
                        />
                    </View>
                    {batchControl === 1 && 
                    <View style={{marginTop:10}}>
                        <Text style={[styles.textLabel,{
                            paddingHorizontal:15,
                            marginBottom:-10
                        }]}>Batch/lot code</Text>
                        <TextInputComponent
                            navigation={props.navigation}
                            textLabel = {null}
                            ediTable={true}
                            autoChange = {true}
                            autoFocus={false}
                            showSearch = {true}
                            showScan = {true}
                            onPressCamera = {setbatchControlCode}
                            onSubmitEditingInput = {setbatchControlCode}
                            textPlaceholder={''}
                        />
                    </View>}
                    {outboundType === 2 && <View style={{
                        paddingHorizontal:15,
                        marginTop:10
                    }}>
                        {listData.length > 0 && <View >
                            <Text style={[styles.textLabel,{marginTop:10}]}>{props.t('screen.module.pickup.detail.list_expried')}(YYYY-MM-DD)</Text>
                            <FlatList
                                numColumns={Math.ceil(listData.length / 2)}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={listData}
                                keyExtractor={(item, index) => item.id +index.toString()}
                                renderItem={({ item }) => (
                                    renderObjSugget(item)
                                )}
                            />
                        </View> }
                        <Text style={[styles.textLabel,{marginTop:10}]}>{props.t('screen.module.pickup.detail.expire_date')}</Text>
                        <View style={[gStyle.flexRow]}>
                            <TouchableOpacity 
                                onPress={() => onOpenDatimePicker()}
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
                                }}>{_getDatetimeToTimestamp(expireDate)}</Text>
                                <Feather color={colors.greyInactive} name="calendar" size={26} />
                            </TouchableOpacity>
                        </View>
                    </View>}
                    <DatePickerBase
                        isDatePickerVisible = {isDatePickerVisibley}
                        typeLoad = {isLoadTime}
                        trans = {props.t}
                        headerText ={props.t('screen.module.pickup.detail.expire_date')}
                        onCancel= {setisDatePickerVisibley}
                        onConfirm={onConfirm}
                    />

                    <View style={[gStyle.flexRow,{marginTop:20,paddingHorizontal:15}]}>
                        <TouchableOpacity style={[styles.bottomButton,{backgroundColor:colors.darkgreen}]} 
                            onPress={() => onSubmit(expireDate)}>
                            {!props.isLoading ? <Text style={styles.textButton}>
                                {props.t('screen.module.pickup.detail.btn_accept')}
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
        backgroundColor:colors.boxmeBrand
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
export default BottomModal;