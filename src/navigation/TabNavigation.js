import * as React from 'react';
import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants';

// navigation stacks
import StackTasks from './StackTasks';
import StackSearch from './StackSearch';
import StackLibrary from './StackLibrary';
import StackCycle from './StackCycle';
import StackPickup from './StackPickup';
// components
import CustomTabBar from '../components/CustomTabBar';




const styleNotDynamicIsland = {
  backgroundColor: colors.cardLight,
  borderTopWidth: 0,
}

const styleDynamicIsland = {
  backgroundColor: colors.cardLight,
  borderTopWidth: 0,
  paddingBottom:25,
  height:80
}


const BottomTabNavigator = createBottomTabNavigator(
  {
    StackTasks,
    StackPickup,
    StackSearch,
    StackCycle,
    StackLibrary
  },
  {
    initialRouteName: 'StackSearch',
    tabBarComponent: (props) => <CustomTabBar {...props}  />,
    options :{
      tabBarVisible : true
    },
    tabBarOptions: {
      activeTintColor: colors.white,
      inactiveTintColor: colors.greyInactive,
      style: DeviceInfo.hasDynamicIsland() ? styleDynamicIsland : styleNotDynamicIsland
    }
  }
);

export default BottomTabNavigator;
