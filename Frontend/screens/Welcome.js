import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

// import {
//   InnerContainer,
//   PageTitle,
//   SubTitle,
//   StyledFormArea,
//   StyledButton,
//   ButtonText,
//   Line,
//   WelcomeConatiner,
//   WelcomeImage,
//   Avatar,
// } from "./../components/styles";

import {
  StyledContainer,
  CompanyLogo,
  Brand,
  Search,
} from "../components/welcomeStyles";
import { StyledFormArea, Colors } from "../components/styles";
// import { InnerContainer } from "../components/styles";

const { brand, darklight, primary } = Colors;

const Welcome = ({ navigation, route }) => {
  const { userData } = route.params;

  const { name = "Bharat Nara", email = "bharatnara@outlook.com" } =
    userData || {};

  return (
    <>
      {/* <InnerContainer> */}
      <StyledContainer>
        <CompanyLogo>
          <Brand>FindMySpot</Brand>
        </CompanyLogo>
        <TextInput style={styles.input} placeholder="Search" />
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ParkingSpots");
            }}
          >
            <Text>Parking Spots</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ConfirmSpots");
            }}
          >
            <Text>Confirm MySpot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BookingConfirmed");
            }}
          >
            <Text>Booking Confirmed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MyBookings");
            }}
          >
            <Text>My Bookings</Text>
          </TouchableOpacity>
        </View>
      </StyledContainer>
      {/* </InnerContainer> */}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    margin: 20,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderColor: "#0F81C7",
    shadowColor: "black",
    shadowOpacity: 0.5,
    overflow: "hidden",
  },
});

export default Welcome;

{
  /* <InnerContainer>
        <StyledContainer>
          <WelcomeImage
            resizeMode="contain"
            source={require("./../assets/img/officialLogo.png")}
          />
          <WelcomeConatiner>
            <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
            <SubTitle welcome={true}>{name}</SubTitle>
            <SubTitle welcome={true}>{email}</SubTitle>
            <StyledFormArea>r
              <Avatar
                resizeMode="contain"
                source={require("./../assets/img/officialLogo.png")}
              />
              <Line />
              <StyledButton
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <ButtonText>Logout</ButtonText>
              </StyledButton>
            </StyledFormArea>
          </WelcomeConatiner>
        </StyledContainer>
      </InnerContainer> */
}
