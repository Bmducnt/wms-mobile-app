import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';


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

const StackAuthNavigator =  createStackNavigator(
  {
    SignInMain: {
      screen: SignInScreen
    },
    ModelWarehouseOption: {
      screen: ModelWarehouseOption,
      navigationOptions: {
        cardStyle: { backgroundColor: colors.blackBg , opacity: 1}
      }
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      tabBarLabel: 'User'
    },
    screenOptions:{
      gestureEnabled: true,
      gestureDirection: 'horizontal'
    }
  }
);



const StackNavigator = createStackNavigator(
  {
    // Main Tab Navigation
    // /////////////////////////////////////////////////////////////////////////
    TabNavigation,

    // Modals
    // /////////////////////////////////////////////////////////////////////////
    ModalPutawayUpdate,
    ModalPickupUpdate,
    ModalListCarrier,
    ModelHandoverB2B,
    ModalPickupQRCode,
    ModalQickAction,
    ModalImageBase,
    UpdateException,
    SignatureScreenBase,
    ModelTimelineTracking,
    ModelReceivedShipment,
    ModelListStaff,
    CreateResquest,
    UpdateRequest,
    RejectHandover,
    MoveModel,
    ModalUpdatePacked,
    AddTasks,
    ImagesViewList,
    UpdateTasks,
    HandoverImages,
    QcScreens
  },
  {
    headerMode: 'none',
    initialRouteName: 'TabNavigation',
    mode: 'modal',
    detachPreviousScreen : true,
    screenOptions:{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      animationEnabled: true,
    }
  },
);

const App = createAppContainer(createSwitchNavigator(
    {
        App: StackNavigator, 
        Auth: StackAuthNavigator
    }, 
    {
        initialRouteName: 'Auth'
    }
));

export default App;
