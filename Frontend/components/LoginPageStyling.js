import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minWidth: "100%",
    height: "100%",

    backgroundColor:'#42A0B4',
  },

  tabContainer: {
   
    height: 100,

    display:'flex',
    flexDirection:'row',


    borderWidth: 1,
    borderColor: "green",
    borderStyle: "dotted",
  },

  tab: {

    width: "50%",
    height: "90%",

    display:'flex',
    justifyContent:'center',
    alignItems:'center',

    borderWidth: 1,
    borderColor: "yellow",
    borderStyle: "solid",

  },

  loginBox: {
    borderWidth: 3,
    borderColor: "red",
    borderStyle: "dotted",

    paddingVertical: "3%",
    paddingHorizontal: "2%",

    marginVertical: "5%",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    //fontFamily: 'Roboto',
    marginVertical: 25,
  },

  SecondaryTitle: {
    fontSize: 20,
  },

  input: {
    minHeight: 48,

    //marginHorizontal: "5%",
    marginVertical: "3%",

    paddingHorizontal: "5%",

    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "black",
  },

  loginButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    height: 48,
    borderRadius: 10,

    backgroundColor: "#26628E",
  },

  loginText: {
    fontSize: 20,
    color: "white",
  },
});

export default styles;
