import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import PickupsLists from '../screens/pickups/ListPickup';
import PickupDetails from '../screens/pickups/DetailPickup';
import PickupRules from '../screens/pickups/PickupRules'
// icons
import SvgTabPicked from '../components/icons/Svg.Picked';

const Icon = ({ focused }) => <SvgTabPicked active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    PickupMain: {
      screen: PickupsLists,
      navigationOptions: {
        cardStyle: { backgroundColor: 'transparent' , opacity: 1}
      }
    },
    PickupDetails,
    PickupRules
  },
  {
    headerMode: 'none',
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.pickup'),
      tabBarIcon: Icon
    })
  }
);
