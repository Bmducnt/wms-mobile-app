import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { colors, gStyle } from '../constants';
import Badge from './Badge';

const LineBinStock = ({ active, row ,trans}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={null}
        style={gStyle.flex5}
      >
        
        <View style={[gStyle.flexRowSpace]}>
            <Text style={[styles.title, { color: colors.white }]}>
              {row.location.location}
            </Text>
            <Text style={styles.title}>
              {row.quantity - row.quantity_outbound}{" "}pcs
            </Text>
        </View>

        <View style={[gStyle.flexRowSpace]}>
          <Text style={styles.text}>
            {`${trans('screen.module.pickup.detail.expire_date')} · ${row.expire_date}`}
          </Text>
          <Badge
          name={row.is_active === 0 ? trans('screen.module.product.bin_active') : trans('screen.module.product.bin_deactive')}
          style={{
            backgroundColor: row.is_active === 0 ? colors.boxmeBrand : colors.blackBlur,
            color: colors.white,
            borderRadius: 6
          }}
        />
        </View>
        <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
          <Text style={styles.text}>{trans('screen.module.product.bin_hold')}</Text>
          <Text style={styles.textValue}>{row.quantity_hold}</Text>
        </View>
        <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
          <Text style={styles.text}>{trans('screen.module.product.staff_putaway')}</Text>
          <Text style={styles.textValue}>{row.staff_id}</Text>
        </View>
        <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
          <Text style={styles.text}>{trans('screen.module.product.putaway_date')}</Text>
          <Text style={styles.textValue}>{row.created_date}</Text>
        </View>
        <View style={styles.percentBar}></View>
      </TouchableOpacity>
    </View>
  );
};

LineBinStock.defaultProps = {
  active: false
};

LineBinStock.propTypes = {
  // required
  row: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal:16,
    paddingVertical:5,
    borderBottomColor:colors.borderLight,
    borderBottomWidth:0.5
  },
  title: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
    marginBottom: 3
  },
  text: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white
  },
  percentBar:{
    height:0.3,
    marginTop:10,
    width:'100%',
    backgroundColor:colors.cardLight
  }
});

export default LineBinStock;
