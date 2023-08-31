import * as React from 'react';
import * as Animatable from "react-native-animatable";
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import {
  FontAwesome5,
  MaterialIcons
} from "@expo/vector-icons";
import Badge from './Badge';
import {
  colors,
  gStyle
} from '../constants';
import {translate} from "../i18n/locales/IMLocalized";

const FNSKUItems = ({
  navigation,
  fnsku_info,
  disableRightSide,
  onChangeLocation,
  onPressPack,
  onPressLost,
  trans,
  textLabelLeft,
  textLabelRight
}) => {
  return (
    <View style={[styles.container]}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          style={[styles.blockItem]}
          disabled={disableRightSide}
          onPress={() => navigation.navigate('ModalPickupUpdate',{
            'pickup_box_id' : fnsku_info.pickup_box_id,
            'bin_code' : fnsku_info.code,
            'is_bin' : 1,
            'is_error_rollback' : fnsku_info.is_error_rollback,
            'sold' : fnsku_info.quantity_oubound
          })}
        >
          <View style={gStyle.flex5}>

            <View style={gStyle.flexRowSpace}>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{textLabelLeft}</Text>
              </View>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{textLabelRight}</Text>

              </View>
            </View>
            <View style={gStyle.flexRowSpace}>
              <View style={gStyle.flexRow}>
                  <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                  <FontAwesome5 name="barcode" size={14} color={colors.white} />{" "}{fnsku_info.code}</Text>
              </View>
              <View style={gStyle.flexRowCenter}>
                  {fnsku_info.quantity_oubound === 0 ? <Text style={[styles.textCode,{ color:colors.white}]}>
                  {fnsku_info.quantity_pick}
                  </Text> :
                  <Text style={[styles.textCode,{ color:fnsku_info.quantity_pick ===fnsku_info.quantity_oubound ? colors.white : colors.boxmeBrand}]}>
                  {fnsku_info.quantity_pick}/{fnsku_info.quantity_oubound}
                  </Text>}
              </View>
            </View>
            <View style={styles.percentBar}></View>
            <View style={gStyle.flexRow}>
                {fnsku_info.box_code !== '' && fnsku_info.out_of_stock_action ===0 && <View style={[gStyle.flexCenter,{
                  width:65,height:65,borderRadius:3,
                  backgroundColor:fnsku_info.activebg}]}>
                    <Text style={{color:colors.black}} numberOfLines={1}>
                    {translate('screen.module.pickup.detail.box_code')}
                    </Text>
                    <Text style={{color:colors.black}} numberOfLines={1}>
                    {fnsku_info.box_code}</Text>
                </View>}
                <View style={{width : (fnsku_info.box_code !== '' && fnsku_info.out_of_stock_action ===0) ? Dimensions.get("window").width-90 :'100%',
                  paddingLeft : (fnsku_info.box_code !== '' && fnsku_info.out_of_stock_action ===0) ? 5 : 0,}}>
                    {fnsku_info.fnsku_name && <View>
                      <Text style={styles.textLabel}>{translate('screen.module.product.move.product_name')}</Text>
                      <Text style={[styles.titleNote,{color:colors.white}]} numberOfLines={2} ellipsizeMode="tail">
                        {fnsku_info.fnsku_name.toLowerCase()}</Text>
                    </View>}
                    {fnsku_info.total_product !== 0 && <View style={[gStyle.flexRow]}>
                        <Text style={[styles.titleNote]} numberOfLines={1} >
                          {translate('screen.module.pickup.detail.have')} {fnsku_info.total_product} {translate('screen.module.pickup.detail.have_sub')}
                        </Text>
                    </View>}
                    {fnsku_info.bin_id && <View style={[gStyle.flexRowSpace]}>
                        <Text style={[styles.titleNote]} numberOfLines={1}>
                          {translate('screen.module.pickup.list.location')}
                        </Text>
                        <Text style={[styles.titleNote]} numberOfLines={1}>
                          {fnsku_info.bin_id}
                        </Text>
                    </View>}
                    <View style={[gStyle.flexRowSpace]}>
                        <Text style={[styles.titleNote]} numberOfLines={1}>
                          {translate('screen.module.pickup.detail.expire_date')}
                        </Text>
                        <Text style={[styles.titleNote,{color:colors.white}]} numberOfLines={1}>
                          {fnsku_info.expire_date ? fnsku_info.expire_date : 'N/A'}
                        </Text>
                    </View>

                    {fnsku_info.out_of_stock_action === 1 &&
                      <View style={[gStyle.flexRow,styles.btnConfirm,
                        {backgroundColor: colors.borderLight,top:55,right:5}]}>
                        <Text style={{color:colors.yellow,...gStyle.textboxme14}}>
                          {translate('screen.module.pickup.detail.out_of_stock_action')}
                        </Text>
                      </View>
                    }
                  </View>
              </View>
          </View>
        </TouchableOpacity>
        {/* List all action */}
        <View style={[styles.blockItem,{marginVertical:6}]}>
          {/* Confirm rollback product */}
          {!fnsku_info.is_rollback && fnsku_info.is_error &&
            <View style={{marginVertical:4}}>

              <View style={[styles.percentBar,{marginBottom:5}]}/>
              <View style={gStyle.flexRowSpace}>
                <Text style={{color:colors.greyInactive,...gStyle.textboxme14}}>
                  {translate('screen.module.pickup.detail.staff_rollback_admin')}
                </Text>
                <TouchableOpacity
                    style={[styles.btnAction]}
                    onPress={() => navigation.navigate('UpdateException',{
                      'tracking_code' : fnsku_info.code,
                      'pickup_box_id' : fnsku_info.pickup_box_id,
                      'is_show_btn' : true
                    })}
                  >
                    <Text style={{color:colors.white,...gStyle.textboxme14}}>
                      {translate('screen.module.pickup.detail.status_confirm_order_fail')}
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          {fnsku_info.is_rollback && fnsku_info.is_error &&
            <View >
              <View style={gStyle.flexRowSpace}>
                <Text style={{color:colors.greyInactive,...gStyle.textboxme14}}>
                {translate('screen.module.pickup.detail.status_order_now')}
                </Text>
                <TouchableOpacity
                  style={{borderColor:colors.transparent,backgroundColor:colors.transparent}}
                  onPress = {() =>navigation.navigate('UpdateException',{
                    'tracking_code' : fnsku_info.code,
                    'pickup_box_id' : fnsku_info.pickup_box_id,
                    'is_show_btn' : false
                  })}
                >
                  <Text style={{color:colors.yellow,...gStyle.textboxme14}}>
                    {translate('screen.module.pickup.detail.status_confirm_lost')}
                    </Text>
                </TouchableOpacity>
                </View>
              <View style={[styles.percentBar,{marginTop:5}]}></View>
            </View>
            }


            {/* Refind location */}

            {fnsku_info.is_error_rollback === 3  && fnsku_info.is_sugget_location &&
              <View style={gStyle.flexRowSpace}>
                <Text style={{color:colors.greyInactive,...gStyle.textboxme14}}>

                    {translate('screen.module.pickup.detail.lost_text')}
                  </Text>
                <TouchableOpacity
                  style={[gStyle.flexRowCenterAlign,{borderColor:colors.borderLight,
                    backgroundColor:colors.borderLight,paddingHorizontal:10,paddingVertical:6,borderRadius:3}]}
                    onPress={() => onChangeLocation(fnsku_info.code,4)}
                  >
                    <MaterialIcons name="my-location" size={18} color={colors.boxmeBrand} />
                    <Text style={{color:colors.boxmeBrand,...gStyle.textboxme14,paddingHorizontal:5,paddingVertical:3}}>
                      {translate('screen.module.pickup.detail.status_confirm_location')}
                    </Text>
                  </TouchableOpacity>
              </View>
            }

            {/* End status */}
            {fnsku_info.is_rollback &&  fnsku_info.is_lost_items &&
              <View style={gStyle.flexRowSpace}>
                  <Text style={{ color: colors.boxmeBrand,...gStyle.textboxme14,paddingTop:6}}>
                    {translate('screen.module.pickup.detail.text_status_lost')}
                  </Text>
              </View>
            }
            <View style={[gStyle.flexRowSpace,{paddingVertical:3}]}>
              <Text style={{ color: colors.white,...gStyle.textBoxme14}}>
                {translate('screen.module.pickup.detail.condition_goods')} {fnsku_info.condition_goods ? fnsku_info.condition_goods : "A"}
              </Text>
              {fnsku_info.uom && <Badge
                name={`${fnsku_info.uom}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 3
                }}
              />}
              {fnsku_info.idx_sort === 0 && <Animatable.View
                style={gStyle.flexRowCenterAlign}
                animation={ "bounce"}
                iterationCount={"infinite"}
              ><Text style={{ color: colors.boxmeBrand,...gStyle.textboxme14}}>
                <FontAwesome5 name="hotjar" size={16} color={colors.boxmeBrand} /> Vừa lấy</Text></Animatable.View>
              }
            </View>

            {/* confirm pack */}
            {fnsku_info.is_rollback &&  fnsku_info.is_show_button && !fnsku_info.is_lost_items &&
              <View style={gStyle.flexRowSpace}>
                <View/>
                <View style={gStyle.flexRow}>
                  <TouchableOpacity
                      style={[styles.btnAction,{backgroundColor:colors.greyOff}]}
                      onPress={() => onPressLost(fnsku_info.code)}
                    >
                      <Text style={{color:colors.white,...gStyle.textboxme14}}>
                        {translate('screen.module.pickup.detail.not_found_fnsku')}
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={fnsku_info.quantity_pick !== fnsku_info.quantity_oubound}
                    style={[styles.btnAction,{backgroundColor:colors.brandPrimary,marginLeft:5}]}
                    onPress={() => onPressPack(fnsku_info.code)}
                  >
                    <Text style={{color:colors.white,...gStyle.textboxme14}}>
                      {translate('screen.module.pickup.detail.fnsku_ok')}
                      </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

        </View>
    </View>
  );
};

FNSKUItems.defaultProps = {
  disableRightSide: null,
  onChangeLocation : null,
  onPressPack : null,
  onPressLost:null,
  iconLibrary: 'Feather',
  box_code : '',
  fnsku_info :{
    activebg : colors.borderLight,
    out_of_stock_action : 0,
    is_rollback : false,
    is_error : 0,
    is_sugget_location : false,
    is_show_button : false,
    condition_goods : 'A'
  }
};

FNSKUItems.propTypes = {
  fnsku_info: PropTypes.shape({
    code: PropTypes.string,
    quantity_oubound: PropTypes.number.isRequired,
    quantity_pick: PropTypes.number.isRequired,
    total_product : PropTypes.number.isRequired,
    expire_date : PropTypes.string,
    is_pick : PropTypes.bool.isRequired,
    fnsku_name : PropTypes.string,
    pickup_box_id : PropTypes.number,
    box_code : PropTypes.string,
    activebg : PropTypes.string,
    is_error : PropTypes.any,
    is_rollback : PropTypes.any,
    is_packed_again : PropTypes.any,
    is_lost_items : PropTypes.any,
    is_error_rollback : PropTypes.any,
    out_of_stock_action : PropTypes.number,
    is_sugget_location : PropTypes.bool,
    is_show_button : PropTypes.bool,
    condition_goods : PropTypes.string,
    uom: PropTypes.string,
  }).isRequired,
  textLabelLeft : PropTypes.string,
  textLabelRight : PropTypes.string,
  onChangeLocation : PropTypes.func,
  onPressLost : PropTypes.func,
  onPressPack : PropTypes.func,
  disableRightSide: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    marginVertical:4,
    borderRadius:3,
    backgroundColor:colors.cardLight
  },
  blockItem :{
    paddingHorizontal:10
  },
  percentBar:{
    height:1,
    marginVertical:4,
    width:`100%`,
    backgroundColor:colors.borderLight
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color:colors.white,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  },
  titleNote: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
  },
  containerRight: {
    position: 'absolute',
    right: 24,
    top:65
  },
  blockRight : {
    alignItems:'flex-end',
    position: 'absolute',
    right: 24,
    top:5,
  },
  btnConfirm :{
    position:'absolute',
    top:65,
    right:5,
    padding:4,
    zIndex:10,
    backgroundColor:colors.brandPrimary,
    borderRadius:6
  },
  btnAction : {
    marginTop:3,
    paddingHorizontal:8,
    paddingVertical:13,
    borderRadius:3,
    backgroundColor:colors.boxmeBrand
  }
});

export default React.memo(FNSKUItems);
