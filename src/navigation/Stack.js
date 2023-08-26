import { createStackNavigator } from '@react-navigation/stack';


// navigation
import TabNavigation from './TabNavigation';

// screens
import ModelWarehouseOption from '../screens/ModelWarehouseOption';
import colors from '../constants/colors'
import SignInScreen from '../screens/Signin';
import ModalListCarrier from '../screens/handover/ModelListCarrier';
import ModelHandoverB2B from '../screens/handover/ModelHandoverB2B';
import ModalPutawayUpdate from '../screens/putaway/PutawayUpdate';
import ModalPickupUpdate from '../screens/pickups/UpdatePickup';
import ModalPickupQRCode from '../screens/pickups/QrPickup';
import ModalQickAction from '../screens/QuickAction';
import ModalImageBase from '../screens/ModalImageBase';
import UpdateException from '../screens/pickups/UpdateException';
import SignatureScreenBase from '../screens/handover/SignatureScreen';
import ModelTimelineTracking from '../screens/ModelTimelineTracking';
import ModelReceivedShipment from '../screens/ReceivedShipment';
import ModelListStaff from '../screens/pickups/ModelListStaff';
import CreateResquest from '../screens/inventory_control/CreateResquest';
import UpdateRequest from '../screens/inventory_control/UpdateRequest';
import RejectHandover from '../screens/handover/RejectHandover';
import MoveModel from '../screens/product/MoveModel';
import ModalUpdatePacked from '../screens/packed/UpdatePacked';
import AddTasks from '../screens/tasks/AddTask';
import ImagesViewList from '../screens/tasks/ImagesViewList';
import UpdateTasks from '../screens/tasks/UpdateTasks';
import HandoverImages from '../screens/handover/HandoverImages';
import QcScreens from '../screens/quality_control/QcScreens';

const StackAuthNavigator = ()=> {
    return(
        <Stack.Navigator
            initialRouteName="SignInScreen"
            screenOptions={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal'
            }}>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="ModelWarehouseOption" component={ModelWarehouseOption} />
        </Stack.Navigator>
      )
}



const StackNavigator = ()=> {
    return (
        <Stack.Navigator
            initialRouteName="TabNavigation"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animationEnabled: true,
            }}>
            <Stack.Screen name="ModalPutawayUpdate" component={ModalPutawayUpdate} />
            <Stack.Screen name="ModalPickupUpdate" component={ModalPickupUpdate} />
            <Stack.Screen name="ModalListCarrier" component={ModalListCarrier} />
            <Stack.Screen name="ModelHandoverB2B" component={ModelHandoverB2B} />
            <Stack.Screen name="ModalPickupQRCode" component={ModalPickupQRCode} />
            <Stack.Screen name="ModalImageBase" component={ModalImageBase} />
            <Stack.Screen name="UpdateException" component={UpdateException} />
            <Stack.Screen name="ModelTimelineTracking" component={ModelTimelineTracking} />
            <Stack.Screen name="ModelReceivedShipment" component={ModelReceivedShipment} />
            <Stack.Screen name="ModelListStaff" component={ModelListStaff} />
            <Stack.Screen name="CreateResquest" component={CreateResquest} />
            <Stack.Screen name="UpdateRequest" component={UpdateRequest} />
            <Stack.Screen name="SignatureScreenBase" component={SignatureScreenBase} />
            <Stack.Screen name="RejectHandover" component={RejectHandover} />
            <Stack.Screen name="MoveModel" component={MoveModel} />
            <Stack.Screen name="ModalUpdatePacked" component={ModalUpdatePacked} />
            <Stack.Screen name="AddTasks" component={AddTasks} />
            <Stack.Screen name="ImagesViewList" component={ImagesViewList} />
            <Stack.Screen name="UpdateTasks" component={UpdateTasks} />
            <Stack.Screen name="HandoverImages" component={HandoverImages} />
            <Stack.Screen name="QcScreens" component={QcScreens} />
        </Stack.Navigator>
    )
}

const Stack = createStackNavigator();
const MainStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="App" component={StackNavigator} />
            <Stack.Screen name="Auth" component={StackAuthNavigator} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator
