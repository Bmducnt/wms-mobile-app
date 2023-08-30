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

const Stack = createStackNavigator();

const StackAuthNavigator = ()=> {
    return(
        <Stack.Navigator
            initialRouteName="SignInScreen"
            screenOptions={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                headerShown: false,
            }}>
            <Stack.Screen name="SignInScreen">
                {props => <SignInScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="ModelWarehouseOption" >
                {props => <ModelWarehouseOption {...props} />}

            </Stack.Screen>
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
                headerShown: false,
            }}>
            <Stack.Screen name="ModalPutawayUpdate">
                {props => <ModalPutawayUpdate {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModalPickupUpdate">
                {props => <ModalPickupUpdate {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="TabNavigation">
                {props => <TabNavigation {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModalListCarrier">
                {props => <ModalListCarrier {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModelHandoverB2B">
                {props => <ModelHandoverB2B {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModalPickupQRCode">
                {props => <ModalPickupQRCode {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModalImageBase">
                {props => <ModalImageBase {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="UpdateException">
                {props => <UpdateException {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModelTimelineTracking">
                {props => <ModelTimelineTracking {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModelReceivedShipment">
                {props => <ModelReceivedShipment {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModelListStaff">
                {props => <ModelListStaff {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="CreateResquest">
                {props => <CreateResquest {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="UpdateRequest">
                {props => <UpdateRequest {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="SignatureScreenBase">
                {props => <SignatureScreenBase {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="RejectHandover">
                {props => <RejectHandover {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="MoveModel">
                {props => <MoveModel {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ModalUpdatePacked">
                {props => <ModalUpdatePacked {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="AddTasks">
                {props => <AddTasks {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="ImagesViewList">
                {props => <ImagesViewList {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="UpdateTasks">
                {props => <UpdateTasks {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="HandoverImages">
                {props => <HandoverImages {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="QcScreens">
                {props => <QcScreens {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}

const MainStackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="App">
                {props => <StackNavigator {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="Auth">
                {props => <StackAuthNavigator {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default MainStackNavigator
