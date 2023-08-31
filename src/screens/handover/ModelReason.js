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
import {
    FontAwesome5,
    Feather
} from '@expo/vector-icons';
import {
    colors,
    device,
    gStyle
} from "../../constants";
import {translate} from "../../i18n/locales/IMLocalized";

const ModelReason = props => {
  const [listData,setlistData] = useState(props.listData);

  const renderObjReason = (obj) =>{
      return (
        <TouchableOpacity
            activeOpacity={gStyle.activeOpacity}
            onPress={()=>props.onSelect(obj.value)}
            style={[gStyle.flexRowCenterAlign,{
                paddingVertical:5,
                backgroundColor:colors.whiteBg,
                width: "100%"
            }]}
        >
            <View style={gStyle.flexRow}>
                <View style={[gStyle.flexCenter,{ width: 65,
                        marginRight:5,
                    }]}>
                    <FontAwesome5 color={colors.black70} name={obj.icon} size={22}/>
                </View>
                <View style={{width:Dimensions.get("window").width-60,paddingVertical:12}}>
                    <View style={[gStyle.flexRowSpace]}>
                        <Text style={styles.textValue}>{obj.value}</Text>
                    </View>
                    <View style={{
                        height:1.2,
                        backgroundColor:'#f0f1f6',
                        marginTop:8
                    }}></View>
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
                bottom:0,

            }}>
                <View style={{
                    height: device.iPhoneNotch ? Dimensions.get("window").height -360 : Dimensions.get("window").height -200,
                    width: Dimensions.get("window").width ,
                    borderTopLeftRadius:20,
                    borderTopRightRadius:20,
                    backgroundColor:'#f0f1f6'
                }}>
                    <View style={[gStyle.flexRowSpace,{
                        paddingVertical:15,
                        paddingHorizontal:15,
                        borderTopLeftRadius:6,
                        borderTopRightRadius:6,
                        borderBottomColor:'#f0f1f6',
                        borderBottomWidth:1.5,
                        backgroundColor:colors.whiteBg
                    }]}>
                        <Text>{translate("screen.module.handover.hvc_refused")}</Text>
                        <TouchableOpacity
                            onPress={() => props.onClose()}
                            activeOpacity={gStyle.activeOpacity}
                            style={gStyle.flexCenter}
                        >
                            <Feather color={colors.black70} name='chevron-down' size={20}/>

                        </TouchableOpacity>

                    </View>

                    <View style={[gStyle.flexRow,{paddingBottom:50}]}>
                        <FlatList
                            data={listData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                renderObjReason(item)
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
export default React.memo(ModelReason);
