import * as React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { colors, gStyle ,device} from "../constants";
const LineOrderOubound = ({
  logo_carrier,
  code,
  quantity,
  staff_email,
  time_created,
  status_code,
  navigation,
  trans,
  status_id,
  is_approved,
  is_error,
  onPressConfirm,
  reason_note
}) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => navigation.navigate("ModelTimelineTracking", {"tracking_code" : code,"is_show" : true})}
        style={styles.container}
      >
        <View style={gStyle.flex5}>
          <View style={gStyle.flexRow}>
            <View style={styles.image}>
              <SvgUri width={55} height={55} uri={logo_carrier} />
            </View>
            <View style={{ width:Dimensions.get("window").width-80,marginTop:0}}>
              <View style={gStyle.flexRowSpace}>

                <Text
                  style={[styles.textCode]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {code}
                </Text>
                <Text style={styles.textRight}>{quantity}</Text>
              </View>
              <View style={gStyle.flexRowSpace}>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  
                  {trans('screen.module.handover.update_by')}
                </Text>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {staff_email}
                </Text>
              </View>
              <View style={gStyle.flexRowSpace}>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {trans('screen.module.handover.tracking_status')}
                </Text>
                <TouchableOpacity
                onPress={() => null}
              >
                {is_error ?<Text style={{ color: colors.boxmeBrand,...gStyle.textBoxme14 }} numberOfLines={1}>
                  <Feather color={colors.boxmeBrand} name="x-circle" size={12} />{" "}
                  {trans('screen.module.handover.btn_remove')}
                </Text> : 
                <Text style={{ color: colors.brandPrimary,...gStyle.textBoxme14 }} numberOfLines={1}>
                    {status_code}
                  </Text>
                }
              </TouchableOpacity>
              </View>
              {is_error && <View style={gStyle.flexRowSpace}>
                <Text
                  style={styles.textInfo}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {trans('screen.module.handover.reason_note')}
                </Text>
                <Text style={{ color: colors.brandPrimary,...gStyle.textBoxme14 }} numberOfLines={1}>
                    {reason_note}
                </Text>
              </View> }
            </View>
          </View>
          <View style={[styles.percentBar]}></View>
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

LineOrderOubound.defaultProps ={
  is_error: false
}
LineOrderOubound.propTypes = {
  logo_carrier: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  staff_email: PropTypes.string.isRequired,
  time_created: PropTypes.string.isRequired,
  status_code : PropTypes.string,
  status_id : PropTypes.number,
  is_approved : PropTypes.bool,
  reason_note : PropTypes.string,
  is_error : PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal:5,
    paddingVertical:3,
    width: "100%",
  },
  percentBar:{
    height:1,
    marginTop:3,
    width:`100%`,
    marginLeft: device.iPhoneNotch ? '18%' : '16%',
    backgroundColor:colors.borderLight
  },
  containerInfo: {
    marginTop: 5,
    marginLeft: 8,
    flexDirection: "row",
  },
  textCode: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
    marginLeft: 8,
  },
  textInfo: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive,
    marginLeft: 8,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  textRight: {
    ...gStyle.textBoxmeBold14,
    color: colors.white,
  }
});

export default React.memo(LineOrderOubound);
