import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native';
import moment from 'moment';
import {
  colors,
  gStyle,
  images
} from '../constants';
import {
  Entypo,
  FontAwesome5
} from "@expo/vector-icons";
import Badge from './Badge';
import {translate} from "../i18n/locales/IMLocalized";

const ListItemsPutaway = ({
  navigation,
  itemInfo,
  disableRightSide,
  onPressModel
}) => {

  return (
    <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          onPress={() => navigation.navigate('ModalPutawayUpdate',{
              'box_code' : itemInfo.box_code,
              'type_putaway' : itemInfo.type_putaway,
              'putaway_id' : itemInfo.putaway_id,
              'box_info' : itemInfo,
              'is_rollback' : itemInfo.is_rollback,
              'tab_id' : itemInfo.tab_id,
              'storage_type' : itemInfo.storage_type
            })}
          style={styles.container}

        >
          <View style={[gStyle.flex5]}>
            {itemInfo.tracking_code && <View style={[gStyle.flexRowSpace,{marginBottom:8}]}>
                <Text style={[styles.textLabel,{color:colors.white}]}>{itemInfo.tracking_code}</Text>
                <Text style={[styles.textLabel,{color:colors.white}]}>Box : {itemInfo.box_po}</Text>
            </View>}

            <View style={[gStyle.flexRow]}>

              <TouchableOpacity style={{width:55,marginTop:5}} onPress= {() => navigation.navigate("HandoverImages",
                  {handover_code : null,load_local : true,path :[{uri:itemInfo.image_product},images['no_image_available']]})}>
                <Image
                  style={[styles.imageProduct,{marginTop: itemInfo.image_product ? 0 : -8}]} source={itemInfo.image_product ?
                    {uri:itemInfo.image_product}:
                    images['no_image_available']
                  }
                  />
              </TouchableOpacity>

              <View style={{marginHorizontal:10}}>
                <View style={[gStyle.flexRowSpace,{paddingLeft:10}]}>
                  <View style={gStyle.flexRow}>
                  {itemInfo.tab_id == 3 || itemInfo.tab_id === 4 ?<Text style={styles.textLabel}>{translate('screen.module.putaway.putaway_code')}</Text> :
                  <Text style={styles.textLabel}>
                    {translate('screen.module.putaway.text_fnsku_code')}{" "}
                    <FontAwesome5 name="barcode" size={14} color={colors.white} />
                  </Text>}
                  </View>
                  <View style={gStyle.flexRow}>
                      <Text style={styles.textLabel}>{translate('screen.module.putaway.text_quantity')}</Text>
                  </View>
                </View>

                <View style={[gStyle.flexRowSpace,{paddingLeft:10}]}>
                  <View style={gStyle.flexRow}>
                      <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                        {itemInfo.type_putaway ? itemInfo.fnsku_barcode : itemInfo.box_code}
                      </Text>
                  </View>
                  <View style={gStyle.flexRowCenter}>
                      {itemInfo.tab_id == 'RMA_A' ? <Text style={[styles.textCode,{color:colors.white}]}>
                          {itemInfo.quantity_putaway}/{itemInfo.quantity_box}
                      </Text>:<Text style={[styles.textCode,{color:colors.white}]}>
                          {itemInfo.quantity_box}
                      </Text>}
                  </View>
                </View>
                <View style={[gStyle.flexRowSpace,{paddingLeft:10,width:Dimensions.get("window").width-90}]}>
                    {(itemInfo.tab_id == 'RMA_A' || itemInfo.tab_id === 'RMA_D1' || itemInfo.tab_id === 'RMA_D2' || itemInfo.tab_id === 'RMA_D3')  ? <View style={gStyle.flexRow}>
                    <Text numberOfLines={1} style={{ color: colors.white,...gStyle.textboxme14,paddingLeft:3}}>
                    {`${itemInfo.total_damageds} ${translate('screen.module.putaway.qt_damaged')}`}
                    </Text>
                    <Text numberOfLines={1} style={{ color: colors.white,...gStyle.textboxme14,paddingLeft:6}}>
                    {`${itemInfo.total_losts} ${translate('screen.module.putaway.qt_lost')}`}
                    </Text>
                  </View>:
                    <Text style={[styles.textValue,{width:'95%',color:colors.greyInactive}]} numberOfLines={2} >{itemInfo.fnsku_name}</Text>}
                </View>
              </View>
            </View>

            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRow,{paddingTop:3}]}>
              <Badge
                name={`${translate('screen.module.putaway.condition_goods')} ${itemInfo.condition_goods}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: itemInfo.condition_goods === 'A' ?colors.white:colors.white,
                  borderRadius: 6
                }}
              />
              <Badge
                name={`${translate('screen.module.putaway.zone_code')} ${itemInfo.zone_code} `}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.white,
                  borderRadius: 6
                }}
              />
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.detail.expire_date')}</Text>
                {itemInfo.expire_date ?<Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.expire_date.substring(0,10)}</Text>
                :<Text style={[styles.textValue]} numberOfLines={1}>N/A</Text>}
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.uom')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.fnsku_uom}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.inspection_by')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{itemInfo.created_by}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.list.time')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{moment(itemInfo.time_created).fromNow()}</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:3}]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.location_code')}</Text>
                <Text style={[styles.textValue,{color:colors.boxmeBrand}]} numberOfLines={1} >{itemInfo.location_code}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.update_by')}</Text>
                <Text style={[styles.textValue,{color:colors.boxmeBrand}]} numberOfLines={1} >{itemInfo.update_by}</Text>
            </View>
            {!disableRightSide && <View style={styles.percentBar}></View>}
            {!disableRightSide && <View style={[gStyle.flexRowSpace,{
                      marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.error_text')}</Text>
                <TouchableOpacity
                    onPress={() =>onPressModel(itemInfo.tracking_code,itemInfo.fnsku_barcode,itemInfo.box_code)}
                    style={{
                      paddingHorizontal:6,
                      paddingVertical:10,
                      borderRadius:3,
                      backgroundColor:colors.darkgreen
                    }}
                  >

                    <Text style={{ color: colors.white,...gStyle.textBoxme14 }}>
                    {translate('screen.module.putaway.error_text_btn')}
                    </Text>
                </TouchableOpacity>
            </View>}
          </View>

        </TouchableOpacity>
    </View>
  );
};

ListItemsPutaway.defaultProps = {
  disableRightSide: null,
  iconLibrary: 'Feather',
  itemInfo : {
    is_rollback : false,
    image_product : null,
    expire_date : null,
    tracking_code: null,
    box_po : null,
    storage_type : 0,
    quantity_putaway : 0,
    total_accepts : 0,
    total_damageds : 0,
    total_losts : 0,
    total_destroys : 0,
    zone_code : 'N/A',
    condition_goods:'N/A',
    location_code : 'N/A',
    update_by : 'N/A'
  }
};

ListItemsPutaway.propTypes = {
  itemInfo: PropTypes.shape({
    time_created: PropTypes.string,
    zone_code : PropTypes.string,
    condition_goods : PropTypes.string,
    created_by: PropTypes.string.isRequired,
    box_code: PropTypes.string.isRequired,
    quantity_box : PropTypes.number.isRequired,
    quantity_putaway : PropTypes.number,
    total_accepts : PropTypes.number,
    total_damageds : PropTypes.number,
    total_losts : PropTypes.number,
    total_destroys : PropTypes.number,
    status_code:PropTypes.number,
    status_name :PropTypes.string,
    fnsku_name : PropTypes.string,
    fnsku_barcode : PropTypes.string,
    type_putaway : PropTypes.bool,
    putaway_id : PropTypes.string,
    expire_date : PropTypes.string,
    is_rollback : PropTypes.bool,
    tab_id : PropTypes.string.isRequired,
    image_product : PropTypes.string,
    tracking_code : PropTypes.string,
    box_po: PropTypes.string,
    update_by: PropTypes.string,
    storage_type : PropTypes.number,
    location_code: PropTypes.string
  }).isRequired,
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
  textCode: {
    ...gStyle.textBoxmeBold14,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxme14,
    color: colors.white,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive,
  },
  blockRightNext: {
    alignItems:'flex-end',
    position: 'absolute',
    right: 24,
    top:32,
  },
  imageProduct :{
    width: 60,
    height: 60,
    borderRadius : 10
  },
  percentBar:{
    height:1,
    marginTop:10,
    width:'100%',
    backgroundColor:colors.borderLight
  }
});

export default React.memo(ListItemsPutaway);
