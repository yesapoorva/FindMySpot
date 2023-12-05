import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getUserToken, deleteUserToken } from '../components/secureStore';
import base64 from 'base-64';

const UserProfile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Fetch and display user details when the component mounts
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await getUserToken();
  
      if (token) {
        console.log('Token:', token); // Log the token
  
        // Decode the token to extract user details (assuming it's a JWT)
        const decodedToken = JSON.parse(base64.decode(token.split('.')[1]));
        console.log('Decoded Token:', decodedToken); // Log the decoded token
  
        setUserInfo(decodedToken); // Set user details to state
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  const handleLogout = async () => {
    await deleteUserToken(); // Clear user token
    navigation.navigate('Login'); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>Username: {userInfo.username}</Text>
          <Text style={styles.cardText}>Email: {userInfo.email}</Text>
          <Text style={styles.cardText}>id: {userInfo.id}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F1F2F6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutContainer: {
    backgroundColor: '#0F81C7',
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfile;
