import { View , Text , StyleSheet} from "react-native"



export default function UserProfile({navigation}){
    return(
        <View style={styles.container}>
            <Text style={{alignSelf:'center'}}> setting screen </Text>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 48,
  
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: "red",
    },
})