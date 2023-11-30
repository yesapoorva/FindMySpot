import React from "react";
import { View, Text , StyleSheet} from "react-native";

const BookingConfirmed = () => {
    return (
        <View style={styles.container}>
            <Text>Booking Confirmed</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 48,

      display:'flex',
      justifyContent:'center',
      alignItems:'center',
  
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: "red",
    },
})
export default BookingConfirmed;