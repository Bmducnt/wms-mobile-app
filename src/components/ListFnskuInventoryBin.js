import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View } from 'react-native';
import {
  Feather,
  FontAwesome5
} from "@expo/vector-icons";
import {
  colors,
  gStyle ,
  device,
  images
} from '../constants';
import Badge from "./Badge";
import {translate} from "../i18n/locales/IMLocalized";

const ListFnskuInventoryBin = ({
  navigation,
  fnsku_info,
  disableRightSide,
  onChangeLocation,
  tracking_code,
  cycle_code,
  cycle_type,
  cycle_item,
  staff_role
}) => {
  const [imageError, setimageError] = React.useState(false);
  return (
    <View style={[styles.container]}>
        <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        disabled={disableRightSide}
        style={styles.blockItem}
        >
          <View style={gStyle.flex5}>
            <View style={[gStyle.flexRowSpace,{paddingHorizontal:10}]}>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>
                  {cycle_type ?  translate('screen.module.pickup.list.location') : translate('screen.module.pickup.detail.fnsku_code')}</Text>

              </View>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{translate('screen.module.cycle_check.detail.stock_bin_check')}</Text>
              </View>
            </View>
            <View style={[gStyle.flexRowSpace,{paddingHorizontal:10}]}>
              <View style={gStyle.flexRow}>
                  <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                    <FontAwesome5 name="barcode" size={14} color={colors.white} />{" "}{fnsku_info.fnsku_location ? fnsku_info.fnsku_location : fnsku_info.fnsku_code}
                  </Text>
              </View>
              <View style={gStyle.flexRowCenter}>
                  {cycle_item.is_error ?<Text style={[styles.textCode,{color:colors.boxmeBrand}]}>
                    {fnsku_info.fnsku_stock_check}
                  </Text>:
                  <Text style={[styles.textCode,{color:colors.boxmeBrand}]}>
                    {fnsku_info.fnsku_stock_check}{[1, 2].includes(staff_role) ? `/${fnsku_info.fnsku_stock_bin}` : ''}
                </Text>}
              </View>
            </View>
            <View style={[gStyle.flexRow,{width:'77%',paddingHorizontal:10}]}>
              {!fnsku_info.fnsku_image ? (
                <View style={{ width: 65, marginTop: 5 }}>
                  <Image
                    style={styles.imageProduct}
                    source={images['no_image_available']}
                  />
                </View>
              ) : (
                <View style={{ width: 65, marginTop: 5 }}>
                  <Image
                    style={styles.imageProduct}
                    source={
                      {uri: fnsku_info.fnsku_image}}
                    onError={() => setimageError(true)}
                  />
                </View>
              )}
              <View>
                <Text style={[styles.textValue,{paddingTop:5}]} numberOfLines={4} ellipsizeMode="tail">
                {fnsku_info.fnsku_code}
                </Text>
                <Text style={[styles.textValue]} numberOfLines={2} ellipsizeMode="tail">
                {fnsku_info.fnsku_name.toLowerCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.percentBar,{marginLeft:'2%'}]}></View>
            <View style={[gStyle.flexRowSpace,{paddingTop:3,paddingHorizontal:10}]}>
                <Text style={styles.textLabel}>{translate('screen.module.putaway.uom')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{fnsku_info.fnsku_uom}</Text>
            </View>
            <View style={[gStyle.flexRowSpace,{paddingHorizontal:10}]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.detail.expire_date')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >
                  {fnsku_info.expire_date.substring(0,10)}
                </Text>
            </View>
            <View style={[gStyle.flexRowSpace,{paddingHorizontal:10}]}>
                <Text style={styles.textLabel}>Batch/lot</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >
                  {fnsku_info.batch_lot_code}
                </Text>
            </View>

            <View style={[gStyle.flexRowSpace,{paddingHorizontal:10}]}>
                <Text style={styles.textLabel}>Stock level</Text>
                <Badge
                    name={`${fnsku_info?.stock_level}`}
                    style={{
                      backgroundColor: fnsku_info.stock_level ? colors.boxmeBrand : colors.red,
                      color: colors.white,
                      borderRadius: 50,
                    }}/>
            </View>


            {cycle_item.is_error && <View style={[gStyle.flexRowCenterAlign,{padding:5,backgroundColor:colors.borderLight,marginTop:5}]}>
              <Feather name="alert-triangle" size={16} color={colors.boxmeBrand} />
              <Text style={{ color: colors.boxmeBrand,...gStyle.textBoxme14,paddingLeft:6}}>
                {translate('screen.module.cycle_check.detail.location_error')}
              </Text>
            </View>}
          </View>
        </TouchableOpacity>

    </View>
  );
};

ListFnskuInventoryBin.defaultProps = {
  disableRightSide: null,
  onChangeLocation : null,
  tracking_code : null,
  cycle_code : null,
  cycle_type : false,
  cycle_item : {},
  iconLibrary: 'Feather',
  fnsku_info :{
    expire_date :'N/A',
    manufacturing_date : 'N/A',
    fnsku_stock_check : 0
  }
};

ListFnskuInventoryBin.propTypes = {
  fnsku_info: PropTypes.shape({
    fnsku_code: PropTypes.string,
    fnsku_stock_bin : PropTypes.number,
    fnsku_stock_check : PropTypes.number,
    fnsku_name: PropTypes.string,
    expire_date : PropTypes.string,
    manufacturing_date : PropTypes.string,
    fnsku_location : PropTypes.string,
    fnsku_uom : PropTypes.string
  }).isRequired,
  staff_role: PropTypes.number.isRequired,
  cycle_code : PropTypes.string,
  tracking_code : PropTypes.string,
  onChangeLocation : PropTypes.func,
  cycle_item : PropTypes.object,
  disableRightSide: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    marginVertical:4,
    borderRadius:3,
    backgroundColor:colors.cardLight
  },
  blockItem :{
    paddingVertical:4
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
  },
  textLabel :{
    ...gStyle.textboxme14,
    color:colors.greyInactive,
  },
  imageProduct: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  btnCheckLocation: {
    position: "absolute",
    right: 15,
    top:device.iOS ? device.iPhoneNotch ? 40 : 40 : 45,
    padding: 3,
    zIndex: 10,
    borderRadius: 3,
    backgroundColor: colors.boxmeBrand
  }

});

export default ListFnskuInventoryBin;
