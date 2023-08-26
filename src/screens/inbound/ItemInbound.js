import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, device, gStyle } from "../../constants";

const ItemInbound = ({
  navigation,
  inboundItem,
  translate
}) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={gStyle.activeOpacity}
          onPress={() => null}
          style={styles.container}
        >
          <View style={[gStyle.flex5]}>
             <View style={gStyle.flexRow}>
                <Text style={[styles.textLabel,{color:colors.white}]} numberOfLines={1} ellipsizeMode="tail">
                    {inboundItem.tracking_code}</Text>
              </View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>{translate('screen.module.pickup.list.sold')}</Text>
              </View>
              <View style={gStyle.flexRow}>
                  <Text style={styles.textLabel}>Trạng thái</Text>
              </View>
            </View>
            <View style={gStyle.flexRowSpace}>
              <View style={gStyle.flexRow}>
                  <Text style={[styles.textCode]} numberOfLines={1} ellipsizeMode="tail">
                    {inboundItem.quantity}</Text>
              </View>
              <View style={gStyle.flexRowCenter}>
                <TouchableOpacity
                  style={gStyle.flexRow}
                >
                  <Feather color={inboundItem.status_id === 300 ? colors.boxmeBrand : inboundItem.status_id === 305 ? colors.brandPrimary : '#fd0d37'} name="zap" size={14} />
                  {inboundItem.status_id === 300 && <Text style={{ paddingLeft:5,color: colors.boxmeBrand,...gStyle.textBoxme12 }}>
                    {translate('screen.module.pickup.list.status_await')}
                  </Text>}
                  {inboundItem.status_id === 301 && <Text style={{ paddingLeft:5,color: '#fd0d37',...gStyle.textBoxme12}}>
                    Đang xử lý
                  </Text>}

                  {inboundItem.status_id === 305 && <Text style={{ paddingLeft:5,color: colors.brandPrimary,...gStyle.textBoxme12}}>
                    Đã nhập kho
                  </Text>}

                  {inboundItem.status_id === 306 && <Text style={{ paddingLeft:5,color: '#fd0d37',...gStyle.textBoxme12}}>
                    Đã huỷ
                  </Text>}
          
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.percentBar}></View>
            <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
                <Text style={styles.textLabel}>{translate('screen.module.pickup.list.time')}</Text>
                <Text style={[styles.textValue]} numberOfLines={1} >{inboundItem.time_created}</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        
    </View>
  );
};

ItemInbound.defaultProps = {
  iconLibrary: 'Feather'
};

ItemInbound.propTypes = {
  inboundItem: PropTypes.shape({
    time_created: PropTypes.string,
    inspection_type: PropTypes.string.isRequired,
    received_date: PropTypes.string,
    quantity : PropTypes.number.isRequired,
    tracking_code : PropTypes.string,
    from_user_name : PropTypes.string,
    from_user_phone : PropTypes.number,
    status_id : PropTypes.number,
    weight : PropTypes.number
  }).isRequired
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
    ...gStyle.textBoxmeBold16,
    color:colors.white,
  },
  textValue: {
    ...gStyle.textBoxme16,
    color: colors.white,
    paddingLeft: 10,
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  },
  containerRight: {
    alignItems: "flex-end",
    position: "absolute",
    right: 15,
    top: 40
  },
  blockRight : {
    alignItems: "flex-end",
    position: "absolute",
    right: 15,
    top: 5
  },
  textRight:{
    ...gStyle.textBoxmeBold16,
    color:colors.white
  },
  statusItems: {
    position: "absolute",
    right: 10,
    top: 50,
    padding: 4,
    borderRadius: 6,
  }
});

export default ItemInbound;
