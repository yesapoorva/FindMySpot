import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../components/styles';



// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import BookingConfirmed from './../screens/BookingConfirmed';
import ConfirmSpots from './../screens/ConfirmSpots';
import MyBookings from './../screens/MyBookings';
import ParkingSpots from './../screens/ParkingSpots';
import Home from '../screens/Home';
import Destination from '../screens/Destination';
import UserProfile from '../screens/UserProfile';

const Stack = createNativeStackNavigator();

const {primary, tertiary, brand} = Colors;

const RootStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyled: {
                        backgroundColor: 'transparent'
                    },
                    headerTintColor: brand,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    }
                }}
                initialRouteName='Login'
                >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen options={{headerTintColor: brand}} name="Home" component={Home} />
                <Stack.Screen name="BookingConfirmed" component={BookingConfirmed} />
                <Stack.Screen name="ConfirmSpots" component={ConfirmSpots} />
                <Stack.Screen name="MyBookings" component={MyBookings} />
                <Stack.Screen name="ParkingSpots" component={ParkingSpots} />
                <Stack.Screen name="Destination" component={Destination} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;