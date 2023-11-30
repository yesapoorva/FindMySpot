import {
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState } from "react";

//import styling
import styles from "./LoginPageStyling";

export default function LoginPage(props) {
  //initialise states
  const [displayLogin, setDisplayLogin] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <Pressable style={styles.tab}>
              <View >
                <Text>Login</Text>
              </View>
            </Pressable>

            <Pressable style={styles.tab}>
              <View>
                <Text>SignUp</Text>
              </View>
            </Pressable>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


// login page function


function LoginBox() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");

  return (
    <View style={styles.loginBox}>
      <Text style={styles.title}>Login with</Text>
      {/* input for username */}
      <Text style={styles.SecondaryTitle}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="enter email"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrorMessage("");
        }}
      ></TextInput>

      {/* input for password */}
      <Text style={styles.SecondaryTitle}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="enter password"
        secureTextEntry={true}
        value={password}
        /* below event is similer to onchange  event from react DOM*/
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage("");
        }}
      ></TextInput>

      <Text style={{ color: "red", alignSelf: "center" }}>{error}</Text>

      <View style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </View>

      <Text style={{ paddingVertical: 16, color: "#26628E" }}>
        Forgot Password?
      </Text>
    </View>
  );
}


//Sign up page function

function SignUpBox(){
    return(
        <View>
            <Text>sfddfgbh</Text>
        </View>
    )
}