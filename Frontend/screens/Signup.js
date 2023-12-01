import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import axios from "axios";
import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


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
} from "./../components/styles";

const { brand, darklight, primary } = Colors;

import KeyboardWrapper from "./../components/keyboardWrapper";

const Signup = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const navigation = useNavigation();

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSignup = async (credentials, setSubmitting) => {
    handleMessage(null);

    try {
      const url = 'https://findmyspot.onrender.com/api/user/signup';
      const response = await axios.post(url, credentials);

      // console.log('Server Response:', response);

      const result = response.data;
      const { message, data } = result;

      if (message === 'User created successfully') {
        console.log('Navigating to Home page with data:', result);
        navigation.navigate('Home', { userData: result });
        setSubmitting(false);
      } else {
        console.log('Signup failed. Response Message:', message);
        console.log('Response Data:', data);
        setSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitting(false);

      if (error.code === 'ECONNABORTED') {
        handleMessage('Request timeout. Please try again.');
      } else if (error.response && error.response.data) {
        const { message, status } = error.response.data;
        handleMessage(message, status);
      } else {
        handleMessage('An error occurred. Please check your network connection.');
      }
    }
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
          <SubTitle>Account Signup</SubTitle>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (
                values.email == "" ||
                values.password == "" ||
                values.name == "" ||
                values.confirmPassword == ""
              ) {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage("Passwwords don't match");
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
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
                  label="Full Name"
                  icon="person"
                  placeholder="Full Name"
                  placholderTextColor={darklight}
                  onChangeText={handleChange("name")}
                  onChangeBlur={handleBlur("name")}
                  value={values.name}
                />
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
                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="Password"
                  placholderTextColor={darklight}
                  onChangeText={handleChange("confirmPassword")}
                  onChangeBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="small" color={primary} />
                  </StyledButton>
                )}
                <Line />

                <ExtraView>
                  <ExtraText>Already have an Account?</ExtraText>
                  <TextLink onPress={() => navigation.navigate("Login")}>
                    <TextLinkContent>Login</TextLinkContent>
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

export default Signup;
