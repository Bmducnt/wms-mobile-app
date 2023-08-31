import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,StyleSheet,
    ActivityIndicator,
    FlatList
} from "react-native";
import {
    Feather,
    AntDesign,
    Ionicons
} from '@expo/vector-icons';
import DatePickerBase from '../../components/Datepicker';
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../../helpers/device-height';
import { colors, device, gStyle } from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const list_date_search = [
    { "id": 0, "icon": "circle", "title": "screen.module.packed.time_now","tab" :86820,"colorActive" :"#ea6c45"},
    { "id": 1, "icon": "circle", "title": "screen.module.packed.time_7","tab" :691200,"colorActive" :"#ea6c45"},
    { "id": 2, "icon": "circle", "title": "screen.module.packed.time_14","tab" :1296000,"colorActive" :"#e69c40"},
    { "id": 3,"icon": "circle","title": "screen.module.packed.time_1_m","tab" :2678400,"colorActive" :"#6297eb"}
  ]

const ModelDate = props => {
  const [listData,setlistData] = useState(list_date_search);
  const [tabSelect,settabSelect] = useState(null);
  const [fromTime,setfromTime] = useState(props.fromTime);
  const [toTime,settoTime] = useState(props.toTime);
  const [isLoadTime,setisLoadTime] = useState(false);
  const [isDatePickerVisiblex,setisDatePickerVisiblex] = useState(false);
  const [isDatePickerVisibley,setisDatePickerVisibley] = useState(false);
  const tabonConfirm = (code) =>{
    settabSelect(code);
    setfromTime(props.toTime-code)
  };
  const onConfirm = (code) =>{
    if (code !== 'N/A' && code !== 'None'){
      if(isDatePickerVisiblex){
          try {
            setfromTime(_convertDatetimeToTimestamp(code));
          }
          catch (err){
              console.log(err)
          }
          setisDatePickerVisiblex(false);
        }
        if(isDatePickerVisibley){
          try {
            settoTime(_convertDatetimeToTimestamp(code));
          }
          catch (err){
              console.log(err)
          }
          setisDatePickerVisibley(false);
        }
    }

}

  const renderObjDate = (obj) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            onPress={()=>tabonConfirm(obj.tab)}
            style={{
                flexDirection: "row",
                marginHorizontal:10,
                marginVertical:6
            }}
        >
            <View style={[gStyle.flexRow,{
                    paddingHorizontal:10,
                    paddingVertical:10,
                    borderRadius:6,
                    backgroundColor:tabSelect ===obj.tab ? colors.brandPrimary:colors.white}]}>
                <View style={[gStyle.flexCenter]}>
                    <Feather color={tabSelect ===obj.tab ? colors.white:colors.black70}
                        name={tabSelect ===obj.tab ?  'check-circle':obj.icon} size={14}/>
                </View>
                <View style={{paddingVertical:6,marginLeft:5}}>
                    <Text style={[styles.textValue,{color:tabSelect ===obj.tab ? colors.white:colors.black}]}>{props.t(obj.title)}</Text>

                </View>

            </View>

        </TouchableOpacity>
      )
  }
  return (
    <Modal
        animationType="slide"
        transparent={false}
        presentationStyle="formSheet"
        visible={props.isVisible}
    >
            <View style={[gStyle.container,{backgroundColor:'#f0f1f6'}]}>
                <View style={{
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,

                }}>
                    <View style={[{
                        paddingVertical:15,
                        paddingHorizontal:10,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <View style={gStyle.flexRowSpace}>
                            <TouchableOpacity
                                onPress={() => props.onClose()}
                                activeOpacity={gStyle.activeOpacity}
                            >
                                <Ionicons color={colors.black70} name='close' size={24}/>
                            </TouchableOpacity>
                            <Text style={[styles.textValue,{...gStyle.textBoxme16}]}>{translate('screen.module.pickup.detail.time_filter')}</Text>
                            <Text style={[styles.textLabel]}></Text>
                        </View>
                    </View>
                    <Text style={[styles.textLabel,{marginVertical:15,paddingHorizontal:10,...gStyle.textBoxmeBold14}]}>{translate('screen.module.pickup.detail.time_filter_sugget')}</Text>

                    <View>
                        <FlatList
                            numColumns={Math.ceil(listData.length / 2)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={listData}
                            keyExtractor={(item, index) => item +index.toString()}
                            renderItem={({ item }) => (
                                renderObjDate(item)
                            )}
                        />
                    </View>
                    <View style={{
                            paddingHorizontal:10,
                            marginTop:20
                        }}>
                        <Text style={styles.textLabel}>{translate('screen.module.pickup.detail.from_time')}</Text>
                        <View style={[gStyle.flexRow]}>

                            <TouchableOpacity
                                onPress={() => setisDatePickerVisiblex(true)}
                                activeOpacity={gStyle.activeOpacity}
                                style={[gStyle.flexRowSpace,
                                    {
                                        width:'100%',
                                        borderRadius:6,
                                        marginTop:4,
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
                                }}>{_getDatetimeToTimestamp(fromTime)}</Text>
                                <AntDesign color={colors.black70} name="calendar" size={24} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.textLabel,{marginTop:10}]}>{translate('screen.module.pickup.detail.to_time')}</Text>
                        <View style={[gStyle.flexRow]}>
                            <TouchableOpacity
                                onPress={() => setisDatePickerVisibley(true)}
                                activeOpacity={gStyle.activeOpacity}
                                style={[gStyle.flexRowSpace,
                                    {
                                        width:'100%',
                                        borderRadius:6,
                                        marginTop:4,
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
                                }}>{_getDatetimeToTimestamp(toTime)}</Text>
                                <AntDesign color={colors.black70} name="calendar" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <DatePickerBase
                    isDatePickerVisible = {isDatePickerVisiblex}
                    typeLoad = {isLoadTime}
                    headerText ={translate('screen.module.pickup.detail.from_time')}
                    onCancel= {setisDatePickerVisiblex}
                    onConfirm={onConfirm}
                />
                <DatePickerBase
                    isDatePickerVisible = {isDatePickerVisibley}
                    typeLoad = {isLoadTime}
                    headerText ={translate('screen.module.pickup.detail.to_time')}
                    onCancel= {setisDatePickerVisibley}
                    onConfirm={onConfirm}
                />
                <View style={[gStyle.flexCenter,styles.containerBottom]}>
                    <TouchableOpacity style={[styles.bottomButton]}
                        onPress={() => props.onSelect(fromTime,toTime)}>
                        {!props.isLoading ? <Text style={styles.textButton}>
                            {translate('base.search')}
                        </Text>:<ActivityIndicator/>}
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
        bottom: device.iPhoneNotch ? 10 : 0
    },
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'90%',
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
        color:colors.black70
      },
    textValue :{
        ...gStyle.textBoxme14,
        color:colors.black
    },
});
export default ModelDate;
