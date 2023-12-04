import { View , Text , StyleSheet, TouchableOpacity} from "react-native"



export default function UserProfile({navigation}){

    function handleLogout(){

        navigation.navigate("Login")
        console.log("loggin out...")
    }
    return(
        <View style={styles.container}>
            <Text style={{alignSelf:'center'}}> setting screen </Text>

                <TouchableOpacity 
                style={styles.logoutContainer}
                onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
        

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

    logoutContainer:{
        height: 48,
        width: "90%",

        position:'absolute',
        alignSelf:'center',
        bottom:30,

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent:'center',

        borderRadius: 10,
        backgroundColor: "#0F81C7",
      
    },
    logoutText:{
        fontSize:20,
        color:'white'
    },
})