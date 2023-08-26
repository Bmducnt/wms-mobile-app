import React, { useRef,memo } from "react";
import {
    View,
    Text,
    Dimensions,
    FlatList
} from 'react-native';
import { SvgUri } from "react-native-svg";
import { colors, gStyle } from '../constants';

const ListCarrierHandoverDay = props => {

    return (
        <FlatList
            data={props.data}
            horizontal
            keyExtractor={({ carrier_name,total_handover }) => carrier_name.toString()+total_handover}
            renderItem={({ item }) => (
                <View style={[gStyle.flexRowCenterAlign,{
                marginHorizontal:5,marginVertical:5}]} key={item.carrier_name}>
                <View><SvgUri width={35} height={35} uri={item.courier_logo} /></View>
                <View style={{paddingHorizontal:6,width:Dimensions.get("window").width/3}}>
                    <View style={gStyle.flexRowSpace}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{props.t('screen.module.analysis.handover_all')}</Text>
                        <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>
                        {item.total_handover.toLocaleString()}
                        </Text>
                    </View>
                    <View style={[gStyle.flexRowSpace]}>
                        <Text style={{...gStyle.textBoxme14,color:colors.white}}>{props.t('screen.module.analysis.handover_reject')}</Text>
                        <Text style={{...gStyle.textBoxmeBold14,color:colors.white}}>
                            {item.total_refuses}
                        </Text>
                    </View>
                </View>
            </View>
            )}
        />
    )
}
export default memo(ListCarrierHandoverDay);
