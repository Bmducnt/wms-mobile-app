import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import ListPacking from '../screens/packed/ListPacking';
import DetailPacking from '../screens/packed/DetailPacking';
// icons
import SvgTabPacked from '../components/icons/Svg.Packed';

const Icon = ({ focused }) => <SvgTabPacked active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    PackedMain: {
      screen: ListPacking
    },
    DetailPacking
  },
  {
    headerMode: 'none',
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.packed'),
      tabBarIcon: Icon
    })
  }
);
