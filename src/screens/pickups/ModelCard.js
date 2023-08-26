import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,
    StyleSheet
} from "react-native";
import { AntDesign} from '@expo/vector-icons';
import TextInputComponent from '../../components/TextInputComponent';
import {
    _getTimeDefaultFrom,
    _getTimeDefaultTo
} from '../../helpers/device-height';

import { 
    colors, 
    device, 
    gStyle 
} from "../../constants";


const ModelCard = props => {
    const [xeCode, setxeCode] = React.useState(null);

    React.useEffect(() => {
    }, []);

    const onScanCamera = async (code) => {
        if (code){
            setxeCode(code);
        }
    };

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={props.visible}
        >
            <View style={[gStyle.container,{backgroundColor:'#f6f7f7'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:15,
                    paddingHorizontal:15,
                }]}>

                    <Text >
                        {props.t("screen.module.pickup.by_sot.header")}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => props.onClose()}
                        style={gStyle.flexRowSpace}
                        activeOpacity={gStyle.activeOpacity}
                    >
                        <AntDesign name="closecircle" size={22} color={colors.greyInactive} />
                    </TouchableOpacity>
                    
                </View>
                <View>
                <View style={{marginTop:30,marginHorizontal:10}}>
                    <View style={{paddingHorizontal:15}}>
                        <Text>{props.t("screen.module.pickup.by_sot.help1")}</Text>
                        <Text style={{paddingVertical:3}}>{props.t("screen.module.pickup.by_sot.help2")}</Text>
                        <Text style={{paddingVertical:3}}>{props.t("screen.module.pickup.by_sot.help3")}</Text>
                    </View>
                    <TextInputComponent
                        navigation={props.navigation}
                        textLabel = {props.t("screen.module.pickup.by_sot.input")}
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
                    <View style={[gStyle.flexCenter,{marginTop:20}]}>
                        <TouchableOpacity disabled={!xeCode} style={[styles.bottomButton,
                                {borderRadius:3,backgroundColor:colors.boxmeBrand}]} 
                            onPress={() => {props.onSubmit(xeCode)}
                            }>
                            <Text style={styles.textButton}>
                            {props.t("screen.module.pickup.by_sot.btn_by_sot")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[gStyle.flexCenter,{marginTop:30}]}>
                        <Text>hoặc</Text>
                </View>
                <View style={{marginTop:30,marginHorizontal:10}}>
                    <View style={[gStyle.flexCenter]}>
                        <TouchableOpacity style={[styles.bottomButton,
                                {borderRadius:3,backgroundColor:colors.darkgreen}]} 
                            onPress={() => {props.onSubmit(xeCode)}
                            }>
                            <Text style={styles.textButton}>
                            {props.t("screen.module.pickup.by_sot.btn_by_item")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
export default ModelCard;