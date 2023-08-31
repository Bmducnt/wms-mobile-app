import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from "react-native";
import { Feather} from '@expo/vector-icons';
import LineOrderTracking from './LineOrderTracking';
import EmptySearch from './EmptySearch';
import { colors, device, gStyle } from "../constants";
import {translate} from "../i18n/locales/IMLocalized";


const ModelOrderKPI = props => {

    const detailOrder = (code) =>{
        props.onClose();
        props.navigation.navigate('ModelTimelineTracking',{'tracking_code' : code,"is_show": true});
    }

    return (
        <React.Fragment>
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle="formSheet"
                visible={props.isVisible}
            >
                <View style={[gStyle.container]}>

                    <View style={[gStyle.flexRowSpace,{
                            paddingVertical:15,
                            paddingHorizontal:15,
                            borderBottomColor:colors.cardLight,
                            borderBottomWidth:1.5,
                            backgroundColor:colors.cardLight
                        }]}>
                        <Text style={{color:colors.white}}>{translate('screen.module.home.handover_list')}</Text>
                        <TouchableOpacity
                            onPress={() => props.onClose()}
                            activeOpacity={gStyle.activeOpacity}
                            style={gStyle.flexCenter}
                        >
                            <Feather color={colors.white} name='chevron-down' size={20}/>

                        </TouchableOpacity>

                    </View>


                    <View style={[gStyle.flexCenter,{marginTop:10,paddingBottom:50}]}>
                        {props.data.length === 0  ? (
                        <EmptySearch/>
                        ):
                        <FlatList
                            data={props.data}
                            keyExtractor={({ tracking_code }) => tracking_code.toString()}
                            renderItem={({ item }) => (
                                <LineOrderTracking
                                    downloaded={false}
                                    key={item.tracking_code.toString()}
                                    onPress={detailOrder}
                                    orderData={{
                                        tracking_code: item.tracking_code,
                                        status_name: item.order_status,
                                        badge_color:item.order_status === "Shipped" ? "#34c75a" : "#f99f00",
                                        image: item.carrier_tracking_code,
                                        created_date: item.created_date,
                                        failed_kpi: item.kpi_time_ship[0],
                                        failed_time_kpi: item.kpi_time_ship[1],
                                        ready_to_ship : item.handover_time[1],
                                        logo_hvc : item.carrier_tracking_code,
                                        weight : item.weight,
                                        total : item.total,
                                        box_packed : item.box_packed,
                                        handover_scan : item.handover_time[0]

                                    }}
                                />
                            )}
                        />
                         }
                    </View>
                </View>

            </Modal>
        </React.Fragment>
    );
};
export default ModelOrderKPI;
