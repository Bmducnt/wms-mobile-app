import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import {
  Feather,Entypo
} from '@expo/vector-icons';
import { colors, gStyle ,images,device} from '../constants';

const LineWarehouse= ({
  icon,
  onPress,
  title,
  disableRightSide,
  country_code,
  province
}) => {

  return (
    <TouchableOpacity
      activeOpacity={gStyle.activeOpacity}
      onPress={onPress}
      style={styles.container}
    >
      <View style={gStyle.flexRowCenterAlign}>
        <View style={[gStyle.flexRowCenterAlign,{ width: 55}]}>
            <Image source={images[country_code]} style={styles.flagImage} />
        </View> 
        <View style={{marginTop:5}}>
          <Text style={styles.textWarehouseName}>{title}</Text>
          <View style={[gStyle.flexRowCenterAlign,{paddingTop:3}]}>
            <Entypo name="location" size={14} color={colors.greyInactive} />
            <Text style={styles.textWarehouseNameSub} >{province}</Text>
          </View>
        </View>
        <View style={styles.containerRight}>
          <Feather color={colors.white} name="chevron-right" size={20} />
        </View>
      </View>
      
    </TouchableOpacity>
  );
};

LineWarehouse.defaultProps = {
  disableRightSide: null,
};

LineWarehouse.propTypes = {
  // required
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,

  // optional
  disableRightSide: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: '100%',
    marginVertical : 1,
  },
  textWarehouseName: {
    ...gStyle.textBoxme16,
    color: colors.white,
  },
  textWarehouseNameSub : {
    ...gStyle.textboxme14,
    color: colors.greyInactive
  },
  flagImage : {
    width:45,
    height:45
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  }
});

export default LineWarehouse;
