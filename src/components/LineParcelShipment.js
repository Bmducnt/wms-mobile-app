import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { 
  FontAwesome5
} from "@expo/vector-icons";
import { colors, gStyle } from '../constants';

const LineParcelShipment = ({parcel,trans}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => null}
        style={gStyle.flex5}
      >
        <View style={gStyle.flexRowSpace}>
          <Text style={styles.textLabel}>{trans('screen.module.inbound.box_code')}</Text>
          <Text style={styles.textLabel}>{trans('screen.module.inbound.box_quantity')}</Text>
        </View>
        <View style={gStyle.flexRowSpace}>
          <Text style={[styles.textValue]}>
            <FontAwesome5 name="barcode" size={14} color={colors.white} />{" "}{parcel.tracking_code}
          </Text>
          <Text style={[styles.textValue]} numberOfLines={1} >{parcel.quantity}</Text>

        </View>
        <View style={[gStyle.flexRowSpace]}>
          <Text style={styles.textLabel}>{trans('screen.module.inbound.box_weight')}</Text>
          <Text style={[styles.textValue,{...gStyle.textBoxme14}]}>{parcel.weight} gram</Text>
        </View>
        <View style={[gStyle.flexRowSpace]}>
          <Text style={styles.textLabel}>{trans('screen.module.inbound.box_volume')}</Text>
          <Text style={[styles.textValue,{...gStyle.textBoxme14}]}>{parcel.volume}</Text>
        </View>
        <View style={[gStyle.flexRowSpace]}>
          <Text style={styles.textLabel}>{trans('screen.module.inbound.box_created')}</Text>
          <Text style={[styles.textValue,{...gStyle.textBoxme14}]}>{parcel.created_date}</Text>
        </View>
        <View style={styles.percentBar}></View>
      </TouchableOpacity>
    </View>
  );
};

LineParcelShipment.propTypes = {
  // required
  parcel: PropTypes.shape({
    tracking_code: PropTypes.string.isRequired,
    status_name: PropTypes.string.isRequired,
    created_date : PropTypes.string,
    content:PropTypes.string,
    volume:PropTypes.string,
    quantity:PropTypes.number,
    weight:PropTypes.number
  }).isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal:5,
    marginVertical:5,
    width: "100%"
  },
  textValue: {
    ...gStyle.textBoxmeBold14,
    color: colors.white
  },
  textLabel :{
    ...gStyle.textboxme14,
    color:colors.greyInactive
  },
  percentBar:{
    height:1,
    marginTop:8,
    width:`100%`,
    backgroundColor:colors.borderLight
  }
});

export default LineParcelShipment;
