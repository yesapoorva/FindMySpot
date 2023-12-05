import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from './../components/styles';



// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();

const { primary, tertiary, brand } = Colors;

const RootStack = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated on component mount
    const checkAuthentication = async () => {
      const token = await getUserToken();
      // Set the user token in the state
      setUserToken(token);
    };

    checkAuthentication();
  }, []);




  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={userToken ? 'TabNavigation' : 'Login'}
      >
        <Stack.Screen name="Login">
          {(props) => <Login {...props} setUserToken={setUserToken} />}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {(props) => <Signup {...props} setUserToken={setUserToken} />}
        </Stack.Screen>
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
