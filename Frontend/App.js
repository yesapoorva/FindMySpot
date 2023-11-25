import { StyleSheet, Text, View } from "react-native";

import TabNavigation from "./TabNavigation";

export default function App() {
  
  return(
    <TabNavigation></TabNavigation>
  )


}



const styles = StyleSheet.create({
  container: {
 
    backgroundColor: "#ffbbbb",
   

    paddingTop: 48,
    paddingBottom: 36,
    //paddingHorizontal:2

    height:700,

   
  },

});
