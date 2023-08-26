import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
  } from 'react-native';
  import { Feather} from '@expo/vector-icons';
import { colors, gStyle } from '../constants';
import {_getTimeDefaultFrom,
    _getTimeDefaultTo,
    _getDatetimeToTimestamp,
    _convertDatetimeToTimestamp} from '../helpers/device-height';

const AnchorTextTime = props  => {
    return (
        <View style={styles.blockTime}>
            <TouchableOpacity
              onPress={()=>props.openModelTime(false)}
            >
              <Text style={styles.sectionHeadingTime}>{_getDatetimeToTimestamp(props.from_time)} </Text>
            </TouchableOpacity>
            <Feather color={colors.white} name="arrow-right" size={18} style={styles.sectionHeadingTime}/>
            <TouchableOpacity
              onPress={()=>props.openModelTime(true)}
              style={{marginLeft:5}}
            >
              <Text style={styles.sectionHeadingTime}>{_getDatetimeToTimestamp(props.to_time)}</Text>
            </TouchableOpacity>
        </View>
    );
};
  
AnchorTextTime.propTypes = {
    from_time : PropTypes.number,
    to_time : PropTypes.number,
    openModelTime: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    blockTime:{
      flexDirection:'row',
      marginLeft: 10
    },
    sectionHeadingTime: {
      ...gStyle.textBoxme14,
      color: colors.greyInactive,
      marginBottom: 15,
    }
  });

export default AnchorTextTime;
