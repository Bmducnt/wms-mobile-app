import * as React from 'react';
import PropTypes from 'prop-types';
import { SvgUri } from "react-native-svg";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import moment from 'moment';
import { colors, gStyle } from '../constants';
import {translate} from "../i18n/locales/IMLocalized";

const LineOrderTracking = ({ active, onPress, orderData}) => {
  const activeColor = active ? colors.brandPrimary : colors.white;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        disabled={onPress ===null}
        onPress={() => onPress(orderData.tracking_code)}
      >
        <View style={gStyle.flexRow}>
          <View style={{width : 60}}>
            <SvgUri width={55} height={55} uri={orderData.logo_hvc} />
          </View>
          <View style={[{width:Dimensions.get("window").width - 90,marginLeft:5}]}>
              <View style={gStyle.flexRowSpace}>
                <View style={gStyle.flexRow}>
                    <Text style={styles.textLabel}>{translate('screen.module.handover.tracking_code')}</Text>

                </View>
                <View style={[gStyle.flexRow]}>
                    <Text style={[styles.textLabel]}>{translate('screen.module.handover.tracking_status')}</Text>
                </View>
              </View>
              <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
                <Text style={[styles.title, { color: activeColor }]}>
                  {orderData.tracking_code}
                </Text>
                <View style={gStyle.flexRowCenterAlign}>
                  <View style={[styles.dot,{backgroundColor:orderData.badge_color}]}></View>
                  <Text style={[styles.textLabelValue]}>{orderData.status_name}</Text>
                </View>
              </View>
              <View style={[gStyle.flexRowSpace,{paddingTop:3}]}>
                <Text style={styles.orderTime}>{moment(orderData.created_date).fromNow()}</Text>
                {orderData.status_name !== 'Shipped' ?
                  <Text style={[styles.textLabelValue,{color:colors.boxmeBrand}]}>
                    {translate('screen.module.handover.kpi_fail')} - {orderData.failed_time_kpi} {translate('screen.module.handover.kpi_hour')}
                  </Text>
                : <Text style={[styles.textLabelValue,{color:colors.brandPrimary}]}>
                  Sẵn sàng giao sau  - {orderData.ready_to_ship} {translate('screen.module.handover.kpi_hour')}
                </Text>}
              </View>
          </View>
        </View>
        <View style={[gStyle.flexRowSpace,{marginTop:5}]}>
            <View style={gStyle.flexRow}>
                <Text style={styles.textLabel}>{translate('screen.module.handover.tracking_quantity')}</Text>
            </View>
            <View style={[gStyle.flexRow]}>
                <Text style={styles.textLabelValue}>{orderData.total}(pcs)</Text>
            </View>
        </View>
        <View style={gStyle.flexRowSpace}>
            <View style={gStyle.flexRow}>
                <Text style={styles.textLabel}>{translate('screen.module.handover.tracking_weight')}</Text>
            </View>
            <View style={[gStyle.flexRow]}>
                <Text style={styles.textLabelValue}>{orderData.weight}(gram)</Text>
            </View>
        </View>
        <View style={gStyle.flexRowSpace}>
            <View style={gStyle.flexRow}>
                <Text style={styles.textLabel}>{translate('screen.module.handover.tracking_box')}</Text>
            </View>
            <View style={[gStyle.flexRow]}>
                <Text style={styles.textLabelValue}>{orderData.box_packed}</Text>
            </View>
        </View>
        <View style={gStyle.flexRowSpace}>
            <View style={gStyle.flexRow}>
                <Text style={styles.textLabel}>{translate('screen.module.handover.tracking_scan')}</Text>
            </View>
            <View style={[gStyle.flexRow]}>
                <Text style={[styles.textLabelValue,{color:colors.boxmeBrand,...gStyle.textBoxmeBold16}]}>{orderData.handover_scan}</Text>
            </View>
        </View>
        <View style={styles.percentBar}></View>
      </TouchableOpacity>
    </View>
  );
};

LineOrderTracking.defaultProps = {
  active: false,
  downloaded: false
};

LineOrderTracking.propTypes = {
  // required
  onPress: PropTypes.func,
  orderData: PropTypes.shape({
    tracking_code: PropTypes.string.isRequired,
    status_name: PropTypes.string.isRequired,
    created_date : PropTypes.string,
    badge_color:PropTypes.string,
    failed_kpi:PropTypes.bool,
    failed_time_kpi:PropTypes.number
  }).isRequired,

  // optional
  active: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal:10,
    marginVertical:5
  },
  percentBar:{
    height:1,
    marginTop:10,
    width:Dimensions.get("window").width-30,
    backgroundColor:colors.borderLight
  },
  textLabel :{
    ...gStyle.textBoxme14,
    color:colors.greyInactive
  },
  textLabelValue :{
    ...gStyle.textBoxme14,
    color:colors.white
  },
  title: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  },
  orderTime: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  },
  dot :{
    height:8,
    width:8,
    backgroundColor : colors.boxmeBrand,
    borderRadius:8/2,
    marginRight:3
  }
});

export default LineOrderTracking;
