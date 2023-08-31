import { createStackNavigator } from '@react-navigation/stack';

// screens
import PickupsLists from '../screens/pickups/ListPickup';
import PickupDetails from '../screens/pickups/DetailPickup';
import PickupRules from '../screens/pickups/PickupRules'

const Stack = createStackNavigator();

const StackPickupNavigator = ()=> {
    return (
        <Stack.Navigator
            initialRouteName="PickupsLists"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                headerShown: false,
            }}>
            <Stack.Screen name="PickupsLists">
                {props => <PickupsLists {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="PickupDetails">
                {props => <PickupDetails {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="PickupRules">
                {props => <PickupRules {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
export default StackPickupNavigator
