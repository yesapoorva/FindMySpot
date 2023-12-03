import React from "react";
import RootStack from "./navigators/RootStack";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Sending']);
export default function App() {
  return <RootStack />;
}
