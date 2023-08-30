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
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../../helpers/device-height';
import { colors, device, gStyle } from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const ModelPrinter = props => {


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
        ><TouchableWithoutFeedback
                >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position:'absolute',
                    bottom:0
                }}>
                    <View style={{
                        height: Dimensions.get("window").height-200,
                        width: Dimensions.get("window").width ,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        backgroundColor:colors.whiteBg
                    }}>
                        <View style={[gStyle.flexRowCenter,{
                            paddingVertical:10,
                            paddingHorizontal:15,
                            borderTopLeftRadius:20,
                            borderTopRightRadius:20,
                            borderBottomColor:colors.whiteBg,
                            borderBottomWidth:1.5,
                            backgroundColor:'#f0f1f6'
                        }]}>
                            <TouchableOpacity
                                onPress={() => props.onClose()}
                                activeOpacity={gStyle.activeOpacity}
                            >
                                <Text style={{
                                    ...gStyle.textBoxme14,
                                    padding:6
                                }}>
                                    {translate('base.printer_config')}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View
                            style={[gStyle.flexRow,
                                {
                                marginHorizontal:10,
                                marginTop:20,
                                borderRadius:6,
                                backgroundColor:'#f0f1f6'
                            }]}
                            >
                                <View style={styles.block} key={1}>
                                    <TouchableOpacity
                                        style={[styles.blockText,{
                                            borderWidth:1.5,
                                            borderRadius:6,
                                            borderColor:printerType === 'ble' ?colors.brandPrimary : colors.greyInactive}]}
                                        onPress={() => getListDevices()}
                                    >
                                        <Feather color={printerType === 'ble' ? colors.brandPrimary : colors.greyInactive} name='bluetooth' size={18}/>
                                        <Text style={[styles.blockTextRight,
                                        {
                                            color:printerType === 'ble' ? colors.brandPrimary : colors.greyInactive,
                                            ...gStyle.textBoxmeBold14
                                        }]} numberOfLines={1}>
                                            {translate('base.printer_ble')}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={styles.block} key={2}>
                                    <TouchableOpacity
                                        style={[styles.blockText,{
                                            borderWidth:1.5,
                                            borderRadius:6,
                                            borderColor:printerType === 'net' ?colors.brandPrimary : colors.greyInactive}]}
                                        onPress={() => getListDevices()}
                                    >
                                        <Feather color={printerType === 'net' ? colors.brandPrimary : colors.greyInactive} name='wifi' size={18}/>
                                        <Text style={[styles.blockTextRight,
                                        {
                                            color:printerType === 'net' ? colors.brandPrimary : colors.greyInactive,
                                            paddingLeft:5,
                                            ...gStyle.textBoxmeBold14
                                        }]} numberOfLines={1}>
                                            {translate('base.printer_net')}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                        </View>
                        <View
                            style={[
                                {
                                marginHorizontal:10,
                                marginTop:10
                            }]}
                            >
                                {loading &&
                                    <View style={gStyle.flexCenter}>
                                        <ActivityIndicator/>
                                    </View>}
                                <View style={gStyle.flexRow}>
                                    <Text style={{
                                        ...gStyle.textBoxmeBold16,
                                        color:colors.black70
                                    }}>
                                        {translate('base.printer_list')}
                                    </Text>
                                    {devices.length > 0 ? <View style={[gStyle.flexRow,{paddingBottom:20}]}>
                                        <FlatList
                                            data={devices}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                renderObjPrinter(item)
                                            )}
                                        />
                                    </View> :
                                        <View style={[gStyle.flexRowCenter,{marginTop:50}]}>
                                            <Text style={{
                                                ...gStyle.textBoxme14,
                                                color:colors.black70
                                            }}>
                                                {translate('base.empty')}
                                            </Text>
                                    </View>
                                    }
                                </View>
                        </View>
                        <View style={{
                            flexDirection : 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            width:'100%',
                            bottom: device.iPhoneNotch ? 25 :0,
                        }}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                            onPress={printTextTest}>
                                <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">Print Text</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={printBillTest} style={[styles.bottomButton,{backgroundColor:colors.brandPrimary}]}>
                                <Text style={styles.textButton} numberOfLines={1} ellipsizeMode="tail">Print Bill Text</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
  );
};

const styles = StyleSheet.create({

});
export default ModelPrinter;
