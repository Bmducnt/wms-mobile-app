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
import { Feather} from '@expo/vector-icons';
import {_getDatetimeToTimestamp,_convertDatetimeToTimestamp} from '../../helpers/device-height';
import EmptySearch from "../../components/EmptySearch";
import { colors, gStyle } from "../../constants";

const ModelLocationSugget = props => {
  const [listData,setlistData] = useState(props.listData);
  const renderObjDate = (obj) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            style={{
                flexDirection: "row",
                paddingVertical:8,
                backgroundColor:colors.whiteBg,
                width: "100%",
                borderBottomWidth:1,
                borderBottomColor:'#f0f1f6',
            }}
        >
            <View style={gStyle.flexRow}>
                <View style={[gStyle.flexCenter,{ width: 70,
                        marginRight:5
                    }]}>
                    <Text style={{...gStyle.textBoxmeBold16,color:colors.black}}>{obj.quantity-obj.quantity_outbound}</Text>
                    <Text style={[styles.textLabel,{...gStyle.textboxme10}]}>{props.t('screen.module.product.move.status_stock')}</Text>
                </View>
                <View style={{width:Dimensions.get("window").width-90,paddingVertical:8}}>
                    <View style={[gStyle.flexRowSpace]}>
                        <View>
                            <Text style={styles.textValue}>{obj.location.location}</Text>
                            <Text style={[styles.textLabel,{color:colors.black}]}>{props.t('screen.module.product.move.location_stock')} {obj.created_date.substring(0,10)}</Text>
                        </View>
                        
                        
                        <Text style={styles.textValue}>{obj.location.warehouse_zone}</Text>
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
        onRequestClose={() => props.onClose(false)}
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
                    height: Dimensions.get("window").height-50,
                    width: Dimensions.get("window").width ,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexRowCenter,{
                        paddingVertical:10,
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
                            
                            <Text>{props.t('screen.module.product.move.btn_view_location')}</Text>
                            <Feather color={colors.black70} name='chevron-down' size={16}/>
                        </TouchableOpacity>
                    </View>
                    
                    {listData.length > 0 ? <View style={[gStyle.flexRow,{paddingBottom:20}]}>
                        <FlatList
                            data={listData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                renderObjDate(item)
                            )}
                        />
                    </View>:<View style={[gStyle.flexCenter,{paddingTop:30}]}>
                        <EmptySearch t={props.t}/>
                </View>}
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
        ...gStyle.textBoxme18,
    },
    textLabel :{
        ...gStyle.textBoxme14,
        color:colors.black50
      },
    textValue :{
        ...gStyle.textBoxme16,
        color:colors.blackBlur
    },
});
export default ModelLocationSugget;