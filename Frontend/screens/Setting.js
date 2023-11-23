import { View , Text , StyleSheet} from "react-native"
import Map2 from './Map2'



export default function Setting({navigation}){
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