import { createStackNavigator } from '@react-navigation/stack';
import DetailTask from "../screens/tasks/DetailTask";
import ListTasks from "../screens/tasks/ListTasks";

const Stack = createStackNavigator();

const StackTasksNavigator = ()=> {
    return (
        <Stack.Navigator
            initialRouteName="ListTasks"
            screenOptions={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                headerShown: false,
            }}>
            <Stack.Screen name="ListTasks">
                {props => <ListTasks {...props}/>}
            </Stack.Screen>
            <Stack.Screen name="DetailTask">
                {props => <DetailTask {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
export default StackTasksNavigator
