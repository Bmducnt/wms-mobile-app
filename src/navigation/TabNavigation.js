import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants';

// navigation stacks
import ListInventory from "../screens/inventory_control/ListInventory";

const Tab = createBottomTabNavigator();




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
import SvgTabCycle from '../components/icons/Svg.Cycle';
import PropTypes from "prop-types";
import {translate} from "../i18n/locales/IMLocalized";
import {createStackNavigator} from "@react-navigation/stack";
import SvgTabPicked from "../components/icons/Svg.Picked";
import SvgTabSearch from "../components/icons/Svg.TabSearch";
import StackSearchNavigator from "./StackSearch";
import StackPickupNavigator from "./StackPickup";
import StackCycleNavigator from "./StackCycle";
import StackTasksNavigator from "./StackTasks";
import SvgTabTask from "../components/icons/Svg.Tasks";
import SvgTabLibrary from "../components/icons/Svg.TabLibrary";
import StackLibraryNavigator from "./StackLibrary";

const IconTasks = ({ focused }) => <SvgTabTask active={focused} />;

const IconCycle = ({ focused }) => <SvgTabCycle active={focused} />;
const IconPicked = ({ focused }) => <SvgTabPicked active={focused} />;
const IconSearch = ({ focused }) => <SvgTabSearch active={focused} />;

const IconLibrary = ({ focused }) => <SvgTabLibrary active={focused} />;

IconSearch.propTypes = {
    // required
    focused: PropTypes.bool.isRequired
};


IconCycle.propTypes = {
    // required
    focused: PropTypes.bool.isRequired
};

IconPicked.propTypes = {
    // required
    focused: PropTypes.bool.isRequired
};
IconTasks.propTypes = {
    // required
    focused: PropTypes.bool.isRequired
};
IconLibrary.propTypes = {
    // required
    focused: PropTypes.bool.isRequired
};

const BottomTabNavigator = () => {
    const IconSize = 22;
    return (
        <Tab.Navigator
            initialRouteName="StackSearch"
            screenOptions={{
                tabBarActiveTintColor: colors.whiteBg,
                tabBarInactiveTintColor: colors.darkgray,
                tabBarStyle: DeviceInfo.hasDynamicIsland()
                    ? styleDynamicIsland
                    : styleNotDynamicIsland,
            }}>
            <Tab.Screen
                name="StackTasksNavigator"
                component={StackTasksNavigator}
                options={{
                    tabBarLabel: translate('screen.menu.task'),
                    headerShown: false,
                    tabBarIcon: IconTasks,
                }}
            />
            <Tab.Screen
                name="PickupNavigator"
                component={StackPickupNavigator}
                options={{
                    tabBarLabel: translate('screen.menu.pickup'),
                    headerShown: false,
                    tabBarIcon: IconPicked,
                }}
            />
            <Tab.Screen
                name="StackSearch"
                component={StackSearchNavigator}
                options={{
                    tabBarLabel: translate('screen.menu.home'),
                    headerShown: false,
                    tabBarIcon: IconSearch,
                }}
            />
            <Tab.Screen
                name="StackCycleNavigator"
                component={StackCycleNavigator}
                options={{
                    tabBarLabel: translate('screen.menu.inventory_control'),
                    headerShown: false,
                    tabBarIcon: IconCycle,
                }}
            />
            <Tab.Screen
                name="StackLibraryNavigator"
                component={StackLibraryNavigator}
                options={{
                    tabBarLabel: translate('screen.menu.settings'),
                    headerShown: false,
                    tabBarIcon: IconLibrary,
                }}
            />
        </Tab.Navigator>
    )
}
export default BottomTabNavigator;
