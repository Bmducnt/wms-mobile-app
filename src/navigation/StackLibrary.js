import { createStackNavigator } from '@react-navigation/stack';

// screens
import SettingsStaff from '../screens/SettingsStaff';

const Stack = createStackNavigator();


const StackLibraryNavigator = ()=> {
  return (
      <Stack.Navigator
          initialRouteName="SettingsStaff"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            headerShown: false,
          }}>
        <Stack.Screen name="SettingsStaff">
          {props => <SettingsStaff {...props}/>}
        </Stack.Screen>
      </Stack.Navigator>
  )
}
export default StackLibraryNavigator
