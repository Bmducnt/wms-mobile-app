import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View,Dimensions,ActivityIndicator} from 'react-native';
import moment from 'moment';
import {SvgUri} from 'react-native-svg';
import { colors, gStyle } from '../../constants';
import Badge from '../../components/Badge';

const   ItemOrderPacked = ({
  itemInfo,
  translate,
  onPress,
  isloading,
  onListBox,
  navigation,
  onSelect
}) => {

  
  return (
    <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          style={styles.container}
        >
          <View style={[gStyle.flex5]}>
            <View style={[gStyle.flexRowSpace]}>
              <View >
                  <SvgUri
                      width={55}
                      height={55}
                      uri={itemInfo.tracking_logo}
                  />
              </View>
              <View style={{width:Dimensions.get("window").width-85,marginTop:-5}}>
                <View style={gStyle.flexRowSpace}>
                    <Text style={[styles.textLabel]}>{translate('screen.module.packed.item.tracking_code')}</Text>
                    <Text style={[styles.textValue,{color:colors.boxmeBrand}]}>{itemInfo.tracking_code}</Text>
                </View>
                <View style={gStyle.flexRowSpace}>
                  <Text style={[styles.textLabel]}>{translate('screen.module.packed.item.sold')}</Text>
                  <Text style={[styles.textValue]}>{itemInfo.tracking_quantity}</Text>
                </View>
                <View style={gStyle.flexRowSpace}>
                  <Text style={[styles.textLabel]}>{translate('screen.module.packed.item.update_time')}</Text>
                  <Text style={[styles.textValue]}>{itemInfo.time_update ? moment(itemInfo.time_update).fromNow() : 'N/A'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
              <Text style={styles.textLabel}>
                
                {translate('screen.module.packed.item.tracking_type')}
              </Text>
              <Badge
                name={`${itemInfo.tracking_type}`}
                style={{
                  backgroundColor: colors.borderLight,
                  color: colors.boxmeBrand,
                  borderRadius: 6,
                }}
              />
            </View>
            <View style={[gStyle.flexRowSpace]}>
              <Text style={styles.textLabel}>
                {translate('screen.module.packed.item.tracking_po')}
              </Text>
              <Text style={[styles.textValue]}>{itemInfo.tracking_po}</Text>
            </View>
            <View style={[gStyle.flexRowSpace]}>
              <Text style={styles.textLabel}>
              {translate('screen.module.packed.item.tracking_source')}
              </Text>
              <Text style={[styles.textValue]}>{itemInfo.tracking_source}</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
              <Badge
                name={itemInfo.tracking_packed_done ? translate('screen.module.packed.status_done') :
                  translate('screen.module.packed.status_awaiting')}
                style={{
                  backgroundColor: colors.borderLight,
                  color: itemInfo.tracking_packed_done ? colors.brandPrimary:colors.boxmeBrand,
                  borderRadius: 6,
                }}
              />
              <View style={gStyle.flexRow}> 
                <TouchableOpacity
                  onPress={() => onListBox(itemInfo.tracking_code)}
                  style={{
                    paddingHorizontal:6,
                    paddingVertical:10,
                    borderRadius:3,
                    flexDirection:"row",
                    backgroundColor:colors.borderLight
                  }}
                >
                  {isloading && <ActivityIndicator color={colors.white} size={12} />} 
                  <Text style={{ color: colors.white,...gStyle.textboxme14,paddingLeft:5}}>
                    {translate('screen.module.packed.item.list_box')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelect(itemInfo.tracking_code,itemInfo.list_items)}
                  style={{
                    paddingHorizontal:6,
                    paddingVertical:10,
                    borderRadius:3,
                    marginLeft:3,
                    backgroundColor:colors.borderLight
                  }}
                >
                  <Text style={{ color: colors.white,...gStyle.textboxme14 }}>
                  {translate('screen.module.packed.item.list_fnsku')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[{marginTop:5}]}>
                <Text style={[styles.textLabel]}>{translate('screen.module.packed.item.note')}</Text>
                <Text style={[styles.textValue]}>{itemInfo.pickup_note}</Text>
            </View>
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={[styles.textLabel]}>{translate('screen.module.packed.item.text1')}{" "}
                 {itemInfo.total_fnsku}{" "}{translate('screen.module.packed.item.text2')}</Text>
                {itemInfo.status_id === 101 &&  <TouchableOpacity
                      onPress={() => navigation.navigate('ModalUpdatePacked',{
                        'pickup_code' : itemInfo.tracking_code
                      })}
                      style={{
                        paddingHorizontal:6,
                        paddingVertical:10,
                        borderRadius:3,
                        marginLeft:3,
                        backgroundColor:colors.darkgreen
                      }}
                    >
                      <Text style={{ color: colors.white,...gStyle.textboxme14 }}>
                      {translate('screen.module.packed.btn_packed')}
                      </Text>
                </TouchableOpacity>}
              </View>
          </View>
        </TouchableOpacity>
        
    </View>
  );
};

ItemOrderPacked.defaultProps = {
  disableRightSide: null,
  iconLibrary: 'Feather',
  onPress:null
};

ItemOrderPacked.propTypes = {
  itemInfo: PropTypes.shape({
    time_update: PropTypes.string,
    tracking_code : PropTypes.string.isRequired,
    quantity : PropTypes.number.isRequired,
    tracking_type : PropTypes.string,
    tracking_logo : PropTypes.string,
    tracking_quantity : PropTypes.number,
    tracking_source : PropTypes.string,
    tracking_po : PropTypes.string,
    tracking_packed_done : PropTypes.bool,

  }).isRequired,
  onSelect : PropTypes.func,
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
    color: colors.white
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  },
  
});

export default ItemOrderPacked;
