import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import ListInventory from '../screens/inventory_control/ListInventory';
import DetailResquest from '../screens/inventory_control/DetailResquest';
// icons
import SvgTabCycle from '../components/icons/Svg.Cycle';

const Icon = ({ focused }) => <SvgTabCycle active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    ListInventory: {
      screen: ListInventory
    },
    DetailResquest
  },
  {
    headerMode: 'none',
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.inventory_control'),
      tabBarIcon: Icon
    })
  }
);
