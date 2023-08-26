import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ActivityIndicator
 } from 'react-native';
import { Feather,Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { colors, gStyle } from '../constants';
import Badge from './Badge';
import Avatar from './Avatar';

const ListPickupItems = ({
  navigation,
  itemInfo,
  translate,
  disableRightSide,
  onPress
}) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          onPress={() => navigation.navigate('PickupDetails',{
            'pickup_code' : itemInfo.pickup_code,
            'quantity' : itemInfo.quantity,
            'is_error' : itemInfo.tab_value,
            'is_confirm':disableRightSide,
            'pickup_box_id' : itemInfo.pickup_box_id,
            'total_orders_sla':itemInfo.total_orders_sla,
            'is_open_model' : itemInfo.is_open_model,
            'total_orders' : itemInfo.quantity_tracking
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
              <View style={gStyle.flexRowCenterAlign}>
                  <Text selectable={true} style={[styles.textCode,
                    { color:itemInfo.total_items_pick ===itemInfo.quantity ? colors.white : colors.white,paddingRight:5}]} numberOfLines={1} ellipsizeMode="tail">
                    
                    {itemInfo.pickup_code}
                  </Text>
                  {itemInfo.pickup_type === 'b2b' && <Badge
                    name={`${itemInfo?.part_id ? itemInfo?.part_id : 1}`}
                    style={{
                      backgroundColor: colors.boxmeBrand,
                      color: colors.white,
                      borderRadius: 50,
                    }}
                  />}
              </View>
              <View style={gStyle.flexRowCenter}>
                  <Text style={[styles.textCode,
                    { color:itemInfo.total_items_pick ===itemInfo.quantity ? colors.white : colors.boxmeBrand}]}>
                      {itemInfo.total_items_pick}/{itemInfo.quantity}</Text>
              </View>
            </View>
            <View style={[gStyle.flexRow,{marginTop:5}]}>
              {itemInfo.zone_picking && <Badge
                name={`${itemInfo.zone_picking}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.boxmeBrand,
                  borderRadius: 3
                }}
              />}
              <Badge
                name={`${itemInfo.quantity_tracking} ${translate('screen.module.pickup.list.tracking_code')}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 6
                }}
              />
              <Badge
                name={`${itemInfo.quantity_bin} ${translate('screen.module.pickup.list.bin')}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 6
                }}
              />
              <Badge
                name={`${itemInfo.quantity_fnsku} ${translate('screen.module.pickup.list.fnsku')}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 6
                }}
              />
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.list.created_by')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.created_by}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.list.assigner_by')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.assigner_by}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.list.time')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >
                {moment(itemInfo.time_created).fromNow()}</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginVertical:5}]}>
              <TouchableOpacity
                
              >
                <View style={gStyle.flexRowCenterAlign}>
                    <View
                        style={{
                            width: 6,
                            height: 6,
                            backgroundColor: colors.brandPrimary,
                            borderRadius: 4,
                            marginRight:4
                        }}
                    />
                      <Text style={{ color: colors.white,...gStyle.textboxme12}}>
                        {itemInfo.status_id === 400 ? translate('screen.module.pickup.list.status_await') : itemInfo.status_id === 407 ? 
                        translate('screen.module.packed.status_awaiting'): 
                        translate('screen.module.pickup.list.status_doing')}
                    </Text>
                </View>
                <View style={gStyle.flexRowCenterAlign}>
                  <View
                      style={{
                          width: 6,
                          height: 6,
                          backgroundColor: itemInfo.pickup_kpi_flat ? colors.brandPrimary:colors.brandPrimary,
                          borderRadius: 4,
                          marginRight:4
                      }}
                  />
                    <Text style={{ color: itemInfo.pickup_kpi_flat ? colors.white:colors.white,...gStyle.textboxme12}}>
                      {itemInfo.pickup_kpi_flat ? 
                      `${translate('screen.module.pickup.detail.kpi_text_ok')} ${itemInfo.pickup_kpi_left} ${translate('screen.module.pickup.detail.kpi_text_unit')}` :
                       `${translate('screen.module.pickup.detail.kpi_text_fail')} ${itemInfo.pickup_kpi_left} ${translate('screen.module.pickup.detail.kpi_text_unit')}`}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={disableRightSide}
                onPress={() => navigation.navigate('PickupDetails',{
                  'pickup_code' : itemInfo.pickup_code,
                  'quantity' : itemInfo.quantity,
                  'is_error' : itemInfo.tab_value,
                  'is_confirm':disableRightSide,
                  'pickup_box_id' : itemInfo.pickup_box_id,
                  'total_orders_sla':itemInfo.total_orders_sla,
                  'is_open_model' : itemInfo.is_open_model,
                  'total_orders' : itemInfo.quantity_tracking
                })}
                style={[gStyle.flexRow,{
                  marginTop:3,
                  paddingHorizontal:6,
                  paddingVertical:10,
                  borderRadius:3,
                  backgroundColor:disableRightSide ? colors.borderLight:colors.darkgreen
                }]}
              >
                <Text style={{ color: colors.white,...gStyle.textBoxme14,paddingLeft:4 }}>
                  {translate('screen.module.pickup.detail.btn_update_pickup')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.percentBar}></View>
            {itemInfo?.is_vas === 1 && <View style={{
                position:"absolute",
                left:"30%",
                top:"35%",
                transform: [{rotateX: '20deg'}, {rotateZ: '20deg'}]
              }}>
                <View style={{
                  borderColor:colors.boxmeBrand,
                  borderWidth:2,
                  padding: 3,
                }}>
                  <Text style={{ color: colors.boxmeBrand,...gStyle.textBoxme14}}>
                    Có dịch vụ VAS
                  </Text>
                </View>
              </View>}
            <View style={[gStyle.flexRowSpace,{
                paddingVertical:8,
              }]}>
              <View style={{width:'80%'}}>
              {itemInfo.pickup_type === 'damaged_goods' && <View style={[gStyle.flexRowCenterAlign]}>
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                {translate('screen.module.pickup.detail.damaged_alert')}
                </Text>
              </View>}
              {itemInfo.pickup_type === 'ff_now' && <View style={[gStyle.flexRowCenterAlign]}>
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                {translate('screen.module.pickup.detail.ff_now_alert')}
                </Text>
              </View>}
              <View style={[gStyle.flexRowCenterAlign]}>
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                  {translate('screen.module.home.handover_total')} <Text style={{ color: colors.boxmeBrand,...gStyle.textBoxmeBold14}}>{itemInfo.total_orders_sla}</Text> {translate('screen.module.home.handover_text')}
                </Text>
              </View>
              <View style={[gStyle.flexRowCenterAlign]}>
                <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                {translate('screen.module.pickup.detail.xe_code')} <Text style={{ color: colors.boxmeBrand,...gStyle.textBoxmeBold14}}>{itemInfo.pickup_xe}</Text>
                </Text>
              </View>
              {disableRightSide && <View style={[gStyle.flexRowCenterAlign]}>
                <Entypo name="back-in-time" size={16} color={colors.brandPrimary} />
                <Text style={{ color: colors.brandPrimary,...gStyle.textBoxme14,paddingLeft:4}}>
                {translate('screen.module.pickup.detail.pickup_time_done')} {itemInfo.time_process} {translate('screen.module.pickup.detail.pickup_time_unit')}
                </Text>
              </View>}
              </View>
              <Avatar left={30} image={itemInfo.assigner_by_img} value={itemInfo.assigner_by_avatar} />
              <Avatar left={-10} image={itemInfo.created_by_img} value={itemInfo.created_by_avatar} />
              
            </View>
            {itemInfo.quantity_bin === 0 && <View style={gStyle.flexRow}>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={{ color: colors.white,...gStyle.textBoxme12,paddingLeft:3}} >
                {translate('screen.module.pickup.detail.pickup_rts')}</Text>
            </View> }
          </View>
        </TouchableOpacity>
        
        
    </View>
  );
};

