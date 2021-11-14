import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { AuthContext } from './AuthProvider';
import { AuthContext } from '../navigation/AuthProvider';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserImg } from '../styles/FeedStyles';

const ChatScreen = (props) => {
  // console.log("user ide ", props.route.params.userId);
  let otherUser = props.route.params.userId;
  let currentUser = auth().currentUser?.email;
  console.log("Other user : ", otherUser);
  console.log("Current user : ", currentUser);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [users, setusers] = useState()

  const user = auth().currentUser;
  const fetchUser = async () => {
    try {
      let list;
      await firestore()
        .collection('users')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id == user.uid) {
              const {
                userImg,
                email,
                fname,
                lname,
              } = doc.data();
              list = {
                userId: doc.id,
                userImg: userImg,
                userName: fname + ' ' + lname,
                userEmail: email,
              };
            }
          });
        });

      setusers(list);
      console.log('users: ', users);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let list = [];
      await firestore()
        .collection('chats')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().user._id == currentUser && doc.data().user.otheruser == otherUser || doc.data().user._id == otherUser && doc.data().user.otheruser == currentUser) {
              const {
                _id,
                createdAt,
                text,
                user,
              } = doc.data();
              list.push({
                _id: _id,
                createdAt: createdAt.toDate(),
                text: text,
                user: user
              });
            }
          });
        });

      if (loading) {
        setLoading(false);
      }
      setMessages(list);
    } catch (e) {
      console.log(e);
    }
  }
  // fetchUser();
  useEffect(() => {
    fetchUser();
    fetchMessages();
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    const {
      _id,
      createdAt,
      text,
      user
    } = messages[0];
    firestore()
      .collection('chats')
      .add({
        _id,
        createdAt,
        text,
        user
      })
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="#2c6e49"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2c6e49',
          },
          left: {
            backgroundColor: '#ced4da'
          }
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }
  console.log("messsages : ", messages);
  return (
    <>
      {
        loading ? (
          <View style={styles.activity} >
            <ActivityIndicator size="large" color="#0000ff" />
          </View >
        ) : (
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: auth().currentUser?.email,
              name: users ? users.userName : " ",
              otheruser: otherUser,
              avatar: users ? users.userImg.toString() : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
          />
        )}
    </>

  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
