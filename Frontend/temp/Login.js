import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import axios from "axios";
import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  MsgBox,
  Line,
  Colors,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from "../components/styles";

const { brand, darklight, primary } = Colors;

import KeyboardWrapper from "../components/keyboardWrapper";
import { storeUserToken } from "../components/secureStore";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [userToken, setUserToken] = useState(null);

  const handleLogin = async (credentials, setSubmitting) => {
    handleMessage(null);

    try {
      const url = "https://findmyspot.onrender.com/api/user/login";
      const response = await axios.post(url, credentials);

      // console.log('Server Response:', response);

      const result = response.data;
      const { message, data } = result;

      if (message === "User logged in successfully" ) {
        await storeUserToken(result.token);
        console.log("Navigating to Home page with data:", result);
        navigation.navigate("TabNavigation", { userData: result });
        setUserToken(result.token);
        setSubmitting(false);
      } else {
        console.log("Signin failed. Response Message:", message);
        console.log("Response Data:", data);
        setSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitting(false);

      if (error.code === "ECONNABORTED") {
        handleMessage("Request timeout. Please try again.");
      } else if (error.response && error.response.data) {
        const { message, status } = error.response.data;
        handleMessage(message, status);
      } else {
        handleMessage(
          "An error occurred. Please check your network connection."
        );
      }
    }
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <KeyboardWrapper>
      <StyledContainer>
        <InnerContainer>
          <PageLogo
            resizeMode="contain"
            source={require("./../assets/img/officialLogo.png")}
          />
          <PageTitle>FindMySpot</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == "" || values.password == "") {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="Email Address"
                  placholderTextColor={darklight}
                  onChangeText={handleChange("email")}
                  onChangeBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="Password"
                  placholderTextColor={darklight}
                  onChangeText={handleChange("password")}
                  onChangeBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="small" color={primary} />
                  </StyledButton>
                )}
                {/* <Line /> */}
                {/* <StyledButton google={true} onPress={handleSubmit}>
                  <Fontisto name="google" color={primary} size={25} />
                  <ButtonText google={true}>Sign In with Google</ButtonText>
                </StyledButton> */}
                <ExtraView>
                  <ExtraText>Don't have an Account?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>SignUp</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardWrapper>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={darklight}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
