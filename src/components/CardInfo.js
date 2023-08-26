import React, { useRef,memo } from "react";
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { 
    MaterialIcons
   } from '@expo/vector-icons';
import { colors, gStyle } from '../constants';

const CardInfo = props => {

    return (
        <View style={[styles.containerCard,{paddingHorizontal:5,marginTop:props.top}]}>
            <View style={[gStyle.flexRowSpace,{paddingVertical:3}]}>
                <View style={gStyle.flexRowCenterAlign}>
                <View style={[gStyle.flexRowCenterAlign,gStyle.flexCenter,{height:30,width:30,borderRadius:8,backgroundColor:props.bg,marginRight:10}]}>
                    <MaterialIcons name={props.icon} size={18} color={colors.white} />
                </View>
                <Text style={{...gStyle.textBoxme14,color:colors.greyInactive}}>{props.name}</Text>
                </View>
                <Text style={{...gStyle.textBoxme14,color:colors.white}}>{props.value.toLocaleString()} {props.unit}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    containerCard :{
      backgroundColor:colors.cardLight,
      paddingVertical:2,
      marginHorizontal:10
    }
  });
export default memo(CardInfo);
