import * as React from 'react';

import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import HomeScreen from '../screens/HomeScreen';
import Products from '../screens/product/Products';
import DetailsProducts from '../screens/product/DetailsProducts';
import MoveProducts from '../screens/product/MoveProducts';
import PutawayLists from '../screens/putaway/PutawayList';
import ListHandover from '../screens/handover/ListHandover';
import CreatedHandoverList from '../screens/handover/CreateHandover';
import SvgTabSearch from '../components/icons/Svg.TabSearch';
import DetailScreen from '../screens/handover/DetailScreen';
import ListInbound from '../screens/inbound/ListInbound';
import MoveListProduct from '../screens/product/MoveListProduct';
import NotifyScreen from '../screens/NotifyScreen';
import ListOrderHandover from '../screens/ListOrderHandover';


const Icon = ({ focused }) => <SvgTabSearch active={focused} />;

Icon.propTypes = {
  // required
  focused: PropTypes.bool.isRequired
};

export default createStackNavigator(
  {
    SearchMain: {
      screen: HomeScreen,
      navigationOptions: {
        cardStyle: { backgroundColor: 'transparent' , opacity: 1}
      }
    },
    Products,
    DetailsProducts,
    MoveProducts,
    PutawayLists,
    ListHandover,
    CreatedHandoverList,
    DetailScreen,
    ListInbound,
    MoveListProduct,
    NotifyScreen,
    ListOrderHandover
  },
  {
    headerMode: 'none',
    detachPreviousScreen : true,
    screenOptions:{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      animationEnabled: false,
    },
    navigationOptions: ({ screenProps: { t },navigation }) => ({
      tabBarLabel: t('screen.menu.home'),
      tabBarIcon: Icon
    })
  }
);
