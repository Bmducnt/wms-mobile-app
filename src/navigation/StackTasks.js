import * as React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import ListTasks from '../screens/tasks/ListTasks';
import DetailTask from '../screens/tasks/DetailTask';
// icons
import SvgTabTask from '../components/icons/Svg.Tasks';

const Icon = ({ focused }) => <SvgTabTask active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    ListTasks: {
      screen: ListTasks
    },
    DetailTask
  },
  {
    headerMode: 'none',
    navigationOptions: ({ screenProps: { t } }) => ({
      tabBarLabel: t('screen.menu.task'),
      tabBarIcon: Icon
    })
  }
);
