import { createStackNavigator } from '@react-navigation/stack';

// screens
import HomeScreen from '../screens/HomeScreen';
import Products from '../screens/product/Products';
import DetailsProducts from '../screens/product/DetailsProducts';
import MoveProducts from '../screens/product/MoveProducts';
import PutawayLists from '../screens/putaway/PutawayList';
import ListHandover from '../screens/handover/ListHandover';
import CreatedHandoverList from '../screens/handover/CreateHandover';
import DetailScreen from '../screens/handover/DetailScreen';
import ListInbound from '../screens/inbound/ListInbound';
import MoveListProduct from '../screens/product/MoveListProduct';
import NotifyScreen from '../screens/NotifyScreen';
import ListOrderHandover from '../screens/ListOrderHandover';


const Stack = createStackNavigator();

const StackSearchNavigator = ()=> {
    return(
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                headerShown: false,
            }}>
            <Stack.Screen name="HomeScreen">
                {props => <HomeScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="Products" >
                {props => <Products {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="DetailsProducts" >
                {props => <DetailsProducts {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="MoveProducts" >
                {props => <MoveProducts {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="PutawayLists" >
                {props => <PutawayLists {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ListHandover" >
                {props => <ListHandover {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="CreatedHandoverList" >
                {props => <CreatedHandoverList {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="DetailScreen" >
                {props => <DetailScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ListInbound" >
                {props => <ListInbound {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="MoveListProduct" >
                {props => <MoveListProduct {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="NotifyScreen" >
                {props => <NotifyScreen {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ListOrderHandover" >
                {props => <ListOrderHandover {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

export default StackSearchNavigator
