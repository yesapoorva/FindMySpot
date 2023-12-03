import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

//import screen
import Home from "../screens/Home";
import UserProfile from '../screens/UserProfile'
import DestinationStack from "./DestinationStack";

const Tab = createBottomTabNavigator();

export default function TabNavigation({route}) {

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // bottom label
          tabBarShowLabel: false,
          // screen header or screen name
          headerShown:false,
          //tab bar styling
          tabBarStyle: styles.tabContainer,

          //icon styling
          tabBarIconStyle: styles.tabIconContainer,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            size = 40;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "DestinationStack") {
              iconName = focused ? "car" : "car-outline";
            } else if (route.name === "UserProfile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "black",
        })}
      >
        <Tab.Screen name="Home" component={Home} initialParams={route.params}></Tab.Screen>
        <Tab.Screen name="DestinationStack" component={DestinationStack} ></Tab.Screen>
        <Tab.Screen name="UserProfile" component={UserProfile} initialParams={route.params}></Tab.Screen>
      </Tab.Navigator>
  );
}

//styling
const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#0F81C7",
    height: 88,
  },
  tabIconContainer: {
    marginTop: 8,
  },
});