ListPickupItems.defaultProps = {
  disableRightSide: null,
  iconLibrary: 'Feather',
  onPress:null,
  pickup_kpi_flat : false,
  pickup_kpi_left : 0,
};

ListPickupItems.propTypes = {
  itemInfo: PropTypes.shape({
    time_created: PropTypes.string,
    created_by: PropTypes.string.isRequired,
    assigner_by : PropTypes.string,
    pickup_code: PropTypes.string.isRequired,
    pickup_type: PropTypes.string,
    quantity : PropTypes.number.isRequired,
    quantity_tracking : PropTypes.number.isRequired,
    quantity_fnsku : PropTypes.number.isRequired,
    quantity_bin : PropTypes.number.isRequired,
    pickup_box_id : PropTypes.number.isRequired,
    total_items_pick : PropTypes.number.isRequired,
    pickup_kpi_flat : PropTypes.bool,
    pickup_kpi_left : PropTypes.number,
    tab_value: PropTypes.number,
    zone_picking : PropTypes.string,
    status_id : PropTypes.number,
    time_process:PropTypes.number,
    total_orders_sla :PropTypes.number,
    is_open_model : PropTypes.bool
  }).isRequired,
  onPress : PropTypes.func,
  disableRightSide: PropTypes.bool.isRequired
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

export default React.memo(ListPickupItems);
