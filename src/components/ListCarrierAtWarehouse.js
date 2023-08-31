import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors, gStyle, device, images } from '../constants';
import {translate} from "../i18n/locales/IMLocalized";

const ListCarrierName = ({
  logo_carrier,
  carrier_name,
  courier_id,
  onPress,
  quantity,
  is_select,
  text_note1,
  text_note2,
  avarta_name,
  is_show_note,
  text_note3,
  avarta }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={() => { !avarta ? onPress(carrier_name, logo_carrier, courier_id,) : onPress(courier_id) }}
        style={[styles.container]}
      >
        <View style={gStyle.flex5}>
          <View style={gStyle.flexRow}>
            {!avarta ? (<View style={styles.image}>
              <SvgUri
                width={55}
                height={55}
                uri={logo_carrier}
              />
            </View>) :
              <View style={[gStyle.flexRowCenter, { height: 45, width: 45, borderRadius: 45 / 2, backgroundColor: is_select === courier_id ? colors.darkgreen : colors.borderLight }]}>
                <AntDesign name="enviroment" size={18} color={colors.white} />
              </View>}
            <View >
              <Text style={[styles.textCode, { marginTop: !is_show_note ? 15 : 5 }]} numberOfLines={1} ellipsizeMode="tail">
                {carrier_name}
              </Text>
              {is_show_note && <View style={styles.containerStatus}>
                <Text style={[styles.textRight, { ...gStyle.textBoxme14 }]} numberOfLines={1}>
                  {`${translate(text_note1)} ${quantity.toLocaleString()} ${translate(text_note2)}`}
                </Text>
                {text_note3 && <Text style={[styles.textRight, { ...gStyle.textBoxme14,color:colors.white }]} numberOfLines={1}>
                  {text_note3}
                </Text>}
              </View>}
            </View>
          </View>

          <View style={[styles.percentBar]}></View>
        </View>
        <View style={styles.containerRight}>
          {is_select === courier_id ? <Feather color={colors.brandPrimary} name="check-circle" size={16} /> :
            <Feather color={colors.greyInactive} name="circle" size={14} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

ListCarrierName.defaultProps = {
  avarta: false,
  is_show_note: true,
  quantity: 0
};

ListCarrierName.propTypes = {
  logo_carrier: PropTypes.string,
  carrier_name: PropTypes.string,
  avarta: PropTypes.bool,
  is_show_note: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  quantity: PropTypes.number,

};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 3,
    width: '100%'
  },
  containerStatus: {
    marginTop: 3,
    marginLeft: 10
  },
  percentBar: {
    height: 1,
    width: `100%`,
    marginLeft: device.iPhoneNotch ? '20%' : '22%',
    backgroundColor: colors.borderLight
  },
  textCode: {
    ...gStyle.textBoxme14,
    color: colors.white,
    marginTop: 2,
    marginLeft: 10,
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  },
  imageAvatar: {
    width: 45,
    height: 50,
  },
  blockRight: {
    alignItems: 'flex-end',
    position: 'absolute',
    top: 60,
    right: 15,
  },
  textRight: {
    ...gStyle.textBoxme14,
    color: colors.greyInactive
  }
});

export default React.memo(ListCarrierName);
