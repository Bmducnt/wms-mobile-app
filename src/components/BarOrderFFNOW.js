import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import * as Animatable from "react-native-animatable";
import {
  colors,
  gStyle } from '../constants';
import {translate} from "../i18n/locales/IMLocalized";
class BarOrderFFNOW extends React.Component {

  constructor() {
    super();
  }

  render() {
    const {
      navigation,
      orderffNow,
      timeRequest,
      loading } = this.props;
    return (
      <View
        style={styles.container}
      >
        <View style={[gStyle.flexRowSpace,gStyle.flexRowCenterAlign]}>
            <View style={{width:'70%'}}>
              <Text style={{
                  ...gStyle.textBoxme14,
                    color: colors.white,
                }}
                numberOfLines={1}
              >{translate('screen.module.home.handover_total')} {orderffNow} {translate('screen.module.home.report_order.ff_now')}</Text>
              <Text style={{
                    ...gStyle.textBoxme10,
                    color: colors.greyInactive}}
              >{moment(timeRequest).fromNow()}</Text>
            </View>
            <Animatable.View
                        style={gStyle.flexRowCenterAlign}
                        animation={ "flash"}
                        iterationCount={10}
                    >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  paddingHorizontal:6,
                  paddingVertical:8,
                  backgroundColor:colors.darkgreen,
                  borderRadius:2
                }}
                onPress={() => navigation.navigate("ModelListStaff", {is_ff_now : true})}
              >
                {!loading ? <Text style={{
                    fontSize:14,
                    color: colors.white}}>{translate('screen.module.home.report_order.tab_create_pk')}
                </Text>:<ActivityIndicator/>}
              </TouchableOpacity>
            </Animatable.View>
        </View>
      </View>
    );
  }
}

BarOrderFFNOW.defaultProps = {
  song: null
};

BarOrderFFNOW.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.borderLight,
    paddingVertical: 8,
    paddingHorizontal:10,
    width: '100%'
  }
});

export default NavigationContainer(BarOrderFFNOW);
