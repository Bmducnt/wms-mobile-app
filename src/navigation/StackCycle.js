import { createStackNavigator } from '@react-navigation/stack';

// screens
import ListInventory from '../screens/inventory_control/ListInventory';
import DetailResquest from '../screens/inventory_control/DetailResquest';

const Stack = createStackNavigator();

const StackCycleNavigator = ()=> {
    return (
        <Stack.Navigator
            initialRouteName="ListInventory"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                headerShown: false,
            }}>
            <Stack.Screen name="ListInventory">
                {props => <ListInventory {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="DetailResquest">
                {props => <DetailResquest {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
export default StackCycleNavigator
