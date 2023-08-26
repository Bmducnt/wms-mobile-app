import React, { useRef,memo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { colors, gStyle } from '../constants';

const Avatar = props => {
    const bgAvatar = [
        colors.purple,
        colors.darkgreen,
        colors.boxmeBrand,
        colors.greyInactive,
        colors.greySwitchBorder,
    ];
    return (
        <View style={gStyle.flexRow}>
            {props.image && <Image style ={[styles.imageAvatar,{marginLeft:props.left}]} source={{uri : props.value}} />}
            {!props.image &&<View
                style={[gStyle.flexCenter,styles.imageAvatar,{
                backgroundColor:bgAvatar[Math.floor(Math.random() * 5)],
                marginLeft:props.left
                }]}
            >
                <Text style={{...gStyle.textBoxmeBold12,color:colors.white}}>{props.value}</Text>
            </View>}
        </View>
    )
};

const styles = StyleSheet.create({
    imageAvatar :{
        width:28,
        height:28,
        borderRadius:28/2
    }
});
export default memo(Avatar);
