import {createStackNavigator} from '@react-navigation/stack';


import Destination from '../screens/Destination';
import ConfirmSpots from '../screens/ConfirmSpots';
import BookingConfirmed from '../screens/BookingConfirmed';



const Stack = createStackNavigator();

export default function DestinationStack(){
    return(
        <Stack.Navigator
        initialRouteName='Destination'
        screenOptions={{
            headerShown:false,
        }}>
            <Stack.Screen name='Destination' component={Destination}></Stack.Screen>
            <Stack.Screen name='ConfirmSpots' component={ConfirmSpots}></Stack.Screen>
            <Stack.Screen name='BookingConfirmed' component={BookingConfirmed}></Stack.Screen>
        </Stack.Navigator>
    )
}