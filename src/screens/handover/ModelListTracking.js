import React, { useState, useEffect } from "react";
import { 
    Modal, 
    Text, 
    TouchableOpacity, 
    View,StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import moment from 'moment';
import { Ionicons,Feather} from '@expo/vector-icons';
import { colors, device, gStyle } from "../../constants";

const ModelListTracking = props => {
  const [listData,setlistData] = useState(props.listData);

  const renderObjTracking = (obj) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            disabled={obj.rma_ok}
            onPress={()=>props.onSelect(obj.tracking_code)}
            style={[gStyle.flex1,{
                width:Dimensions.get("window").width-20,
                marginVertical:5,
                marginHorizontal:10,
                borderRadius:3,
                backgroundColor:colors.whiteBg,
                
            }]}
        >
            <View style={[{paddingVertical:15,paddingHorizontal:10 }]}>
                <View style={[gStyle.flexRowSpace]}>
                    <Text style={styles.textLabel}>{props.t("screen.module.handover.input_tracking")}</Text>
                    <Text style={styles.textLabel}>{props.t("screen.module.handover.tracking_status")}</Text>
                </View>
                <View style={[gStyle.flexRowSpace]}>
                    <Text style={styles.textValue}>{obj.tracking_code}</Text>
                    {obj.rma_code ? <View style={gStyle.flexRowCenterAlign}>
                        <Text style={styles.textValue}>{props.t("screen.module.handover.rma_ok")}
                        {" "}<Ionicons name="checkbox" size={18} color={colors.brandPrimary} /></Text>
                    </View>:
                    <View style={gStyle.flexRowCenterAlign}>
                        <Text style={styles.textValue}>{props.t("screen.module.handover.rma_not_ok")}
                        {" "}<Ionicons name="md-alert-circle" size={18} color={colors.boxmeBrand} /></Text>
                    </View>
                }
                </View>
                <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                    <Text style={styles.textLabel}>{props.t("screen.module.handover.rma_code")}</Text>
                    <Text style={styles.textValue}>{obj.rma_code}</Text>
                </View>
                <View style={[gStyle.flexRowSpace]}>
                    <Text style={styles.textLabel}>{props.t("screen.module.handover.reason_note")}</Text>
                    <Text style={[styles.textValue,{...gStyle.textBoxme16}]} numberOfLines={3} >
                        {obj.reason_note}
                    </Text>
                </View>
                <View style={[gStyle.flexRowSpace]}>
                    <Text style={styles.textLabel}>{props.t('screen.module.pickup.list.time')}</Text>
                    <Text style={[styles.textValue,{...gStyle.textBoxme16}]} numberOfLines={1} >
                        {moment(obj.rma_time).fromNow()}
                    </Text>
                </View>
                {!obj.rma_ok && <TouchableOpacity
                    onPress={() => null}
                    style={[gStyle.flexCenter,{
                    marginTop:5,
                    paddingHorizontal:6,
                    paddingVertical:10,
                    borderRadius:3,
                    backgroundColor:colors.boxmeBrand
                    }]}
                >
                    <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                        {props.t('screen.module.handover.rma_btn_push')}
                    </Text>
              </TouchableOpacity> }
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
                bottom:0,
                
            }}>
                <View style={{
                    height: device.iPhoneNotch ? Dimensions.get("window").height -100 : Dimensions.get("window").height -50,
                    width: Dimensions.get("window").width ,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexCenter,{
                        paddingVertical:6,
                        paddingHorizontal:15,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1.5,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <TouchableOpacity 
                            onPress={() => props.onClose()}
                            activeOpacity={gStyle.activeOpacity}
                            style={gStyle.flexCenter}
                        >
                            <Feather color={colors.black70} name='chevron-down' size={20}/>
                            <Text>{props.t('screen.module.handover.rma_header_text')}</Text>
                        </TouchableOpacity>
                    
                    </View>
                    
                    <View style={[gStyle.flexRow,{paddingBottom:50}]}>
                        <FlatList
                            data={listData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                renderObjTracking(item)
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
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme16,
        color:colors.black70
    },
});
export default React.memo(ModelListTracking);