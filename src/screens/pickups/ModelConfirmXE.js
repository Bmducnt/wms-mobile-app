import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    TextInput,
    Alert
} from "react-native";
import * as Print from "expo-print";

import { AntDesign} from '@expo/vector-icons';
import TextInputComponent from '../../components/TextInputComponent';
import {
    _getTimeDefaultFrom,
    _getTimeDefaultTo
} from '../../helpers/device-height';

import {
    handleSoundScaner,
    handleSoundOkScaner
} from '../../helpers/async-storage';
import putErrorPickup from '../../services/pickup/log';
import getListFnsku from '../../services/products/list';
import { 
    colors, 
    device, 
    gStyle 
} from "../../constants";
import getSummaryPickup from "../../services/pickup/summary";


const ModelConfirmXE = props => {
    const bsinScan = [];

    const layout = useWindowDimensions();
    const [xeCode, setxeCode] = React.useState(null);
    const [summaryData, setsummaryData] = React.useState([]);
    const [totalbsinScan,settotalbsinScan] = React.useState(0);
    const [totalSold,settotalSold] = React.useState(0);
    const [quantityScan,setquantityScan] = React.useState('1');

    React.useEffect(() => {
        findSummaryPKService(props.pickup_id);
    }, []);


    const findProducts = async  (code) =>{
        const response = await getListFnsku({
            'from_time': _getTimeDefaultFrom(),
            'to_time': _getTimeDefaultTo(),
            'tab': 'all',
            'page':1,
            'q' : code
        });
        if (response.status === 200){
            if (response.data.results?.length > 0){
                const item = summaryData?.items.find(element => element.sku === response.data.results[0]?.bsin);
                if (item) {
                    item.active = colors.greyLight;
                    item.idx = 1;
                    item.scan = parseInt(item.scan) + parseInt(quantityScan);
                    const sold = parseInt(totalSold) + parseInt(quantityScan);
                    settotalSold(sold);
                    if (!bsinScan.includes(item.sku)) {
                        bsinScan.push(item.sku);
                        settotalbsinScan(totalbsinScan => totalbsinScan + 1)
                    }
                    handleSoundOkScaner();
                    
                } else {
                    summaryData.items.forEach(element => {
                        element.idx = 2;
                        element.active = colors.white;
                    });
                }
                summaryData.items = summaryData.items.sort((a, b) => a.idx - b.idx);
                if (!item) {
                    handleSoundScaner();
                    return;
                }
            }else{
                handleSoundScaner();
            }
            
        }
    };

    printPdf = async (path) => {
        try {
          await Print.printAsync({
            uri: encodeURI(path),
          });
        } catch (error) {
          console.log("error:", error);
        }
    };
    
    const putComfirmError = async ()=>{
        let status_code = "OK"
        if (totalSold > summaryData?.total_sold){
            status_code = "OVER_STOCK"
        };

        if (totalSold < summaryData?.total_sold){
            status_code = "OUT_STOCK"
        };

        const response = await putErrorPickup(props.pickup_code,JSON.stringify({
            staff_error: null,
            status_code: status_code,
            quantity_error: totalSold,
            data_scan : summaryData?.items
            
        }));
        if (response.status === 200) {
          handleSoundOkScaner();
          Alert.alert(
              '',
              props.t('screen.module.putaway.text_ok'),
              [
                {
                  text: props.t('base.confirm'),
                  onPress: () => {props.onClose(false)},
                }
              ],
              {cancelable: false},
          );
        }
    };


    const onSubmitQuantityScan = async (val) => {
        if (Number.isInteger(parseInt(val))){
            setquantityScan(val);
        }
    }

    const findSummaryPKService = async (pickup_id) => {
        const response = await getSummaryPickup(pickup_id);
        if (response.status === 200) {
            setsummaryData(response.data.results);
        }
    }


    const onScanCamera = async (code) => {
        if (code){
            setxeCode(code);
        }
    };

    const handlerScan = (code) =>{
        findProducts(code);
        
    }

    const renderConfirmXe = () =>{
        return (
            <View>
                <View style={{marginTop:30}}>
                    <TextInputComponent
                        navigation={props.navigation}
                        textLabel = {props.t('screen.module.pickup.detail.box_master')}
                        autoFocus={true}
                        autoChange = {true}
                        ediTable={true}
                        showSearch = {true}
                        showScan = {true}
                        value={xeCode}
                        onPressCamera = {onScanCamera}
                        onSubmitEditingInput = {onScanCamera}
                        textPlaceholder={''}>
                    </TextInputComponent>
                </View>
                <View style={[gStyle.flexCenter,{marginTop:20}]}>
                    <TouchableOpacity style={[styles.bottomButton,
                            {borderRadius:3,backgroundColor:colors.primary}]} 
                        onPress={() => {props.onSubmit(xeCode)}
                        }>
                        <Text style={styles.textButton}>
                        {props.t('screen.module.pickup.detail.text_confirm_ok_btn')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderConfirmCount = () =>{
        return (
            <ScrollView>
                <View style={{marginTop:15}}>
                    <View style={gStyle.flexRow}>
                        <View style={{width:'29%',marginRight:5}}>
                            <Text style={{
                                color:colors.greyInactive,
                                ...gStyle.textBoxme12,
                                marginLeft:15
                            }}>{props.t('screen.module.pickup.detail.quantity_out')}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => null}
                                style={{
                                    height:50,
                                    alignItems: 'center',
                                    backgroundColor: colors.whiteBg,
                                    borderRadius: 6,
                                    flexDirection: 'row',
                                    paddingLeft: 10,
                                    width:'100%',
                                    marginTop:4,
                                    marginLeft:15,
                                }}
                            >
                                <TextInput
                                    onChangeText={onSubmitQuantityScan}
                                    value={quantityScan}
                                    keyboardType={'numeric'}
                                    style={{
                                        ...gStyle.textBoxme14,
                                        color: colors.black,
                                        width:'88%',
                                        paddingHorizontal:10
                                    }}
                                />
                            </TouchableOpacity>

                        </View>
                        <View style={{width:'70%'}}>
                            <TextInputComponent
                            
                                navigation={props.navigation}
                                autoFocus={true}
                                showSearch = {false}
                                textLabel = {props.t('screen.module.pickup.detail.fnsku_code')}
                                onPressCamera = {handlerScan}
                                onSubmitEditingInput = {handlerScan}
                                textPlaceholder={props.t('screen.module.pickup.detail.fnsku_scan')}/>
                        </View>
                    </View>
                </View>
                <View style={{
                    marginTop:10,
                    paddingVertical:6,
                    marginHorizontal:15,
                    backgroundColor:colors.whiteBg
                }}>
                    <View style={gStyle.flexRowCenter}>
                        <View style={[gStyle.flexCenter,{
                            width:layout.width/2.5,
                            paddingVertical:4,
                        }]}>
                            <Text style={{color:colors.greyInactive}}>{props.t('screen.module.pickup.detail.quantity_fnsku_scan')}</Text>
                            <View style={gStyle.flexRow}>
                                <Text style={{
                                    paddingTop:5,
                                    color:colors.black,
                                    ...gStyle.textBoxmeBold18
                                }}>{totalbsinScan}/</Text>
                                <Text style={{
                                    paddingTop:5,
                                    color:colors.darkgreen,
                                    ...gStyle.textBoxmeBold18
                                }}>{summaryData?.total_fnsku}</Text>
                            </View>
                        </View>
                        <View style={{width:2,backgroundColor:colors.greyInactive,height:45}} />
                        <View style={[gStyle.flexCenter,{
                            width:layout.width/2.5,
                            paddingVertical:4,
                        }]}>
                            <Text style={{color:colors.greyInactive}}>{props.t('screen.module.pickup.detail.quantity_item_scan')}</Text>
                            <View style={gStyle.flexRow}>
                                <Text style={{
                                    paddingTop:5,
                                    color:colors.black,
                                    ...gStyle.textBoxmeBold18
                                }}>{totalSold}/</Text>
                                <Text style={{
                                    paddingTop:5,
                                    color:colors.boxmeBrand,
                                    ...gStyle.textBoxmeBold18
                                }}>{summaryData?.total_sold}</Text>
                            </View>
                        </View>
                    </View>
                    {summaryData?.extra_service && <View style={[gStyle.flexRowSpace,{
                        paddingVertical:16,
                        backgroundColor : colors.boxmeBrand,
                        paddingHorizontal:10
                    }]}>
                        <Text style={{color:colors.black}}>Đơn hàng có dịch vụ vas</Text>
                        <TouchableOpacity style={{}} 
                        onPress={() => {printPdf(summaryData?.picking_list)}
                        }>
                            <Text >
                                In bảng kê lấy hàng
                            </Text>
                    </TouchableOpacity>
                    </View>}
                </View>
                <View style={{marginTop:10}}>
                    {summaryData?.items?.length >0 &&
                        summaryData?.items.map((item, index) => (
                            <View 
                                key={item.sku}
                                style={[gStyle.flexRowSpace,{
                                    marginVertical:2,
                                    marginHorizontal:15,
                                    paddingHorizontal:10,
                                    paddingVertical:6,
                                    backgroundColor: item?.active ? item?.active : colors.white
                                }]}
                            >
                                <View style={[{width:'90%'}]}>
                                    <Text style={{color:colors.black,...gStyle.textBoxme14}}><AntDesign name="barcode" size={14} color="black" /> {item.sku}</Text>
                                    <Text style={{color:colors.black70}} numberOfLines={2}>{item.name}</Text>
                                </View>
                                <View style={gStyle.flexRow}>
                                    <Text style={{
                                        paddingTop:5,
                                        color:colors.black,
                                        ...gStyle.textBoxmeBold14
                                    }}>{item.scan}/</Text>
                                    <Text style={{
                                        paddingTop:5,
                                        color:colors.boxmeBrand,
                                        ...gStyle.textBoxmeBold14
                                    }}>{item.sold}</Text>
                            </View>
                        </View>
                    ))}
                    
                </View>
                <View style={[gStyle.flexCenter,{marginTop:20}]}>
                    <TouchableOpacity style={[styles.bottomButton,
                            {borderRadius:3,backgroundColor:colors.primary}]} 
                        onPress={() => {putComfirmError()}
                        }>
                        <Text style={styles.textButton}>
                        {props.t('screen.module.pickup.detail.text_confirm_ok_btn')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }




    return (
        <Modal
            animationType="fade"
            presentationStyle="formSheet"
            visible={props.visible}
        >
            <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:15,
                    paddingHorizontal:15,
                }]}>

                    <Text >
                        {props.t('screen.module.pickup.detail.text_confirm_ok_btn')}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => props.onClose(false)}
                        style={gStyle.flexRowSpace}
                        activeOpacity={gStyle.activeOpacity}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    </TouchableOpacity>
                    
                </View>
                {props.index === 1 ? renderConfirmXe() : renderConfirmCount()}
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
        paddingVertical: 18,
        marginHorizontal:5,
        borderRadius:6,
        backgroundColor: colors.darkgreen,
    },
    textButton :{
        textAlign:'center',
        color:colors.white,
        ...gStyle.textBoxmeBold14,
    },
});
export default ModelConfirmXE;