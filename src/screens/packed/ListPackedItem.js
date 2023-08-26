import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import { colors, gStyle } from '../../constants';
import  Badge  from '../../components/Badge';

const ListPackedItem = ({
  itemInfo,
  translate,
  showBtn,
  navigation
}) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          onPress={() => navigation.navigate('DetailPacking',{
            'pickup_code' : itemInfo.pickup_code
          })}
          style={styles.container}
        >
          <View style={[gStyle.flex5]}>
            <View style={[gStyle.flexRowSpace]}>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{translate('screen.module.pickup.list.pickup_code')}</Text>
                  
              </View>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{translate('screen.module.pickup.list.sold')}</Text>
              </View>
            </View>
            <View style={gStyle.flexRowSpace}>
              <View style={gStyle.flexRow}>
                  <Text style={[styles.textCode,
                    { color:itemInfo.total_items_pick ===itemInfo.quantity ? colors.white : colors.white}]} numberOfLines={1} ellipsizeMode="tail">
                    {itemInfo.pickup_code}</Text>
              </View>
              <View style={gStyle.flexRowCenter}>
                  <Text style={[styles.textCode,
                    { color:itemInfo.total_items_pick ===itemInfo.quantity ? colors.white : colors.boxmeBrand}]}>
                      {itemInfo.total_items_pick}/{itemInfo.quantity}</Text>
              </View>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.pickup_time')} </Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.picker_time} {translate('screen.module.analysis.pickup_minute')}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.packed_percent')} </Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.process_percent} %</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.packed_by')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.packer_by}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.created_time')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{moment(itemInfo.time_created).fromNow()}</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
            <View style={gStyle.flexRow}>
              <Badge
                name={`${itemInfo.warehouse_zone}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.boxmeBrand,
                  borderRadius: 3
                }}
              />
              {itemInfo.pickup_xe && <Badge
                name={`Mã xe ${itemInfo.pickup_xe}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 3
                }}
              />}
            </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('DetailPacking',{
                  'pickup_code' : itemInfo.pickup_code
                })}
                style={{
                  paddingHorizontal:6,
                  paddingVertical:10,
                  borderRadius:3,
                  backgroundColor:colors.darkgreen
                }}
              >
                <Text style={{ color: colors.white,...gStyle.textBoxme14 }}>
                  {translate('screen.module.packed.btn_detail')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.pickup_time')} </Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.picker_time} {translate('screen.module.analysis.pickup_minute')}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.packed.packed_percent')} </Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.process_percent} %</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        
    </View>
  );
};

ListPackedItem.defaultProps = {
  disableRightSide: null,
  iconLibrary: 'Feather',
  showBtn:'B2C'
};

ListPackedItem.propTypes = {
  itemInfo: PropTypes.shape({
    time_created: PropTypes.string,
    created_by: PropTypes.string.isRequired,
    packer_by: PropTypes.string.isRequired,
    pickup_code: PropTypes.string.isRequired,
    quantity : PropTypes.number.isRequired,
    total_items_pick : PropTypes.number.isRequired,
    warehouse_zone: PropTypes.string,
    status_id : PropTypes.number,
    showBtn : PropTypes.string
  }).isRequired,
  onPress : PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal:5,
    marginVertical:5,
    width: "100%",
    backgroundColor:colors.cardLight
  },
  percentBar:{
    height:1,
    marginTop:8,
    width:`100%`,
    backgroundColor:colors.borderLight
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white,
    paddingLeft: 10,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  }
});

export default React.memo(ListPackedItem);
