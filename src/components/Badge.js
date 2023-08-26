import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { gStyle,colors } from '../constants';

import { Feather} from "@expo/vector-icons";


const Badge = props => 
  <TouchableOpacity
    onPress={props.onPress}
    style={[
      styles.container,
      { 
        maxWidth : props.width,
        backgroundColor: props.style.backgroundColor,
        borderWidth: props.style.borderWidth,
        borderColor: props.style.color,
        borderRadius: props.style.borderRadius
      },
    ]}>
    {props.showIcon ? <Text style={[gStyle.flexRowCenter,styles.text, { color: props.style.color}]} numberOfLines={1}>
      {props.name}{" "}<Feather color={colors.white} name="external-link" size={14} />
    </Text>:<Text style={[gStyle.flexRowCenter,styles.text, { color: props.style.color}]} numberOfLines={1}>
      {props.name}
    </Text>}
  </TouchableOpacity>

Badge.propTypes = {
  name: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  width : PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ]),
  showIcon : PropTypes.bool,
  onPress: PropTypes.func,
};

Badge.defaultProps = {
  name: 'Badge',
  showIcon:false,
  style: { backgroundColor: '#12b661', color: '#fff', borderRadius: 3},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight:3,
    alignItems: 'center'
  },
  text: {
    paddingHorizontal: 4,
    ...gStyle.textBoxme10
  }
});

export default Badge;