import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,StyleSheet,
    FlatList,
} from "react-native";
import {
    Feather,
    Ionicons,
    FontAwesome5
  } from "@expo/vector-icons";
import {
    colors,
    device,
    gStyle
} from "../constants";
import EmptySearch from './EmptySearch';
import {translate} from "../i18n/locales/IMLocalized";

const LineOrderError = props => {
    const renderOrderItem = (order_id) =>{
        return (
            <TouchableOpacity
              activeOpacity={gStyle.activeOpacity}
              style={styles.container}
            >
              <View style={gStyle.flexRowSpace}>
                <View >
                    <Text style={styles.title}>
                        <FontAwesome5 name="barcode" size={12} color={colors.black} />{" "}{order_id.tracking_code}
                    </Text>
                    <Text style={styles.title}>
                    {translate("screen.module.handover.error_update_at")} {order_id.time_approved}
                    </Text>
                </View>
                <Ionicons name="ios-checkmark-circle" size={24}
                color={ order_id.is_approved === 1 ? colors.darkgreen : colors.greyInactive} />
              </View>
            </TouchableOpacity>
          );
    }
    return (
        <Modal
        animationType="slide"
        transparent={false}
        presentationStyle="formSheet"
        visible={true}
        >
            <View style={[gStyle.container,{backgroundColor:'#f0f1f6'}]}>
                <View style={[gStyle.flexRowSpace,{
                    paddingVertical:6,
                    paddingHorizontal:15,
                    backgroundColor:colors.whiteBg,
                    borderBottomColor:'#f0f1f6',
                            borderBottomWidth:1
                }]}>
                        <View style={[gStyle.flexRowSpace,{
                            paddingVertical:13,
                        }]}>
                            <Text>{translate("screen.module.handover.error_order_list")}</Text>
                        </View>
                        <TouchableOpacity
                                onPress={() => props.onClose(false)}
                                activeOpacity={gStyle.activeOpacity}
                            >
                                <Feather color={colors.black70} name='chevron-down' size={20}/>

                        </TouchableOpacity>
                </View>
                {props.data && <View style={[gStyle.flexRow,{marginTop:10,marginHorizontal:10}]}>
                    <FlatList
                        data={props.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            renderOrderItem(item)
                        )}
                    />
                    <View style={gStyle.spacer11} />
                    <View style={gStyle.spacer11} />
                </View>}
                {props.data.length === 0 && (
              <EmptySearch/>
            )}
                <View style={[styles.containerBottom]}>
                    <TouchableOpacity style={[styles.bottomButton]}
                        onPress={() => props.onClose(false)}>
                        <Text style={styles.textButton}>
                            {translate("screen.module.handover.error_btn")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor:colors.whiteBg,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginVertical : 5,
        borderRadius:6,
        width: '100%'
    },
    containerBottom:{
        position: 'absolute',
        width:'100%',
        bottom: device.iPhoneNotch ? 10 : 0
    },
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
export default LineOrderError;
