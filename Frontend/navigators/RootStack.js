import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from './../components/styles';



// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import TabNavigation from './TabNavigation';
import Home from '../screens/Home';
import BookingConfirmed from './../screens/BookingConfirmed';
import ConfirmSpots from './../screens/ConfirmSpots';
import MyBookings from './../screens/MyBookings';
import ParkingSpots from './../screens/ParkingSpots';


const Stack = createNativeStackNavigator();

const {primary, tertiary, brand} = Colors;

const RootStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                // screenOptions={{
                //     headerStyled: {
                //         backgroundColor: 'transparent'
                //     },
                //     headerTintColor: brand,
                //     headerTransparent: true,
                //     headerTitle: '',
                //     headerLeftContainerStyle: {
                //         paddingLeft: 20
                //     }
                // }}

                screenOptions={{
                    headerShown:false,
                }}
                initialRouteName='Login'
                >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name='TabNavigation' component={TabNavigation}/>
                <Stack.Screen options={{headerTintColor: brand}} name="Home" component={Home} />
                <Stack.Screen name="BookingConfirmed" component={BookingConfirmed} />
                <Stack.Screen name="ConfirmSpots" component={ConfirmSpots} />
                <Stack.Screen name="MyBookings" component={MyBookings} />
                <Stack.Screen name="ParkingSpots" component={ParkingSpots} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;