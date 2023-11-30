import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../Components/styles';



// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import TabNavigation from './TabNavigation';



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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;