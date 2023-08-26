import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import Home from '../screens/Home';
// icons
import SvgTabHome from '../components/icons/Svg.TabHome';

const Icon = ({ focused }) => <SvgTabHome active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    Home
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    detachPreviousScreen : true,
    screenOptions:{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      // animationEnabled: false,
    },
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.home'),
      tabBarIcon: Icon
    })
  }
);
