import React from "react";
import RootStack from "./navigators/RootStack";
import { AuthProvider } from "./components/AuthContext";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Sending"]);

export default function App() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
