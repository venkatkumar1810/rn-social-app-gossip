import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const MessagesScreen = ({ navigation }) => {

  const [users, setUsers] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const list = [];
      await firestore()
        .collection('users')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);
          querySnapshot.forEach((doc) => {
            if (doc.id != user.uid) {
              const {
                fname,
                lname,
                userImg,
                createdAt,
                email,
              } = doc.data();
              list.push({
                id: doc.id,
                userName: fname + " " + lname,
                userImage: userImg,
                messageTime: "Now",
                messageText: "new message",
                email: email,
              });
            }
          });
        });

      if (loading) {
        setLoading(false);
      }
      setUsers(list);
      // console.log('users: ', users);
    } catch (e) {
      console.log(e);
      console.log("!! HEREHERE !!");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <Container>
      {loading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('Chat', { userId: item.email, username: item.userName })}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={{ uri: item.userImage }} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    {/* <PostTime>{item.messageTime}</PostTime> */}
                  </UserInfoText>
                  {/* <MessageText>{item.messageText}</MessageText> */}
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      )}
    </Container>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
