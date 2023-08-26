import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, gStyle } from '../constants';

const LineTransactionInventory = ({ active, row }) => {
  const calculation =  row.action === true ? '+' : '-';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={null}
        style={gStyle.flex5}
      >
        <View style={[gStyle.flexRowSpace]}>
          <Text style={[styles.title]} numberOfLines={1}>
            {row.referral_code}
          </Text>
            <Text style={styles.title}>
            {calculation}{row.quantity}
          </Text>
        </View>
        
        <View style={gStyle.flexRow}>
          <Text style={styles.text}>{row.staff_id}</Text>
        </View>
        <View style={[gStyle.flexRow,{marginTop:3}]}>
          <Text style={styles.text}>{row.created_date}</Text>
        </View>
        <View style={styles.percentBar}></View>
      </TouchableOpacity>
    </View>
  );
};

LineTransactionInventory.defaultProps = {
  active: false
};

LineTransactionInventory.propTypes = {
  // required
  row: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal:16,
    paddingVertical:5,
  },
  title: {
    ...gStyle.textBoxmeBold16,
    color: colors.white,
    marginBottom: 4
  },
  text: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  },
  percentBar:{
    height:0.3,
    marginTop:10,
    width:'100%',
    backgroundColor:colors.whiteBg
  }
});

export default LineTransactionInventory;
