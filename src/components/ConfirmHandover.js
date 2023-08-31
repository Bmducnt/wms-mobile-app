import React, { useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert
} from "react-native";
import {
    Entypo,
    FontAwesome5
  } from "@expo/vector-icons";
import TextInputComponent from "./TextInputComponent";
import ListDriverComponent from "./ListDriverComponent";
import {
    colors,
    gStyle
} from "../constants";
import {translate} from "../i18n/locales/IMLocalized";

const ConfirmHandover = props => {

  const [openListdriver,setopenListdriver] = useState(false);
  const [driverName,setdriverName] = useState(null);
  const [driverPhone,setdriverPhone] = useState(null);
  const [driverVehicle,setdriverVehicle] = useState(null);
  const [loading,setLoading] = useState(false);

  const getDriver = (driver_name,driver_phone,driver_vehicle) => {
    setdriverName(driver_name)
    setdriverPhone(driver_phone)
    setdriverVehicle(driver_vehicle)
    props.onSetName(driver_name);
    props.onSetPhone(driver_phone);
    props.onSetVehicle(driver_vehicle);
    setopenListdriver(false);
  };

  const  onUpload = async () =>{
    setLoading(true);
    await props.onUploadAsset()
    setLoading(false);
  }
  const showListDriver = ()=>{
      if (props.list_driver.length === 0){
        Alert.alert(
            '',
            translate('screen.module.handover.list_driver_empty'),
            [
              {
                text: translate("base.confirm"),
                onPress: () => null,
              }
            ],
            {cancelable: false},
        );
      }else{
        setopenListdriver(true)
      }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="formSheet"
      visible={true}
    >
        <View style={[gStyle.container]}>
            <View style={[gStyle.flexRowSpace,{
                paddingVertical:6,
                paddingHorizontal:15,
                backgroundColor:colors.cardLight
            }]}>
                <TouchableOpacity
                    onPress={() => props.onClose(false)}
                    activeOpacity={gStyle.activeOpacity}
                >
                    <Text style={[styles.textValue,{...gStyle.textBoxme16}]}>{translate('base.back')}</Text>
                    </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onUpload()}
                    activeOpacity={gStyle.activeOpacity}
                    style={[gStyle.flexRowCenter,{backgroundColor:colors.borderLight,borderRadius:6,paddingHorizontal:6}]}
                >
                    {!loading ? <FontAwesome5 name="photo-video" size={16} color={colors.boxmeBrand} /> : <ActivityIndicator/>}
                    <Text style={{...gStyle.textBoxme14,paddingVertical:12,paddingHorizontal:4,color:colors.boxmeBrand}}>{translate('screen.module.handover.upload_asset')}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[gStyle.flexRowSpace,{
                    backgroundColor:colors.cardLight,
                    marginTop:10,
                    paddingVertical:18,
                    marginHorizontal:10,
                    paddingHorizontal:15,
                    borderRadius:6,
                }]}
                onPress={() => showListDriver()}
                activeOpacity={gStyle.activeOpacity}
            >
                <Text style={{
                    ...gStyle.textBoxme14,
                    color:colors.white
                }} >
                    {translate('screen.module.handover.list_driver_name')}
                </Text>
                <Entypo name="arrow-long-right" size={14} color={colors.white} />
            </TouchableOpacity>
            {!openListdriver && <View style={[gStyle.flexRow,{marginTop:10}]}>
                <TextInputComponent
                    navigation={props.navigation}
                    labeView={false}
                    textLabel={translate("screen.module.handover.driver_name")}
                    autoFocus={false}
                    showSearch = {false}
                    showScan = {false}
                    autoChange = {true}
                    heightInput= {46}
                    inputValue ={driverName}
                    onPressCamera={props.onSetName}
                    onSubmitEditingInput={props.onSetName}
                    textPlaceholder={`${translate("screen.module.handover.driver_name")} ...`}
                />
            </View>}

            {!openListdriver && <View style={[gStyle.flexRow,{marginTop:10}]}>
                <TextInputComponent
                    navigation={props.navigation}
                    labeView={false}
                    keyboardType={'numeric'}
                    showSearch = {false}
                    showScan = {false}
                    autoChange = {true}
                    inputValue ={driverPhone}
                    heightInput= {46}
                    textLabel={translate("screen.module.handover.driver_phone")}
                    autoFocus={false}
                    onPressCamera={props.onSetPhone}
                    onSubmitEditingInput={props.onSetPhone}
                    textPlaceholder={`${translate("screen.module.handover.driver_phone")} ...`}
                    />
            </View>}
            {!openListdriver && <View style={[gStyle.flexRow,{marginTop:10}]}>
                <TextInputComponent
                    navigation={props.navigation}
                    labeView={false}
                    inputValue ={driverVehicle}
                    textLabel={translate("screen.module.handover.driver_vehicle")}
                    autoFocus={false}
                    autoChange = {true}
                    showSearch = {false}
                    heightInput= {46}
                    showScan = {false}
                    onPressCamera={props.onSetVehicle}
                    onSubmitEditingInput={props.onSetVehicle}
                    textPlaceholder={`${translate("screen.module.handover.driver_vehicle")} ...`}
                />
            </View>}
            {openListdriver && <View style={[gStyle.flexRow,{marginTop:10,marginHorizontal:10}]}>
                <FlatList
                    data={props.list_driver}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ListDriverComponent
                            driver_phone={item.driver_phone}
                            driver_name = {item.driver_name}
                            driver_vehicle = {item.driver_vehicle}
                            onSelect ={getDriver}
                        />
                    )}
                />
                <View style={gStyle.spacer11} />
                <View style={gStyle.spacer11} />
            </View>}
            {openListdriver &&<View style={[gStyle.flexRow,{marginTop:20}]}>
                <TouchableOpacity style={[styles.bottomButton]}
                    onPress={() => setopenListdriver(false)}>
                    {!props.isLoading ? <Text style={styles.textButton}>
                        {translate('screen.module.handover.list_driver_back')}
                    </Text>:<ActivityIndicator/>}
                </TouchableOpacity>
            </View>}
            {!openListdriver &&<View style={[gStyle.flexRow,{marginTop:20}]}>
                <TouchableOpacity style={[styles.bottomButton]}
                    onPress={() => props.onConfirm()}>
                    {!props.isLoading ? <Text style={styles.textButton}>
                    {translate('screen.module.handover.btn_end_step')}
                    </Text>:<ActivityIndicator/>}
                </TouchableOpacity>
            </View>}
        </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
    bottomButton :{
        justifyContent: 'center',
        alignContent:'center',
        width:'92%',
        paddingVertical:15,
        marginHorizontal:15,
        borderRadius:6,
        backgroundColor:colors.darkgreen
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxmeBold14,
    },
    textValue :{
        ...gStyle.textBoxmeBold16,
        color:colors.white
    },

});
export default ConfirmHandover;
