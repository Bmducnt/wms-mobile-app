import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import SettingsStaff from '../screens/SettingsStaff';

// icons
import SvgTabLibrary from '../components/icons/Svg.TabLibrary';

const Icon = ({ focused }) => <SvgTabLibrary active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    LibraryMain: {
      screen: SettingsStaff
    }
  },
  {
    headerMode: 'none',
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.settings'),
      tabBarIcon: Icon
    })
  }
);
